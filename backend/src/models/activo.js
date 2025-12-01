const mongoose = require("mongoose");

const ActivoSchema = new mongoose.Schema({
  codigo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  categoria: { 
    type: String, 
    required: true,
    enum: [
      "Datos",
      "Sistemas",
      "Infraestructura",
      "Personas"
    ]
  },
  descripcion: { 
    type: String 
  },
  estado: {
    type: String,
    enum: [
      "En evaluacion",
      "Activo",
      "Inactivo",
      "Mantenimiento",
      "En Revisión",
      "Dado de Baja"
    ],
    default: "En evaluacion"
  },
  ubicacion: { 
    type: String 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  responsableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  version: { 
    type: String, 
    default: "v1.0.0" 
  },
  idsSolicitudesDeCambio: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SolicitudCambio' 
  }],
  historialComentarios: [{
    comentario: { 
      type: String, 
      required: true 
    },
    usuario: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    fecha: { 
      type: Date, 
      default: Date.now 
    },
    tipoAccion: {
      type: String,
      enum: ['creacion', 'modificacion'],
      required: true
    }
  }]
});

module.exports = mongoose.model("Activo", ActivoSchema);