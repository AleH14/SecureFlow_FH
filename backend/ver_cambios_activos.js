// Script para mostrar cambios detallados de activos
const mongoose = require('mongoose');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/secureflow_dev');
  } catch (error) {
    process.exit(1);
  }
};

// Esquemas
const SolicitudSchema = new mongoose.Schema({}, { strict: false });
const Solicitud = mongoose.model('SolicitudCambio', SolicitudSchema);

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

const ActivoSchema = new mongoose.Schema({}, { strict: false });
const Activo = mongoose.model('Activo', ActivoSchema);

// Función para mostrar cambios de manera visual
const mostrarCambios = (cambios) => {
  if (!cambios || cambios.length === 0) {
    return;
  }
};

// Función principal
const verCambiosActivos = async () => {
  await connectDB();
  
  try {
    // Obtener todas las solicitudes con cambios
    const solicitudes = await Solicitud.find({})
      .populate('solicitanteId', 'nombre apellido email codigo')
      .populate('responsableSeguridadId', 'nombre apellido email codigo')
      .populate('activoId', 'codigo nombre categoria estado')
      .sort({ fechaSolicitud: -1 });
    
    if (solicitudes.length === 0) {
      return;
    }
    
    // Agrupar por activo
    const cambiosPorActivo = {};
    
    solicitudes.forEach(sol => {
      const activoKey = sol.codigoActivo || sol.nombreActivo;
      if (!cambiosPorActivo[activoKey]) {
        cambiosPorActivo[activoKey] = [];
      }
      cambiosPorActivo[activoKey].push(sol);
    });
    
    // Mostrar cambios por cada activo
    Object.entries(cambiosPorActivo).forEach(([activo, solicitudesActivo]) => {
      
      solicitudesActivo.forEach((sol, index) => {
        // Mostrar cambios detallados
        mostrarCambios(sol.cambios);
      });
    });
    
    // Mostrar resumen de tipos de cambios
    const cambiosPorCampo = {};
    
    solicitudes.forEach(sol => {
      if (sol.cambios) {
        sol.cambios.forEach(cambio => {
          if (!cambiosPorCampo[cambio.campo]) {
            cambiosPorCampo[cambio.campo] = 0;
          }
          cambiosPorCampo[cambio.campo]++;
        });
      }
    });
    
  } catch (error) {
    // Error consultando cambios
  } finally {
    await mongoose.connection.close();
  }
};

// Ejecutar
verCambiosActivos();