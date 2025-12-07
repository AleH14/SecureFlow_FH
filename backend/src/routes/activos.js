const express = require('express');
const Activo = require('../models/activo');
const User = require('../models/user');
const SolicitudCambio = require('../models/solicitudCambio');
const { auth, admin } = require('../middleware/auth');
const { 
  asyncHandler, 
  sendResponse, 
  sendError, 
  sanitizeInput 
} = require('../utils/helpers');

const router = express.Router();

// Función para generar código único de activo
const generateActivoCode = (nombreActivo) => {
  // Tomar las primeras 3 letras del nombre del activo, limpiar espacios y convertir a mayúsculas
  const nombreLimpio = nombreActivo.replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');
  const prefijo = nombreLimpio.substring(0, 3).toUpperCase().padEnd(3, 'X');
  
  // Generar correlativo de 3 dígitos
  const correlativo = Math.floor(Math.random() * 999) + 1;
  const correlativoStr = correlativo.toString().padStart(3, '0');
  
  return `ACT-${prefijo}-${correlativoStr}`;
};

// Función para generar código único de solicitud
const generateSolicitudCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SOL-${year}-${randomNum}`;
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
      codigo = generateActivoCode(sanitizedData.nombre);
      const activoWithCode = await Activo.findOne({ codigo });
      if (!activoWithCode) {
        codigoExists = false;
      }
    }

    // Crear nuevo activo (pendiente de aprobación)
    const newActivo = new Activo({
      codigo,
      nombre: sanitizedData.nombre,
      categoria: sanitizedData.categoria,
      descripcion: sanitizedData.descripcion,
      ubicacion: sanitizedData.ubicacion,
      responsableId: req.user._id, // Usuario logueado como responsable
      estado: 'En Revision', // Estado por defecto
      version: 'v1.0.0', // Versión por defecto
      fechaCreacion: new Date(),
      historialComentarios: [{
        comentario: 'Creacion de activo - Pendiente de aprobación',
        usuario: req.user._id,
        fecha: new Date(),
        tipoAccion: 'creacion'
      }]
    });

    const savedActivo = await newActivo.save();

    // Generar código único para la solicitud
    let codigoSolicitud;
    let solicitudCodeExists = true;
    
    while (solicitudCodeExists) {
      codigoSolicitud = generateSolicitudCode();
      const solicitudWithCode = await SolicitudCambio.findOne({ codigoSolicitud });
      if (!solicitudWithCode) {
        solicitudCodeExists = false;
      }
    }

    // Crear solicitud de cambio para la creación del activo
    const nuevaSolicitud = new SolicitudCambio({
      codigoSolicitud,
      nombreActivo: sanitizedData.nombre,
      codigoActivo: codigo,
      fechaSolicitud: new Date(),
      solicitanteId: req.user._id,
      estado: 'Pendiente',
      tipoOperacion: 'creacion',
      activoId: savedActivo._id,
      justificacion: 'Creacion de activo',
      cambios: [
        { campo: 'nombre', valorAnterior: null, valorNuevo: sanitizedData.nombre },
        { campo: 'categoria', valorAnterior: null, valorNuevo: sanitizedData.categoria },
        { campo: 'descripcion', valorAnterior: null, valorNuevo: sanitizedData.descripcion },
        { campo: 'ubicacion', valorAnterior: null, valorNuevo: sanitizedData.ubicacion },
        { campo: 'responsableId', valorAnterior: null, valorNuevo: req.user._id.toString() },
        { campo: 'estado', valorAnterior: null, valorNuevo: 'En Revision' }
      ]
    });

    const savedSolicitud = await nuevaSolicitud.save();

    // Actualizar el usuario para agregar este activo a su lista de activos creados
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { activosCreados: savedActivo._id } }
    );

    // Poblar información para la respuesta
    const populatedActivo = await Activo.findById(savedActivo._id)
      .populate('responsableId', 'nombre apellido email codigo');

    // Respuesta formateada
    const activoResponse = {
      activo: {
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
      },
      solicitud: {
        id: savedSolicitud._id,
        codigoSolicitud: savedSolicitud.codigoSolicitud,
        estado: savedSolicitud.estado,
        tipoOperacion: savedSolicitud.tipoOperacion,
        fechaSolicitud: savedSolicitud.fechaSolicitud
      }
    };

    sendResponse(res, 201, 'Activo creado y solicitud de aprobación generada', activoResponse);

  } catch (error) {
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

    // Aplicar filtros según el rol del usuario
    const userRole = req.user.rol;
    if (userRole === 'usuario') {
      // Los usuarios solo pueden ver sus propios activos (donde son responsables)
      filter.responsableId = req.user._id;
    }
    // Los roles admin, auditor y responsable_seguridad pueden ver todos los activos
    
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

    // Verificar permisos según el rol del usuario
    const userRole = req.user.rol;
    if (userRole === 'usuario') {
      // Los usuarios solo pueden ver sus propios activos
      if (activo.responsableId._id.toString() !== req.user._id.toString()) {
        return sendError(res, 403, 'No tienes permisos para ver este activo');
      }
    }
    // Los roles admin, auditor y responsable_seguridad pueden ver todos los activos

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
      const validStates = ['Activo', 'Inactivo', 'En Mantenimiento', 'En Revision'];
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

    // Crear array de cambios para la solicitud
    const cambiosRealizados = [];
    
    if (nombre !== undefined && nombre !== activoExistente.nombre) {
      cambiosRealizados.push({
        campo: 'nombre',
        valorAnterior: activoExistente.nombre,
        valorNuevo: updateData.nombre
      });
    }
    
    if (categoria !== undefined && categoria !== activoExistente.categoria) {
      cambiosRealizados.push({
        campo: 'categoria',
        valorAnterior: activoExistente.categoria,
        valorNuevo: updateData.categoria
      });
    }
    
    if (descripcion !== undefined && descripcion !== activoExistente.descripcion) {
      cambiosRealizados.push({
        campo: 'descripcion',
        valorAnterior: activoExistente.descripcion || '',
        valorNuevo: updateData.descripcion
      });
    }
    
    if (ubicacion !== undefined && ubicacion !== activoExistente.ubicacion) {
      cambiosRealizados.push({
        campo: 'ubicacion',
        valorAnterior: activoExistente.ubicacion || '',
        valorNuevo: updateData.ubicacion
      });
    }
    
    if (estado !== undefined && estado !== activoExistente.estado) {
      cambiosRealizados.push({
        campo: 'estado',
        valorAnterior: activoExistente.estado,
        valorNuevo: updateData.estado
      });
    }
    
    if (responsableId !== undefined && responsableId !== activoExistente.responsableId.toString()) {
      const nuevoResponsable = await User.findById(responsableId);
      cambiosRealizados.push({
        campo: 'responsableId',
        valorAnterior: activoExistente.responsableId.toString(),
        valorNuevo: responsableId
      });
    }

    // Si no hay cambios reales, devolver respuesta exitosa sin hacer nada
    if (cambiosRealizados.length === 0) {
      const activoActualizado = await Activo.findById(id)
        .populate('responsableId', 'nombre apellido email codigo');

      return sendResponse(res, 200, 'No se detectaron cambios en el activo', {
        activo: {
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
          }
        },
        solicitud: null,
        sinCambios: true
      });
    }

    // Generar código único para la solicitud
    let codigoSolicitud;
    let solicitudCodeExists = true;
    
    while (solicitudCodeExists) {
      codigoSolicitud = generateSolicitudCode();
      const solicitudWithCode = await SolicitudCambio.findOne({ codigoSolicitud });
      if (!solicitudWithCode) {
        solicitudCodeExists = false;
      }
    }

    // Crear solicitud de cambio
    const nuevaSolicitud = new SolicitudCambio({
      codigoSolicitud,
      nombreActivo: activoExistente.nombre,
      codigoActivo: activoExistente.codigo,
      fechaSolicitud: new Date(),
      solicitanteId: req.user._id,
      estado: 'Pendiente',
      tipoOperacion: 'modificacion',
      activoId: id,
      justificacion: sanitizeInput(comentario),
      cambios: cambiosRealizados
    });

    const savedSolicitud = await nuevaSolicitud.save();

    // Agregar comentario al historial del activo
    await Activo.findByIdAndUpdate(
      id,
      { $push: { historialComentarios: nuevoComentario } }
    );

    // Obtener activo actualizado para la respuesta
    const activoActualizado = await Activo.findById(id)
      .populate('responsableId', 'nombre apellido email codigo');

    // Formatear respuesta
    const activoResponse = {
      activo: {
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
        }
      },
      solicitud: {
        id: savedSolicitud._id,
        codigoSolicitud: savedSolicitud.codigoSolicitud,
        estado: savedSolicitud.estado,
        tipoOperacion: savedSolicitud.tipoOperacion,
        fechaSolicitud: savedSolicitud.fechaSolicitud,
        cambios: cambiosRealizados
      }
    };

    sendResponse(res, 200, 'Solicitud de modificación creada exitosamente', activoResponse);

  } catch (error) {
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
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos/:id/solicitudes-historial
// @desc    Get change history for a specific asset
// @access  Private (Authenticated users)
router.get('/:id/solicitudes-historial', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el activo existe
    const activo = await Activo.findById(id).populate('responsableId', 'nombre apellido');
    if (!activo) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Verificar permisos según el rol del usuario
    const userRole = req.user.rol;
    if (userRole === 'usuario') {
      // Los usuarios solo pueden ver el historial de sus propios activos
      if (activo.responsableId._id.toString() !== req.user._id.toString()) {
        return sendError(res, 403, 'No tienes permisos para ver el historial de este activo');
      }
    }
    // Los roles admin, auditor y responsable_seguridad pueden ver todos los historiales

    // Obtener todas las solicitudes de cambio relacionadas con este activo
    const solicitudes = await SolicitudCambio.find({ activoId: id })
      .populate('solicitanteId', 'nombre apellido email codigo')
      .populate('responsableSeguridadId', 'nombre apellido email codigo')
      .populate('auditorId', 'nombre apellido email codigo')
      .sort({ fechaSolicitud: -1 });

    // Obtener todos los IDs de responsables únicos para poblarlos de una vez
    const responsableIds = new Set();
    solicitudes.forEach(solicitud => {
      const cambioResponsable = solicitud.cambios.find(c => c.campo === 'responsableId');
      if (cambioResponsable && cambioResponsable.valorNuevo) {
        responsableIds.add(cambioResponsable.valorNuevo);
      }
    });

    // Poblar información de todos los responsables de una vez
    const responsablesMap = new Map();
    if (responsableIds.size > 0) {
      const responsables = await User.find({ 
        _id: { $in: Array.from(responsableIds) } 
      }).select('nombre apellido email codigo');
      
      responsables.forEach(resp => {
        responsablesMap.set(resp._id.toString(), {
          id: resp._id,
          codigo: resp.codigo,
          nombreCompleto: `${resp.nombre} ${resp.apellido}`,
          email: resp.email
        });
      });
    }

    // Formatear el historial
    const historial = solicitudes.map(solicitud => {
      // Determinar el responsable según el tipo de operación
      let responsableInfo;
      
      if (solicitud.tipoOperacion === 'creacion') {
        // Para creación, el responsable es el solicitante (quien creó el activo)
        responsableInfo = {
          id: solicitud.solicitanteId._id,
          codigo: solicitud.solicitanteId.codigo,
          nombreCompleto: `${solicitud.solicitanteId.nombre} ${solicitud.solicitanteId.apellido}`,
          email: solicitud.solicitanteId.email
        };
      } else {
        // Para modificaciones, verificar si hay cambio de responsable en esta solicitud
        const cambioResponsable = solicitud.cambios.find(c => c.campo === 'responsableId');
        if (cambioResponsable && cambioResponsable.valorNuevo) {
          // Buscar el responsable en el mapa poblado
          responsableInfo = responsablesMap.get(cambioResponsable.valorNuevo) || {
            id: cambioResponsable.valorNuevo,
            codigo: 'N/A',
            nombreCompleto: 'Usuario no encontrado',
            email: 'N/A'
          };
        } else {
          // Si no hay cambio de responsable, usar el responsable actual del activo
          responsableInfo = {
            id: activo.responsableId._id,
            codigo: activo.responsableId.codigo,
            nombreCompleto: `${activo.responsableId.nombre} ${activo.responsableId.apellido}`,
            email: activo.responsableId.email
          };
        }
      }
      
      return {
        id: solicitud._id,
        fecha: solicitud.fechaSolicitud,
        solicitudCambio: {
          codigoSolicitud: solicitud.codigoSolicitud,
          tipoOperacion: solicitud.tipoOperacion,
          nombreActivo: solicitud.nombreActivo,
          categoriaActivo: activo.categoria,
          estadoActivo: activo.estado,
          descripcionActivo: activo.descripcion,
          responsable: responsableInfo,
          cambios: solicitud.cambios.map(cambio => ({
            campo: cambio.campo,
            valorAnterior: cambio.valorAnterior,
            valorNuevo: cambio.valorNuevo
          }))
        },
        comentarioSolicitante: solicitud.justificacion,
        revision: solicitud.responsableSeguridadId ? {
          responsableSeguridad: {
            id: solicitud.responsableSeguridadId._id,
            codigo: solicitud.responsableSeguridadId.codigo,
            nombreCompleto: `${solicitud.responsableSeguridadId.nombre} ${solicitud.responsableSeguridadId.apellido}`,
            email: solicitud.responsableSeguridadId.email
          },
          fechaRevision: solicitud.fechaRevision,
          comentario: solicitud.comentarioSeguridad
        } : null,
        auditoria: solicitud.auditorId ? {
          auditor: {
            id: solicitud.auditorId._id,
            codigo: solicitud.auditorId.codigo,
            nombreCompleto: `${solicitud.auditorId.nombre} ${solicitud.auditorId.apellido}`,
            email: solicitud.auditorId.email
          },
          fecha: solicitud.fechaAuditoria,
          comentario: solicitud.comentarioAuditoria
        } : null,
        estado: solicitud.estado,
        solicitante: {
          id: solicitud.solicitanteId._id,
          codigo: solicitud.solicitanteId.codigo,
          nombreCompleto: `${solicitud.solicitanteId.nombre} ${solicitud.solicitanteId.apellido}`,
          email: solicitud.solicitanteId.email
        }
      };
    });

    // Ya no necesitamos actualizar el responsable globalmente porque 
    // cada entrada ya tiene su responsable correcto según el momento de la solicitud

    const responseData = {
      activo: {
        id: activo._id,
        codigo: activo.codigo,
        nombre: activo.nombre,
        categoria: activo.categoria,
        estado: activo.estado,
        descripcion: activo.descripcion,
        fechaCreacion: activo.fechaCreacion
      },
      totalCambios: historial.length,
      historial
    };

    sendResponse(res, 200, `Historial de cambios obtenido correctamente`, responseData);

  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de activo inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/activos/responsables/disponibles
// @desc    Get available users for asset responsibility (users with role "usuario")
// @access  Private (All authenticated users)
router.get('/responsables/disponibles', auth, asyncHandler(async (req, res) => {
  try {
    // Filtrar SOLO por rol "usuario" y estado "activo"
    const filter = {
      rol: 'usuario',
      estado: 'activo'  
    };

    // Obtener usuarios con filtros
    const users = await User.find(filter)
      .select('_id nombre apellido email') //id, nombre, apellido, email
      .sort({ nombre: 1, apellido: 1 })
      .limit(100);

    // Formatear respuesta - AHORA CON ID
    const formattedUsers = users.map(user => ({
      id: user._id, //Incluir el ID
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      email: user.email,
    }));
    
    // Enviar solo el array de usuarios
    sendResponse(res, 200, `${formattedUsers.length} responsables disponibles obtenidos`, formattedUsers);

  } catch (error) {
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

module.exports = router;