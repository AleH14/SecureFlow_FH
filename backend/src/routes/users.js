const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { auth, admin } = require("../middleware/auth");
const {
  asyncHandler,
  sendResponse,
  sendError,
  sanitizeInput,
  isValidEmail,
  isValidPassword,
} = require("../utils/helpers");

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get(
  "/",
  auth,
  admin,
  asyncHandler(async (req, res) => {
    try {
      // Parámetros de paginación
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Parámetros de filtrado opcionales
      const { departamento, rol, search, includeInactive } = req.query;

      // Construir filtro de búsqueda
      let filter = {};

      // Si no se pide incluir inactivos, solo mostrar activos
      if (includeInactive !== "true") {
        filter.estado = "activo";
      }

      if (departamento) {
        filter.departamento = departamento;
      }

      if (rol) {
        filter.rol = rol;
      }

      if (search) {
        filter.$or = [
          { nombre: { $regex: search, $options: "i" } },
          { apellido: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { codigo: { $regex: search, $options: "i" } },
        ];
      }

      // Obtener usuarios con los campos especificados
      const users = await User.find(filter)
        .select(
          "codigo nombre apellido email telefono departamento rol fechaCreacion estado"
        )
        .sort({ fechaCreacion: -1 })
        .skip(skip)
        .limit(limit);

      // Contar total de usuarios para paginación
      const totalUsers = await User.countDocuments(filter);
      const totalPages = Math.ceil(totalUsers / limit);

      // Formatear respuesta con nombre completo
      const formattedUsers = users.map((user) => ({
        id: user._id,
        codigo: user.codigo,
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        email: user.email,
        telefono: user.telefono,
        departamento: user.departamento,
        rol: user.rol,
        estado: user.estado, 
        fechaCreacion: user.fechaCreacion,
      }));

      const responseData = {
        users: formattedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          usersPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      sendResponse(
        res,
        200,
        `${formattedUsers.length} usuarios obtenidos correctamente`,
        responseData
      );
    } catch (error) {
      return sendError(res, 500, "Error interno del servidor");
    }
  })
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      // Buscar usuario por ID
      const user = await User.findOne({
        _id: id,
        estado: "activo",
      }).select(
        "codigo nombre apellido email telefono departamento rol fechaCreacion"
      );

      if (!user) {
        return sendError(res, 404, "Usuario no encontrado");
      }

      // Formatear respuesta con nombre completo
      const userResponse = {
        id: user._id,
        codigo: user.codigo,
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        email: user.email,
        telefono: user.telefono,
        departamento: user.departamento,
        rol: user.rol,
        fechaCreacion: user.fechaCreacion,
      };

      sendResponse(res, 200, "Usuario obtenido correctamente", userResponse);
    } catch (error) {
      if (error.name === "CastError") {
        return sendError(res, 400, "ID de usuario inválido");
      }
      return sendError(res, 500, "Error interno del servidor");
    }
  })
);

