const express = require('express');
const SolicitudCambio = require('../models/solicitudCambio');
const Activo = require('../models/activo');
const User = require('../models/user');
const { auth, responsableSeguridad, auditor } = require('../middleware/auth');
const { 
  asyncHandler, 
  sendResponse, 
  sendError, 
  sanitizeInput 
} = require('../utils/helpers');

const router = express.Router();

// Función para generar código único de solicitud
const generateSolicitudCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SOL-${year}-${randomNum}`;
};

// @route   GET /api/solicitudes
// @desc    Get all change requests with pagination and filtering
// @access  Private (Authenticated users)
router.get('/', auth, asyncHandler(async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Parámetros de filtrado
    const { estado, tipoOperacion, solicitante, responsableSeguridad, search } = req.query;

    // Construir filtro de búsqueda
    let filter = {};
    
    if (estado) {
      filter.estado = estado;
    }
    
    if (tipoOperacion) {
      filter.tipoOperacion = tipoOperacion;
    }
    
    if (solicitante) {
      filter.solicitanteId = solicitante;
    }
    
    if (responsableSeguridad) {
      filter.responsableSeguridadId = responsableSeguridad;
    }
    
    if (search) {
      filter.$or = [
        { nombreActivo: { $regex: search, $options: 'i' } },
        { codigoActivo: { $regex: search, $options: 'i' } },
        { codigoSolicitud: { $regex: search, $options: 'i' } }
      ];
    }

    // Si no es responsable de seguridad o admin, solo ver sus propias solicitudes
    if (req.user.rol !== 'responsable_seguridad' && req.user.rol !== 'administrador') {
      filter.solicitanteId = req.user._id;
    }

    // Obtener solicitudes con información poblada
    const solicitudes = await SolicitudCambio.find(filter)
      .populate('solicitanteId', 'nombre apellido email codigo')
      .populate('responsableSeguridadId', 'nombre apellido email codigo')
      .populate('activoId', 'codigo nombre categoria')
      .sort({ fechaSolicitud: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de solicitudes para paginación
    const totalSolicitudes = await SolicitudCambio.countDocuments(filter);
    const totalPages = Math.ceil(totalSolicitudes / limit);

    // Formatear respuesta
    const formattedSolicitudes = solicitudes.map(solicitud => ({
      id: solicitud._id,
      codigoSolicitud: solicitud.codigoSolicitud,
      nombreActivo: solicitud.nombreActivo,
      codigoActivo: solicitud.codigoActivo,
      fechaSolicitud: solicitud.fechaSolicitud,
      fechaRevision: solicitud.fechaRevision,
      estado: solicitud.estado,
      tipoOperacion: solicitud.tipoOperacion,
      solicitante: {
        id: solicitud.solicitanteId._id,
        codigo: solicitud.solicitanteId.codigo,
        nombreCompleto: `${solicitud.solicitanteId.nombre} ${solicitud.solicitanteId.apellido}`,
        email: solicitud.solicitanteId.email
      },
      responsableSeguridad: solicitud.responsableSeguridadId ? {
        id: solicitud.responsableSeguridadId._id,
        codigo: solicitud.responsableSeguridadId.codigo,
        nombreCompleto: `${solicitud.responsableSeguridadId.nombre} ${solicitud.responsableSeguridadId.apellido}`,
        email: solicitud.responsableSeguridadId.email
      } : null,
      comentarioSeguridad: solicitud.comentarioSeguridad,
      justificacion: solicitud.justificacion
    }));

    const responseData = {
      solicitudes: formattedSolicitudes,
      pagination: {
        currentPage: page,
        totalPages,
        totalSolicitudes,
        solicitudesPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    sendResponse(res, 200, `${formattedSolicitudes.length} solicitudes obtenidas correctamente`, responseData);

  } catch (error) {
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   GET /api/solicitudes/:id
// @desc    Get change request by ID with full details
// @access  Private (Authenticated users)
router.get('/:id', auth, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la solicitud con población básica
    const solicitud = await SolicitudCambio.findById(id)
      .populate('solicitanteId', 'nombre apellido email codigo')
      .populate('responsableSeguridadId', 'nombre apellido email codigo')
      .populate({
        path: 'activoId',
        select: 'codigo nombre categoria estado ubicacion descripcion responsableId',
        populate: {
          path: 'responsableId',
          select: 'nombre apellido email codigo'
        }
      })
      .lean(); // Convertir a objeto plano para modificar

    if (!solicitud) {
      return sendError(res, 404, 'Solicitud no encontrada');
    }

    // Verificar permisos: solo el solicitante, responsable de seguridad o admin pueden ver
    if (solicitud.solicitanteId._id.toString() !== req.user._id.toString() && 
        req.user.rol !== 'responsable_seguridad' && 
        req.user.rol !== 'administrador') {
      return sendError(res, 403, 'No tienes permisos para ver esta solicitud');
    }

    // Poblar información de responsables en cambios
    if (solicitud.cambios && solicitud.cambios.length > 0) {
      for (const cambio of solicitud.cambios) {
        if (cambio.campo === 'responsableId') {
          // Poblar responsable anterior
          if (cambio.valorAnterior) {
            const responsableAnterior = await User.findById(cambio.valorAnterior)
              .select('nombre apellido email codigo');
            if (responsableAnterior) {
              cambio.responsableAnteriorInfo = {
                id: responsableAnterior._id,
                codigo: responsableAnterior.codigo,
                nombreCompleto: `${responsableAnterior.nombre} ${responsableAnterior.apellido}`,
                email: responsableAnterior.email
              };
            }
          }
          
          // Poblar nuevo responsable
          if (cambio.valorNuevo) {
            const nuevoResponsable = await User.findById(cambio.valorNuevo)
              .select('nombre apellido email codigo');
            if (nuevoResponsable) {
              cambio.responsableNuevoInfo = {
                id: nuevoResponsable._id,
                codigo: nuevoResponsable.codigo,
                nombreCompleto: `${nuevoResponsable.nombre} ${nuevoResponsable.apellido}`,
                email: nuevoResponsable.email
              };
            }
          }
        }
      }
    }

    // Formatear respuesta completa
    const solicitudResponse = {
      id: solicitud._id,
      codigoSolicitud: solicitud.codigoSolicitud,
      nombreActivo: solicitud.nombreActivo,
      codigoActivo: solicitud.codigoActivo,
      fechaSolicitud: solicitud.fechaSolicitud,
      fechaRevision: solicitud.fechaRevision,
      estado: solicitud.estado,
      tipoOperacion: solicitud.tipoOperacion,
      solicitante: {
        id: solicitud.solicitanteId._id,
        codigo: solicitud.solicitanteId.codigo,
        nombreCompleto: `${solicitud.solicitanteId.nombre} ${solicitud.solicitanteId.apellido}`,
        email: solicitud.solicitanteId.email
      },
      responsableSeguridad: solicitud.responsableSeguridadId ? {
        id: solicitud.responsableSeguridadId._id,
        codigo: solicitud.responsableSeguridadId.codigo,
        nombreCompleto: `${solicitud.responsableSeguridadId.nombre} ${solicitud.responsableSeguridadId.apellido}`,
        email: solicitud.responsableSeguridadId.email
      } : null,
      comentarioSeguridad: solicitud.comentarioSeguridad,
      justificacion: solicitud.justificacion,
      activo: {
        id: solicitud.activoId._id,
        codigo: solicitud.activoId.codigo,
        nombre: solicitud.activoId.nombre,
        categoria: solicitud.activoId.categoria,
        estado: solicitud.activoId.estado,
        ubicacion: solicitud.activoId.ubicacion,
        descripcion: solicitud.activoId.descripcion,
        responsableId: solicitud.activoId.responsableId ? {
          id: solicitud.activoId.responsableId._id,
          codigo: solicitud.activoId.responsableId.codigo,
          nombreCompleto: `${solicitud.activoId.responsableId.nombre} ${solicitud.activoId.responsableId.apellido}`,
          email: solicitud.activoId.responsableId.email
        } : null
      },
      cambios: solicitud.cambios
    };

    sendResponse(res, 200, 'Solicitud obtenida correctamente', solicitudResponse);

  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID de solicitud inválido');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   PUT /api/solicitudes/:id/revisar
// @desc    Review change request (approve/reject)
// @access  Private (Security responsible only)
router.put('/:id/revisar', auth, responsableSeguridad, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentario } = req.body;

    // Validaciones
    if (!estado || !['Aprobado', 'Rechazado'].includes(estado)) {
      return sendError(res, 400, 'Estado debe ser Aprobado o Rechazado');
    }

    if (!comentario || comentario.trim() === '') {
      return sendError(res, 400, 'El comentario de revisión es requerido');
    }

    // Buscar la solicitud
    const solicitud = await SolicitudCambio.findById(id);
    if (!solicitud) {
      return sendError(res, 404, 'Solicitud no encontrada');
    }

    if (solicitud.estado !== 'Pendiente') {
      return sendError(res, 400, 'Solo se pueden revisar solicitudes pendientes');
    }

    // Actualizar la solicitud
    const solicitudActualizada = await SolicitudCambio.findByIdAndUpdate(
      id,
      {
        estado: estado,
        comentarioSeguridad: sanitizeInput(comentario),
        responsableSeguridadId: req.user._id,
        fechaRevision: new Date()
      },
      { new: true }
    ).populate('solicitanteId', 'nombre apellido email codigo')
     .populate('activoId', 'codigo nombre');

    // Si es aprobado, aplicar los cambios al activo
    if (estado === 'Aprobado') {
      const updateData = {};
      
      solicitud.cambios.forEach(cambio => {
        switch (cambio.campo) {
          case 'nombre':
            updateData.nombre = cambio.valorNuevo;
            break;
          case 'categoria':
            updateData.categoria = cambio.valorNuevo;
            break;
          case 'estado':
            updateData.estado = cambio.valorNuevo;
            break;
          case 'ubicacion':
            updateData.ubicacion = cambio.valorNuevo;
            break;
          case 'descripcion':
            updateData.descripcion = cambio.valorNuevo;
            break;
          case 'responsableId':
            updateData.responsableId = cambio.valorNuevo;
            break;
        }
      });

      // Si es una solicitud de creación, cambiar el estado a "Activo"
      if (solicitud.tipoOperacion === 'creacion') {
        updateData.estado = 'Activo';
      }

      // Aplicar cambios al activo
      await Activo.findByIdAndUpdate(solicitud.activoId, updateData);
    }

    sendResponse(res, 200, `Solicitud ${estado.toLowerCase()} exitosamente`, {
      id: solicitudActualizada._id,
      codigoSolicitud: solicitudActualizada.codigoSolicitud,
      estado: solicitudActualizada.estado,
      comentarioSeguridad: solicitudActualizada.comentarioSeguridad,
      fechaRevision: solicitudActualizada.fechaRevision
    });

  } catch (error) {
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   PUT /api/solicitudes/:id/auditoria
// @desc    Add audit comment to change request
// @access  Private (Auditor only)
router.put('/:id/auditoria', auth, auditor, asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;
    
    // Validaciones
    if (!comentario || comentario.trim() === '') {
      return sendError(res, 400, 'El comentario de auditoría es requerido');
    }

    // Buscar la solicitud
    const solicitud = await SolicitudCambio.findById(id);
    if (!solicitud) {
      return sendError(res, 404, 'Solicitud no encontrada');
    }

    // Actualizar con información de auditoría
    const solicitudActualizada = await SolicitudCambio.findByIdAndUpdate(
      id,
      {
        auditorId: req.user._id,
        fechaAuditoria: new Date(),
        comentarioAuditoria: sanitizeInput(comentario)
      },
      { new: true }
    ).populate('solicitanteId', 'nombre apellido email codigo')
     .populate('responsableSeguridadId', 'nombre apellido email codigo')
     .populate('auditorId', 'nombre apellido email codigo');

    sendResponse(res, 200, 'Comentario de auditoría agregado exitosamente', {
      id: solicitudActualizada._id,
      codigoSolicitud: solicitudActualizada.codigoSolicitud,
      auditoria: {
        auditor: {
          id: solicitudActualizada.auditorId._id,
          codigo: solicitudActualizada.auditorId.codigo,
          nombreCompleto: `${solicitudActualizada.auditorId.nombre} ${solicitudActualizada.auditorId.apellido}`,
          email: solicitudActualizada.auditorId.email
        },
        fecha: solicitudActualizada.fechaAuditoria,
        comentario: solicitudActualizada.comentarioAuditoria
      }
    });

  } catch (error) {
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   POST /api/solicitudes/reasignar
// @desc    Create reassignment request for user deactivation (admin only)
// @access  Private (Admin only)
router.post('/reasignar', auth, asyncHandler(async (req, res) => {
  try {
    // Verificar que el usuario es administrador
    if (req.user.rol !== 'administrador') {
      return sendError(res, 403, 'No tienes permisos para realizar esta acción');
    }

    const { activoId, nuevoResponsableId, justificacion, solicitadoPorAdmin } = req.body;

    // Validaciones
    if (!activoId || !nuevoResponsableId || !justificacion) {
      return sendError(res, 400, 'Todos los campos son requeridos: activoId, nuevoResponsableId, justificacion');
    }

    // Verificar que la justificación sea válida
    if (justificacion.trim().length < 10) {
      return sendError(res, 400, 'La justificación debe tener al menos 10 caracteres');
    }

    // Buscar el activo
    const activo = await Activo.findById(activoId)
      .populate('responsableId', 'nombre apellido email codigo');
    
    if (!activo) {
      return sendError(res, 404, 'Activo no encontrado');
    }

    // Verificar que el nuevo responsable existe y es usuario (no admin)
    const nuevoResponsable = await User.findOne({
      _id: nuevoResponsableId,
      rol: 'usuario',
      estado: 'activo'
    });

    if (!nuevoResponsable) {
      return sendError(res, 404, 'Nuevo responsable no encontrado o no es un usuario válido');
    }

    // Verificar que no sea el mismo responsable
    if (activo.responsableId._id.toString() === nuevoResponsableId) {
      return sendError(res, 400, 'El activo ya está asignado a este usuario');
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

    // Crear array de cambios
    const cambiosRealizados = [{
      campo: 'responsableId',
      valorAnterior: activo.responsableId._id.toString(),
      valorNuevo: nuevoResponsableId,
      descripcion: `Reasignación de ${activo.responsableId.nombre} ${activo.responsableId.apellido} a ${nuevoResponsable.nombre} ${nuevoResponsable.apellido}`
    }];

    // Crear solicitud de cambio para reasignación
    const nuevaSolicitud = new SolicitudCambio({
      codigoSolicitud,
      nombreActivo: activo.nombre,
      codigoActivo: activo.codigo,
      fechaSolicitud: new Date(),
      solicitanteId: req.user._id, // Admin que solicita
      estado: 'Pendiente',
      tipoOperacion: 'reasignacion',
      activoId: activo._id,
      justificacion: sanitizeInput(justificacion),
      cambios: cambiosRealizados,
      solicitadoPorAdmin: solicitadoPorAdmin || false,
      adminComentario: solicitadoPorAdmin ? `Reasignación solicitada por administrador: ${req.user.nombre} ${req.user.apellido}` : null
    });

    const savedSolicitud = await nuevaSolicitud.save();

    // Agregar comentario al historial del activo
    const comentarioReasignacion = {
      comentario: `Solicitud de reasignación generada por administrador. Nuevo responsable propuesto: ${nuevoResponsable.nombre} ${nuevoResponsable.apellido}. Justificación: ${justificacion}`,
      usuario: req.user._id,
      fecha: new Date(),
      tipoAccion: 'reasignacion_solicitada'
    };

    await Activo.findByIdAndUpdate(
      activoId,
      { $push: { historialComentarios: comentarioReasignacion } }
    );

    // Formatear respuesta
    const respuesta = {
      success: true,
      solicitud: {
        id: savedSolicitud._id,
        codigoSolicitud: savedSolicitud.codigoSolicitud,
        estado: savedSolicitud.estado,
        tipoOperacion: savedSolicitud.tipoOperacion,
        fechaSolicitud: savedSolicitud.fechaSolicitud
      },
      activo: {
        id: activo._id,
        codigo: activo.codigo,
        nombre: activo.nombre
      }
    };

    sendResponse(res, 201, 'Solicitud de reasignación creada exitosamente', respuesta);

  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'ID inválido');
    }
    if (error.name === 'ValidationError') {
      return sendError(res, 400, 'Datos de validación incorrectos');
    }
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

module.exports = router;