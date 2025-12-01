// Script simple para consultar directamente MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/secureflow_dev');
    console.log('📊 MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
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
  
  console.log('\n🔍 CONSULTANDO SOLICITUDES EN LA BASE DE DATOS\n');
  
  try {
    // Obtener todas las solicitudes
    const solicitudes = await Solicitud.find({})
      .populate('solicitanteId', 'nombre apellido email')
      .populate('responsableSeguridadId', 'nombre apellido email')
      .sort({ fechaSolicitud: -1 });
    
    console.log(`📋 TOTAL DE SOLICITUDES: ${solicitudes.length}\n`);
    
    if (solicitudes.length === 0) {
      console.log('❌ No se encontraron solicitudes');
      return;
    }
    
    // Mostrar cada solicitud
    solicitudes.forEach((sol, index) => {
      console.log(`${index + 1}. SOLICITUD: ${sol.codigoSolicitud || sol._id}`);
      console.log(`   📅 Fecha: ${sol.fechaSolicitud}`);
      console.log(`   📦 Activo: ${sol.nombreActivo} (${sol.codigoActivo})`);
      console.log(`   🔄 Tipo: ${sol.tipoOperacion}`);
      console.log(`   📊 Estado: ${sol.estado}`);
      
      if (sol.solicitanteId) {
        console.log(`   👤 Solicitante: ${sol.solicitanteId.nombre} ${sol.solicitanteId.apellido}`);
      }
      
      if (sol.responsableSeguridadId) {
        console.log(`   🛡️ Responsable: ${sol.responsableSeguridadId.nombre} ${sol.responsableSeguridadId.apellido}`);
      }
      
      if (sol.justificacion) {
        console.log(`   📝 Justificación: ${sol.justificacion}`);
      }
      
      if (sol.comentarioSeguridad) {
        console.log(`   💬 Comentario: ${sol.comentarioSeguridad}`);
      }
      
      if (sol.cambios && sol.cambios.length > 0) {
        console.log(`   🔧 Cambios:`);
        sol.cambios.forEach(cambio => {
          console.log(`      - ${cambio.campo}: "${cambio.valorAnterior}" → "${cambio.valorNuevo}"`);
        });
      }
      
      console.log('   ' + '─'.repeat(50));
    });
    
    // Estadísticas
    const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'Aprobado').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'Rechazado').length;
    
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`   ⏳ Pendientes: ${pendientes}`);
    console.log(`   ✅ Aprobadas: ${aprobadas}`);
    console.log(`   ❌ Rechazadas: ${rechazadas}`);
    
  } catch (error) {
    console.error('❌ Error consultando solicitudes:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexión cerrada');
  }
};

// Ejecutar
consultarSolicitudes();