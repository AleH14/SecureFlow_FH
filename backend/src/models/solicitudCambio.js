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
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  estadoGeneral: {
    type: String,
    enum: ["Pendiente", "En Revisión", "Aprobado", "Rechazado", "Implementado"],
    default: "Pendiente"
  },
  // Relaciones
  activoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Activo', 
    required: true 
  },
  solicitanteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Cambios realizados
  justificacion: { 
    type: String, 
    required: true 
  },
  cambios: [CambioSchema],
  // Flujo de aprobación
  aprobaciones: {
    seguridad: AprobacionSchema,
    auditoria: AprobacionSchema
  }
});

module.exports = mongoose.model("SolicitudCambio", SolicitudCambioSchema);