// @route   GET /api/users/stats/summary
// @desc    Get users statistics summary
// @access  Private (Admin only)
router.get(
  "/stats/summary",
  auth,
  admin,
  asyncHandler(async (req, res) => {
    try {
      // Estadísticas por rol
      const roleStats = await User.aggregate([
        {
          $group: {
            _id: "$rol",
            count: { $sum: 1 },
          },
        },
      ]);

      // Estadísticas por departamento
      const departmentStats = await User.aggregate([
        {
          $group: {
            _id: "$departamento",
            count: { $sum: 1 },
          },
        },
      ]);

      // Total de usuarios
      const totalUsers = await User.countDocuments();

      // Usuarios creados en los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentUsers = await User.countDocuments({
        fechaCreacion: { $gte: thirtyDaysAgo },
      });

      const statsResponse = {
        totalUsers,
        recentUsers,
        roleDistribution: roleStats.map((stat) => ({
          rol: stat._id,
          count: stat.count,
          percentage: ((stat.count / totalUsers) * 100).toFixed(1),
        })),
        departmentDistribution: departmentStats.map((stat) => ({
          departamento: stat._id,
          count: stat.count,
          percentage: ((stat.count / totalUsers) * 100).toFixed(1),
        })),
      };

      sendResponse(
        res,
        200,
        "Estadísticas obtenidas correctamente",
        statsResponse
      );
    } catch (error) {
      return sendError(res, 500, "Error interno del servidor");
    }
  })
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put(
  "/:id",
  auth,
  admin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido,
        email,
        telefono,
        departamento,
        rol,
        contrasena,
      } = req.body;

      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        return sendError(res, 404, "Usuario no encontrado");
      }

      // Sanitizar datos de entrada
      const sanitizedData = {
        nombre: sanitizeInput(nombre?.trim()),
        apellido: sanitizeInput(apellido?.trim()),
        email: email?.toLowerCase().trim(),
        telefono: sanitizeInput(telefono?.trim()),
        departamento: sanitizeInput(departamento?.trim()),
        rol: sanitizeInput(rol?.trim()),
      };

      // Validaciones básicas
      if (!sanitizedData.nombre || sanitizedData.nombre.length < 2) {
        return sendError(
          res,
          400,
          "El nombre debe tener al menos 2 caracteres"
        );
      }

      if (!sanitizedData.apellido || sanitizedData.apellido.length < 2) {
        return sendError(
          res,
          400,
          "El apellido debe tener al menos 2 caracteres"
        );
      }

      if (!sanitizedData.email || !isValidEmail(sanitizedData.email)) {
        return sendError(res, 400, "Email inválido");
      }

      if (!sanitizedData.telefono) {
        return sendError(res, 400, "El teléfono es requerido");
      }

      // Verificar que el email no esté en uso por otro usuario
      const existingUser = await User.findOne({
        email: sanitizedData.email,
        _id: { $ne: id }, // Excluir el usuario actual
      });
      if (existingUser) {
        return sendError(
          res,
          400,
          "El email ya está registrado por otro usuario"
        );
      }

      // Verificar departamento válido
      const validDepartments = [
        "Tecnologia_de_la_Informacion",
        "recursos_humanos",
        "seguridad",
        "auditoria",
        "finanzas",
        "operaciones",
        "legal_y_cumplimiento",
      ];

      if (!validDepartments.includes(sanitizedData.departamento)) {
        return sendError(res, 400, "Departamento inválido");
      }

      // Verificar rol válido
      const validRoles = [
        "administrador",
        "responsable_seguridad",
        "auditor",
        "usuario",
      ];
      if (!validRoles.includes(sanitizedData.rol)) {
        return sendError(res, 400, "Rol inválido");
      }

      // Preparar datos para actualizar
      const updateData = {
        nombre: sanitizedData.nombre,
        apellido: sanitizedData.apellido,
        email: sanitizedData.email,
        telefono: sanitizedData.telefono,
        departamento: sanitizedData.departamento,
        rol: sanitizedData.rol,
      };

      // Si se proporciona nueva contraseña, hashearla
      if (contrasena && contrasena.trim()) {
        if (!isValidPassword(contrasena)) {
          return sendError(
            res,
            400,
            "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número"
          );
        }
        const saltRounds = 12;
        updateData.contrasenaHash = await bcrypt.hash(contrasena, saltRounds);
      }

      // Actualizar usuario
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-contrasenaHash");

      // Formatear respuesta
      const userResponse = {
        id: updatedUser._id,
        codigo: updatedUser.codigo,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        departamento: updatedUser.departamento,
        rol: updatedUser.rol,
        fechaCreacion: updatedUser.fechaCreacion,
      };

      sendResponse(res, 200, "Usuario actualizado exitosamente", userResponse);
    } catch (error) {
      if (error.name === "ValidationError") {
        return sendError(res, 400, "Error de validación", error.message);
      }
      if (error.name === "CastError") {
        return sendError(res, 400, "ID de usuario inválido");
      }
      return sendError(res, 500, "Error interno del servidor");
    }
  })
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete(
  "/:id",
  auth,
  admin,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar que el usuario existe
      const user = await User.findOne({
        _id: id,
        estado: "activo",
      });

      if (!user) {
        return sendError(res, 404, "Usuario no encontrado o inactivo");
      }

      // Verificar que no se está intentando eliminar al propio usuario
      if (user._id.toString() === req.user.id) {
        return sendError(res, 400, "No puedes eliminar tu propia cuenta");
      }

      // Opcional: Verificar si el usuario tiene activos asociados o solicitudes pendientes
      // y decidir si permitir la eliminación o mostrar una advertencia

      // Borrado lógico: marcar como inactivo
      user.estado = "inactivo";
      await user.save();

      // Formatear respuesta con información del usuario eliminado
      const deletedUserInfo = {
        id: user._id,
        codigo: user.codigo,
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        email: user.email,
        rol: user.rol,
        departamento: user.departamento,
        estado: user.estado,
      };

      sendResponse(res, 200, "Usuario eliminado exitosamente", deletedUserInfo);
    } catch (error) {
      if (error.name === "CastError") {
        return sendError(res, 400, "ID de usuario inválido");
      }
      return sendError(res, 500, "Error interno del servidor");
    }
  })
);

// @route   PUT /api/users/:id/reactivate
// @desc    Reactivate inactive user
// @access  Private (Admin only)
router.put('/:id/reactivate', auth, admin, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe y está inactivo
    const user = await User.findOne({ 
      _id: id, 
      estado: "inactivo" 
    });
    
    if (!user) {
      return sendError(res, 404, 'Usuario no encontrado o ya está activo');
    }

    // Reactivar usuario
    user.estado = "activo";
    await user.save();

    // Formatear respuesta
    const reactivatedUserInfo = {
      id: user._id,
      codigo: user.codigo,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      email: user.email,
      rol: user.rol,
      departamento: user.departamento,
      estado: user.estado
    };

    sendResponse(res, 200, 'Usuario reactivado exitosamente', reactivatedUserInfo);

  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de usuario inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

module.exports = router;
