const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Función para hacer login y obtener token
const login = async () => {
  try {
    // Usar el primer usuario admin de las pruebas
    const timestamp = 1733024831573; // Del último test
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: `ana.garcia.${timestamp}@secureflow.com`,
      contrasena: 'Admin123!'
    });
    return response.data.data.token;
  } catch (error) {
    console.error('Error en login:', error.response?.data);
    return null;
  }
};

// Función para obtener solicitudes
const getSolicitudes = async (token, filters = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/solicitudes${filters}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error.response?.data);
    return null;
  }
};

// Función principal
const main = async () => {
  console.log('🔍 Obteniendo solicitudes del sistema...\n');
  
  // 1. Hacer login
  const token = await login();
  if (!token) {
    console.log('❌ No se pudo obtener el token');
    return;
  }
  
  // 2. Obtener todas las solicitudes
  console.log('📋 Todas las solicitudes:');
  const allSolicitudes = await getSolicitudes(token);
  if (allSolicitudes) {
    console.log(`Total: ${allSolicitudes.data.pagination.totalSolicitudes}`);
    allSolicitudes.data.solicitudes.forEach(sol => {
      console.log(`- ${sol.codigoSolicitud} | ${sol.estado} | ${sol.tipoOperacion} | ${sol.nombreActivo}`);
    });
  }
  console.log('');
  
  // 3. Obtener solo pendientes
  console.log('⏳ Solicitudes pendientes:');
  const pendientes = await getSolicitudes(token, '?estado=Pendiente');
  if (pendientes) {
    pendientes.data.solicitudes.forEach(sol => {
      console.log(`- ${sol.codigoSolicitud} | ${sol.nombreActivo} | Solicitante: ${sol.solicitante.nombreCompleto}`);
    });
  }
  console.log('');
  
  // 4. Obtener aprobadas
  console.log('✅ Solicitudes aprobadas:');
  const aprobadas = await getSolicitudes(token, '?estado=Aprobado');
  if (aprobadas) {
    aprobadas.data.solicitudes.forEach(sol => {
      console.log(`- ${sol.codigoSolicitud} | ${sol.nombreActivo} | Aprobada por: ${sol.responsableSeguridad?.nombreCompleto || 'N/A'}`);
    });
  }
  console.log('');
  
  // 5. Obtener rechazadas
  console.log('❌ Solicitudes rechazadas:');
  const rechazadas = await getSolicitudes(token, '?estado=Rechazado');
  if (rechazadas) {
    rechazadas.data.solicitudes.forEach(sol => {
      console.log(`- ${sol.codigoSolicitud} | ${sol.nombreActivo} | Comentario: ${sol.comentarioSeguridad}`);
    });
  }
};

main().catch(console.error);