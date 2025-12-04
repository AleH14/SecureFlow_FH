// Script para ver cambios de un activo específico
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Función para mostrar cambios de manera visual
const mostrarCambiosVisual = (cambios) => {
  if (!cambios || cambios.length === 0) {
    return;
  }
};

// Función para obtener solicitudes de un activo específico
const verCambiosActivo = async () => {
  
  try {
    // Primero hacer login (usa cualquier usuario que tengas)
    // Puedes obtener este email de la base de datos o crear uno nuevo
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'ana.garcia.1733024831573@secureflow.com', // Cambiar por un email válido
      contrasena: 'Admin123!'
    });
    
    const token = loginResponse.data.data.token;
    
    // Obtener todas las solicitudes
    const solicitudesResponse = await axios.get(`${BASE_URL}/solicitudes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const solicitudes = solicitudesResponse.data.data.solicitudes;
    
    if (solicitudes.length === 0) {
      return;
    }
    
    // Obtener detalles de cada solicitud para ver los cambios
    for (let i = 0; i < solicitudes.length; i++) {
      const solicitud = solicitudes[i];
      
      // Obtener detalles completos para ver los cambios
      try {
        const detalleResponse = await axios.get(`${BASE_URL}/solicitudes/${solicitud.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const detalle = detalleResponse.data.data;
        mostrarCambiosVisual(detalle.cambios);
        
      } catch (error) {
        // Error obteniendo detalles de cambios
      }
    }
    
  } catch (error) {
    // Error: error.response?.data?.message || error.message
  }
};

// Ejecutar
verCambiosActivo();