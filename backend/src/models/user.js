const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  rol: {
    type: String,
    enum: [
      "administrador",
      "responsable_seguridad",
      "auditor",
      "usuario",
    ],
    default: "usuario",
  },
  departamento: {
    type: String,
    enum: [
      "Tecnologia_de_la_Informacion",
      "recursos_humanos",
      "seguridad",
      "auditoria",
      "finanzas",
      "operaciones",
      "legal_y_cumplimiento"
    ],
    default: "Tecnologia_de_la_Informacion",
  },
  fechaCreacion: { type: Date, default: Date.now },
  activosCreados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activo' }],
  solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCambio' }],
  contrasenaHash: { type: String, required: true },
  ubicacion: { type: String },
});


module.exports = mongoose.model("User", UserSchema);