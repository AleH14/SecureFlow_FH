// Script simple para consultar directamente MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/secureflow_dev');
  } catch (error) {
    process.exit(1);
  }
};

// Esquema simple para consultas
const SolicitudSchema = new mongoose.Schema({}, { strict: false });
const Solicitud = mongoose.model('SolicitudCambio', SolicitudSchema);

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

const ActivoSchema = new mongoose.Schema({}, { strict: false });
const Activo = mongoose.model('Activo', ActivoSchema);

// Función principal
const consultarSolicitudes = async () => {
  await connectDB();
  
  try {
    // Obtener todas las solicitudes
    const solicitudes = await Solicitud.find({})
      .populate('solicitanteId', 'nombre apellido email')
      .populate('responsableSeguridadId', 'nombre apellido email')
      .sort({ fechaSolicitud: -1 });
    
    if (solicitudes.length === 0) {
      return;
    }
    
    // Estadísticas
    const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'Aprobado').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'Rechazado').length;
    
  } catch (error) {
    // Error consultando solicitudes
  } finally {
    await mongoose.connection.close();
  }
};

// Ejecutar
consultarSolicitudes();