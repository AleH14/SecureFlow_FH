// Script para mostrar cambios detallados de activos
const mongoose = require('mongoose');

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
    console.log('   📝 No hay cambios registrados');
    return;
  }

  console.log('   🔄 CAMBIOS REALIZADOS:');
  cambios.forEach(cambio => {
    console.log(`   ┌─ Campo: ${cambio.campo.toUpperCase()}`);
    console.log(`   │  ❌ Antes: "${cambio.valorAnterior || 'N/A'}"`);
    console.log(`   │  ✅ Ahora: "${cambio.valorNuevo || 'N/A'}"`);
    console.log('   └─' + '─'.repeat(40));
  });
};

// Función principal
const verCambiosActivos = async () => {
  await connectDB();
  
  console.log('\n🔍 HISTORIAL DE CAMBIOS DE ACTIVOS\n');
  
  try {
    // Obtener todas las solicitudes con cambios
    const solicitudes = await Solicitud.find({})
      .populate('solicitanteId', 'nombre apellido email codigo')
      .populate('responsableSeguridadId', 'nombre apellido email codigo')
      .populate('activoId', 'codigo nombre categoria estado')
      .sort({ fechaSolicitud: -1 });
    
    if (solicitudes.length === 0) {
      console.log('❌ No se encontraron solicitudes');
      return;
    }
    
    console.log(`📋 ENCONTRADAS ${solicitudes.length} SOLICITUDES:\n`);
    
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
      console.log(`🏷️  ACTIVO: ${activo}`);
      console.log('═'.repeat(60));
      
      solicitudesActivo.forEach((sol, index) => {
        console.log(`\n📄 SOLICITUD ${index + 1}: ${sol.codigoSolicitud}`);
        console.log(`   📅 Fecha: ${new Date(sol.fechaSolicitud).toLocaleString()}`);
        console.log(`   🔄 Tipo: ${sol.tipoOperacion || 'N/A'}`);
        console.log(`   📊 Estado: ${sol.estado}`);
        console.log(`   👤 Solicitante: ${sol.solicitanteId?.nombre} ${sol.solicitanteId?.apellido}`);
        
        if (sol.responsableSeguridadId) {
          console.log(`   🛡️  Revisado por: ${sol.responsableSeguridadId.nombre} ${sol.responsableSeguridadId.apellido}`);
        }
        
        if (sol.justificacion) {
          console.log(`   📝 Justificación: "${sol.justificacion}"`);
        }
        
        if (sol.comentarioSeguridad) {
          console.log(`   💬 Comentario del revisor: "${sol.comentarioSeguridad}"`);
        }
        
        // Mostrar cambios detallados
        mostrarCambios(sol.cambios);
        
        console.log('   ' + '─'.repeat(50));
      });
      
      console.log('\n');
    });
    
    // Mostrar resumen de tipos de cambios
    console.log('\n📊 RESUMEN DE CAMBIOS POR CAMPO:');
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
    
    Object.entries(cambiosPorCampo).forEach(([campo, cantidad]) => {
      console.log(`   🔧 ${campo}: ${cantidad} cambios`);
    });
    
  } catch (error) {
    console.error('❌ Error consultando cambios:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexión cerrada');
  }
};

// Ejecutar
verCambiosActivos();