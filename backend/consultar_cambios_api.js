// Script para ver cambios de un activo específico
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Función para mostrar cambios de manera visual
const mostrarCambiosVisual = (cambios) => {
  if (!cambios || cambios.length === 0) {
    console.log('   📝 No hay cambios registrados');
    return;
  }

  console.log('   🔄 CAMBIOS REALIZADOS:');
  cambios.forEach(cambio => {
    console.log(`   ┌─ ${cambio.campo.toUpperCase()}`);
    console.log(`   │  ❌ Valor anterior: "${cambio.valorAnterior || 'N/A'}"`);
    console.log(`   │  ✅ Valor nuevo:    "${cambio.valorNuevo || 'N/A'}"`);
    console.log('   └─' + '─'.repeat(40));
  });
};

// Función para obtener solicitudes de un activo específico
const verCambiosActivo = async () => {
  console.log('🔍 CONSULTANDO CAMBIOS DE ACTIVOS...\n');
  
  try {
    // Primero hacer login (usa cualquier usuario que tengas)
    // Puedes obtener este email de la base de datos o crear uno nuevo
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'ana.garcia.1733024831573@secureflow.com', // Cambiar por un email válido
      contrasena: 'Admin123!'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login exitoso\n');
    
    // Obtener todas las solicitudes
    const solicitudesResponse = await axios.get(`${BASE_URL}/solicitudes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const solicitudes = solicitudesResponse.data.data.solicitudes;
    
    if (solicitudes.length === 0) {
      console.log('❌ No se encontraron solicitudes');
      return;
    }
    
    console.log(`📋 ENCONTRADAS ${solicitudes.length} SOLICITUDES:\n`);
    
    // Obtener detalles de cada solicitud para ver los cambios
    for (let i = 0; i < solicitudes.length; i++) {
      const solicitud = solicitudes[i];
      
      console.log(`${i + 1}. 📄 SOLICITUD: ${solicitud.codigoSolicitud}`);
      console.log(`   🏷️  Activo: ${solicitud.nombreActivo} (${solicitud.codigoActivo})`);
      console.log(`   📅 Fecha: ${new Date(solicitud.fechaSolicitud).toLocaleString()}`);
      console.log(`   🔄 Tipo: ${solicitud.tipoOperacion}`);
      console.log(`   📊 Estado: ${solicitud.estado}`);
      console.log(`   👤 Solicitante: ${solicitud.solicitante.nombreCompleto}`);
      
      if (solicitud.responsableSeguridad) {
        console.log(`   🛡️  Revisado por: ${solicitud.responsableSeguridad.nombreCompleto}`);
      }
      
      if (solicitud.comentarioSeguridad) {
        console.log(`   💬 Comentario: "${solicitud.comentarioSeguridad}"`);
      }
      
      // Obtener detalles completos para ver los cambios
      try {
        const detalleResponse = await axios.get(`${BASE_URL}/solicitudes/${solicitud.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const detalle = detalleResponse.data.data;
        mostrarCambiosVisual(detalle.cambios);
        
      } catch (error) {
        console.log('   ❌ Error obteniendo detalles de cambios');
      }
      
      console.log('   ' + '═'.repeat(60));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    console.log('\n💡 SUGERENCIAS:');
    console.log('   1. Verifica que el servidor esté ejecutándose');
    console.log('   2. Asegúrate de tener un usuario válido');
    console.log('   3. Ejecuta primero test_system.js para crear datos');
  }
};

// Ejecutar
verCambiosActivo();