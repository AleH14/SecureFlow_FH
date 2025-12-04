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
    return null;
  }
};

// Función principal
const main = async () => {
  
  // 1. Hacer login
  const token = await login();
  if (!token) {
    return;
  }
  
  // 2. Obtener todas las solicitudes
  const allSolicitudes = await getSolicitudes(token);
  
  // 3. Obtener solo pendientes
  const pendientes = await getSolicitudes(token, '?estado=Pendiente');
  
  // 4. Obtener aprobadas
  const aprobadas = await getSolicitudes(token, '?estado=Aprobado');
  
  // 5. Obtener rechazadas
  const rechazadas = await getSolicitudes(token, '?estado=Rechazado');
};

main().catch(console.error);