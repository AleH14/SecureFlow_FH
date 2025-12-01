const express = require('express');
const User = require('../models/user');
const { auth, admin } = require('../middleware/auth');
const { 
  asyncHandler, 
  sendResponse, 
  sendError 
} = require('../utils/helpers');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get('/', auth, admin, asyncHandler(async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Parámetros de filtrado opcionales
    const { departamento, rol, search } = req.query;

    // Construir filtro de búsqueda
    let filter = {};
    
    if (departamento) {
      filter.departamento = departamento;
    }
    
    if (rol) {
      filter.rol = rol;
    }
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellido: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } }
      ];
    }

    // Obtener usuarios con los campos especificados
    const users = await User.find(filter)
      .select('codigo nombre apellido email telefono departamento rol fechaCreacion')
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de usuarios para paginación
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Formatear respuesta con nombre completo
    const formattedUsers = users.map(user => ({
      id: user._id,
      codigo: user.codigo,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      email: user.email,
      telefono: user.telefono,
      departamento: user.departamento,
      rol: user.rol,
      fechaCreacion: user.fechaCreacion
    }));

    const responseData = {
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    sendResponse(res, 200, `${formattedUsers.length} usuarios obtenidos correctamente`, responseData);

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar usuario por ID
    const user = await User.findById(id)
      .select('codigo nombre apellido email telefono departamento rol fechaCreacion');

    if (!user) {
      return sendError(res, 404, 'Usuario no encontrado');
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
      fechaCreacion: user.fechaCreacion
    };

    sendResponse(res, 200, 'Usuario obtenido correctamente', userResponse);

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de usuario inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/users/stats/summary
// @desc    Get users statistics summary
// @access  Private (Admin only)
router.get('/stats/summary', auth, admin, asyncHandler(async (req, res) => {
  try {
    // Estadísticas por rol
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$rol',
          count: { $sum: 1 }
        }
      }
    ]);

    // Estadísticas por departamento
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$departamento',
          count: { $sum: 1 }
        }
      }
    ]);

    // Total de usuarios
    const totalUsers = await User.countDocuments();

    // Usuarios creados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      fechaCreacion: { $gte: thirtyDaysAgo }
    });

    const statsResponse = {
      totalUsers,
      recentUsers,
      roleDistribution: roleStats.map(stat => ({
        rol: stat._id,
        count: stat.count,
        percentage: ((stat.count / totalUsers) * 100).toFixed(1)
      })),
      departmentDistribution: departmentStats.map(stat => ({
        departamento: stat._id,
        count: stat.count,
        percentage: ((stat.count / totalUsers) * 100).toFixed(1)
      }))
    };

    sendResponse(res, 200, 'Estadísticas obtenidas correctamente', statsResponse);

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Update user endpoint - Coming soon`,
    data: { userId: id }
  });
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Delete user endpoint - Coming soon`,
    data: { userId: id }
  });
});

module.exports = router;