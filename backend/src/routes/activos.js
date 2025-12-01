const express = require('express');
const Activo = require('../models/activo');
const User = require('../models/user');
const { auth, admin } = require('../middleware/auth');
const { 
  asyncHandler, 
  sendResponse, 
  sendError, 
  sanitizeInput 
} = require('../utils/helpers');

const router = express.Router();

// Función para generar código único de activo
const generateActivoCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `ACT-${year}-${randomNum}`;
};

// @route   POST /api/activos
// @desc    Create new asset
// @access  Private (Authenticated users)
router.post('/', auth, asyncHandler(async (req, res) => {
  try {
    const {
      nombre,
      categoria,
      descripcion,
      ubicacion
    } = req.body;

    // Validaciones
    if (!nombre || !categoria) {
      return sendError(res, 400, 'Nombre y categoría son requeridos');
    }

    // Sanitizar inputs
    const sanitizedData = {
      nombre: sanitizeInput(nombre),
      categoria: sanitizeInput(categoria),
      descripcion: descripcion ? sanitizeInput(descripcion) : '',
      ubicacion: ubicacion ? sanitizeInput(ubicacion) : ''
    };

    // Verificar que la categoría sea válida
    const validCategories = ['Datos', 'Sistemas', 'Infraestructura', 'Personas'];
    if (!validCategories.includes(sanitizedData.categoria)) {
      return sendError(res, 400, 'Categoría inválida');
    }

    // Generar código único
    let codigo;
    let codigoExists = true;
    
    while (codigoExists) {
      codigo = generateActivoCode();
      const activoWithCode = await Activo.findOne({ codigo });
      if (!activoWithCode) {
        codigoExists = false;
      }
    }

    // Crear nuevo activo
    const newActivo = new Activo({
      codigo,
      nombre: sanitizedData.nombre,
      categoria: sanitizedData.categoria,
      descripcion: sanitizedData.descripcion,
      ubicacion: sanitizedData.ubicacion,
      responsableId: req.user._id, // Usuario logueado como responsable
      estado: 'En evaluacion', // Estado por defecto
      version: 'v1.0.0', // Versión por defecto
      fechaCreacion: new Date(),
      historialComentarios: [{
        comentario: 'Creacion de activo',
        usuario: req.user._id,
        fecha: new Date(),
        tipoAccion: 'creacion'
      }]
    });

    const savedActivo = await newActivo.save();

    // Actualizar el usuario para agregar este activo a su lista de activos creados
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { activosCreados: savedActivo._id } }
    );

    // Poblar información del responsable para la respuesta
    const populatedActivo = await Activo.findById(savedActivo._id)
      .populate('responsableId', 'nombre apellido email codigo');

    // Respuesta formateada
    const activoResponse = {
      id: populatedActivo._id,
      codigo: populatedActivo.codigo,
      nombre: populatedActivo.nombre,
      categoria: populatedActivo.categoria,
      descripcion: populatedActivo.descripcion,
      estado: populatedActivo.estado,
      ubicacion: populatedActivo.ubicacion,
      version: populatedActivo.version,
      fechaCreacion: populatedActivo.fechaCreacion,
      responsable: {
        id: populatedActivo.responsableId._id,
        codigo: populatedActivo.responsableId.codigo,
        nombreCompleto: `${populatedActivo.responsableId.nombre} ${populatedActivo.responsableId.apellido}`,
        email: populatedActivo.responsableId.email
      }
    };

    sendResponse(res, 201, 'Activo creado exitosamente', activoResponse);

  } catch (error) {
    console.error('Error creando activo:', error);
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos
// @desc    Get all assets with pagination and filtering
// @access  Private (Authenticated users)
router.get('/', auth, asyncHandler(async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Parámetros de filtrado específicos
    const { categoria, estado, responsable, nombre, codigo, search } = req.query;

    // Construir filtro de búsqueda
    let filter = {};
    
    // Filtro por categoría
    if (categoria) {
      filter.categoria = categoria;
    }
    
    // Filtro por estado
    if (estado) {
      filter.estado = estado;
    }
    
    // Filtro por responsable (ID del usuario)
    if (responsable) {
      filter.responsableId = responsable;
    }
    
    // Filtro por nombre (búsqueda parcial)
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: 'i' };
    }
    
    // Filtro por código (búsqueda parcial)
    if (codigo) {
      filter.codigo = { $regex: codigo, $options: 'i' };
    }
    
    // Búsqueda general en múltiples campos
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } }
      ];
    }

    // Obtener activos con información del responsable
    const activos = await Activo.find(filter)
      .populate('responsableId', 'nombre apellido email codigo')
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de activos para paginación
    const totalActivos = await Activo.countDocuments(filter);
    const totalPages = Math.ceil(totalActivos / limit);

    // Formatear respuesta
    const formattedActivos = activos.map(activo => ({
      id: activo._id,
      codigo: activo.codigo,
      nombre: activo.nombre,
      categoria: activo.categoria,
      descripcion: activo.descripcion,
      estado: activo.estado,
      ubicacion: activo.ubicacion,
      version: activo.version,
      fechaCreacion: activo.fechaCreacion,
      responsable: {
        id: activo.responsableId._id,
        codigo: activo.responsableId.codigo,
        nombreCompleto: `${activo.responsableId.nombre} ${activo.responsableId.apellido}`,
        email: activo.responsableId.email
      }
    }));

    const responseData = {
      activos: formattedActivos,
      pagination: {
        currentPage: page,
        totalPages,
        totalActivos,
        activosPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    sendResponse(res, 200, `${formattedActivos.length} activos obtenidos correctamente`, responseData);

  } catch (error) {
    console.error('Error obteniendo activos:', error);
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos/:id
// @desc    Get asset by ID
// @access  Private (Authenticated users)
router.get('/:id', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar activo por ID con información del responsable y historial
    const activo = await Activo.findById(id)
      .populate('responsableId', 'nombre apellido email codigo')
      .populate('historialComentarios.usuario', 'nombre apellido codigo');

    if (!activo) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Formatear respuesta
    const activoResponse = {
      id: activo._id,
      codigo: activo.codigo,
      nombre: activo.nombre,
      categoria: activo.categoria,
      descripcion: activo.descripcion,
      estado: activo.estado,
      ubicacion: activo.ubicacion,
      version: activo.version,
      fechaCreacion: activo.fechaCreacion,
      responsable: {
        id: activo.responsableId._id,
        codigo: activo.responsableId.codigo,
        nombreCompleto: `${activo.responsableId.nombre} ${activo.responsableId.apellido}`,
        email: activo.responsableId.email
      },
      historialComentarios: activo.historialComentarios.map(comentario => ({
        comentario: comentario.comentario,
        usuario: {
          id: comentario.usuario._id,
          codigo: comentario.usuario.codigo,
          nombreCompleto: `${comentario.usuario.nombre} ${comentario.usuario.apellido}`
        },
        fecha: comentario.fecha,
        tipoAccion: comentario.tipoAccion
      }))
    };

    sendResponse(res, 200, 'Activo obtenido correctamente', activoResponse);

  } catch (error) {
    console.error('Error obteniendo activo:', error);
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de activo inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   PUT /api/activos/:id
// @desc    Update asset
// @access  Private (Authenticated users)
router.put('/:id', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoria,
      descripcion,
      ubicacion,
      estado,
      responsableId,
      comentario
    } = req.body;

    // Validar que se proporcione un comentario para la modificación
    if (!comentario || comentario.trim() === '') {
      return sendError(res, 400, 'El comentario es requerido para la modificación');
    }

    // Buscar el activo existente
    const activoExistente = await Activo.findById(id);
    if (!activoExistente) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Verificar permisos: solo el responsable o un admin pueden modificar
    if (activoExistente.responsableId.toString() !== req.user._id.toString() && req.user.rol !== 'administrador') {
      return sendError(res, 403, 'No tienes permisos para modificar este activo');
    }

    // Preparar datos de actualización (solo campos que se enviaron)
    const updateData = {};
    
    if (nombre !== undefined) {
      updateData.nombre = sanitizeInput(nombre);
    }
    
    if (categoria !== undefined) {
      const validCategories = ['Datos', 'Sistemas', 'Infraestructura', 'Personas'];
      if (!validCategories.includes(categoria)) {
        return sendError(res, 400, 'Categoría inválida');
      }
      updateData.categoria = categoria;
    }
    
    if (descripcion !== undefined) {
      updateData.descripcion = sanitizeInput(descripcion);
    }
    
    if (ubicacion !== undefined) {
      updateData.ubicacion = sanitizeInput(ubicacion);
    }
    
    if (estado !== undefined) {
      const validStates = ['En evaluacion', 'Activo', 'Inactivo', 'Mantenimiento', 'En Revisión', 'Dado de Baja'];
      if (!validStates.includes(estado)) {
        return sendError(res, 400, 'Estado inválido');
      }
      updateData.estado = estado;
    }
    
    if (responsableId !== undefined) {
      // Verificar que el nuevo responsable existe
      const nuevoResponsable = await User.findById(responsableId);
      if (!nuevoResponsable) {
        return sendError(res, 400, 'El usuario responsable no existe');
      }
      
      // Actualizar las listas de activos de los usuarios
      if (responsableId !== activoExistente.responsableId.toString()) {
        // Remover el activo del usuario anterior
        await User.findByIdAndUpdate(
          activoExistente.responsableId,
          { $pull: { activosCreados: id } }
        );
        
        // Agregar el activo al nuevo usuario
        await User.findByIdAndUpdate(
          responsableId,
          { $push: { activosCreados: id } }
        );
        
        updateData.responsableId = responsableId;
      }
    }

    // Agregar el comentario al historial
    const nuevoComentario = {
      comentario: sanitizeInput(comentario),
      usuario: req.user._id,
      fecha: new Date(),
      tipoAccion: 'modificacion'
    };

    // Actualizar el activo
    const activoActualizado = await Activo.findByIdAndUpdate(
      id,
      {
        ...updateData,
        $push: { historialComentarios: nuevoComentario }
      },
      { new: true, runValidators: true }
    ).populate('responsableId', 'nombre apellido email codigo')
     .populate('historialComentarios.usuario', 'nombre apellido codigo');

    if (!activoActualizado) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Formatear respuesta
    const activoResponse = {
      id: activoActualizado._id,
      codigo: activoActualizado.codigo,
      nombre: activoActualizado.nombre,
      categoria: activoActualizado.categoria,
      descripcion: activoActualizado.descripcion,
      estado: activoActualizado.estado,
      ubicacion: activoActualizado.ubicacion,
      version: activoActualizado.version,
      fechaCreacion: activoActualizado.fechaCreacion,
      responsable: {
        id: activoActualizado.responsableId._id,
        codigo: activoActualizado.responsableId.codigo,
        nombreCompleto: `${activoActualizado.responsableId.nombre} ${activoActualizado.responsableId.apellido}`,
        email: activoActualizado.responsableId.email
      },
      historialComentarios: activoActualizado.historialComentarios.map(comentario => ({
        comentario: comentario.comentario,
        usuario: {
          id: comentario.usuario._id,
          codigo: comentario.usuario.codigo,
          nombreCompleto: `${comentario.usuario.nombre} ${comentario.usuario.apellido}`
        },
        fecha: comentario.fecha,
        tipoAccion: comentario.tipoAccion
      }))
    };

    sendResponse(res, 200, 'Activo actualizado exitosamente', activoResponse);

  } catch (error) {
    console.error('Error actualizando activo:', error);
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de activo inválido');
    }
    if (error.name === 'ValidationError') {
      return sendError(res, 400, 'Datos de validación incorrectos');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos/:id/historial
// @desc    Get asset comment history
// @access  Private (Authenticated users)
router.get('/:id/historial', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar activo y obtener solo el historial
    const activo = await Activo.findById(id)
      .select('codigo nombre historialComentarios')
      .populate('historialComentarios.usuario', 'nombre apellido codigo email');

    if (!activo) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Formatear historial
    const historialFormateado = activo.historialComentarios
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Más recientes primero
      .map(comentario => ({
        comentario: comentario.comentario,
        usuario: {
          id: comentario.usuario._id,
          codigo: comentario.usuario.codigo,
          nombreCompleto: `${comentario.usuario.nombre} ${comentario.usuario.apellido}`,
          email: comentario.usuario.email
        },
        fecha: comentario.fecha,
        tipoAccion: comentario.tipoAccion
      }));

    const responseData = {
      activo: {
        id: activo._id,
        codigo: activo.codigo,
        nombre: activo.nombre
      },
      historial: historialFormateado,
      totalComentarios: historialFormateado.length
    };

    sendResponse(res, 200, 'Historial obtenido correctamente', responseData);

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de activo inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos/stats/summary
// @desc    Get assets statistics and filter options
// @access  Private (Authenticated users)
router.get('/stats/summary', auth, asyncHandler(async (req, res) => {
  try {
    // Estadísticas por categoría
    const categoryStats = await Activo.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 }
        }
      }
    ]);

    // Estadísticas por estado
    const statusStats = await Activo.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 }
        }
      }
    ]);

    // Estadísticas por responsable
    const responsibleStats = await Activo.aggregate([
      {
        $group: {
          _id: '$responsableId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'responsable'
        }
      },
      {
        $unwind: '$responsable'
      },
      {
        $project: {
          responsableId: '$_id',
          count: 1,
          responsableNombre: { $concat: ['$responsable.nombre', ' ', '$responsable.apellido'] },
          responsableCodigo: '$responsable.codigo'
        }
      }
    ]);

    // Total de activos
    const totalActivos = await Activo.countDocuments();

    // Activos creados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivos = await Activo.countDocuments({
      fechaCreacion: { $gte: thirtyDaysAgo }
    });

    // Obtener opciones de filtro disponibles
    const availableCategories = await Activo.distinct('categoria');
    const availableStates = await Activo.distinct('estado');

    const statsResponse = {
      totalActivos,
      recentActivos,
      categoryDistribution: categoryStats.map(stat => ({
        categoria: stat._id,
        count: stat.count,
        percentage: totalActivos > 0 ? ((stat.count / totalActivos) * 100).toFixed(1) : '0'
      })),
      statusDistribution: statusStats.map(stat => ({
        estado: stat._id,
        count: stat.count,
        percentage: totalActivos > 0 ? ((stat.count / totalActivos) * 100).toFixed(1) : '0'
      })),
      responsibleDistribution: responsibleStats.map(stat => ({
        responsableId: stat.responsableId,
        responsableCodigo: stat.responsableCodigo,
        responsableNombre: stat.responsableNombre,
        count: stat.count,
        percentage: totalActivos > 0 ? ((stat.count / totalActivos) * 100).toFixed(1) : '0'
      })),
      filterOptions: {
        categorias: availableCategories,
        estados: availableStates
      }
    };

    sendResponse(res, 200, 'Estadísticas obtenidas correctamente', statsResponse);

  } catch (error) {
    console.error('Error obteniendo estadísticas de activos:', error);
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

module.exports = router;