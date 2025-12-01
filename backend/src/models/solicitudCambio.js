const mongoose = require("mongoose");

const CambioSchema = new mongoose.Schema({
  campo: { 
    type: String, 
    required: true 
  },
  valorAnterior: { 
    type: String 
  },
  valorNuevo: { 
    type: String, 
    required: true 
  }
});

const AprobacionSchema = new mongoose.Schema({
  responsableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  fecha: { 
    type: Date 
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente"
  },
  comentario: { 
    type: String 
  }
});

const SolicitudCambioSchema = new mongoose.Schema({
  codigoSolicitud: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Información del activo
  nombreActivo: {
    type: String,
    required: true
  },
  codigoActivo: {
    type: String,
    required: true
  },
  // Fechas
  fechaSolicitud: { 
    type: Date, 
    default: Date.now 
  },
  fechaRevision: {
    type: Date
  },
  // Usuarios involucrados
  solicitanteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  responsableSeguridadId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  // Auditoría
  auditorId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  fechaAuditoria: {
    type: Date
  },
  comentarioAuditoria: {
    type: String
  },
  // Estado y comentarios
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente"
  },
  comentarioSeguridad: {
    type: String
  },
  // Tipo de operación
  tipoOperacion: {
    type: String,
    enum: ["creacion", "modificacion"],
    required: true
  },
  // Relación con activo
  activoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Activo', 
    required: true 
  },
  // Justificación del cambio
  justificacion: { 
    type: String, 
    required: true 
  },
  // Cambios específicos
  cambios: [CambioSchema]
});

module.exports = mongoose.model("SolicitudCambio", SolicitudCambioSchema);