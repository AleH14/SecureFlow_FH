import api from "./api";


export const createActivo = async (activoData) => {    
    try {
        const response = await api.post("/activos", activoData);
        return response.data; // Devolver la respuesta completa que incluye {activo, solicitud}
    } catch (error) {
        console.error('Error creando activo:', error);
        throw error;
    }
};

export const getActivos = async () => {
    try {
        const response = await api.get("/activos");
        return response.data; // Devolver la respuesta completa que incluye {success, message, data, timestamp}
    } catch (error) {
        console.error('Error obteniendo activos:', error);
        throw error;
    }
};

export const getActivoById = async (id) => {
    const response = await api.get(`/activos/${id}`);
    return response.data.activo;
};
export const updateActivo = async (id, activoData) => {
    try {
        const response = await api.put(`/activos/${id}`, activoData);
        return response.data; // Devolver la respuesta completa que incluye {activo, solicitud}
    } catch (error) {
        console.error('Error actualizando activo:', error);
        throw error;
    }
};

export const historyCommentsByActivoId = async (id) => {
    const response = await api.get(`/activos/${id}/historial`);
    return response.data.comments;
};

export const historyCompleteRequestByActivoId = async (id) => {
    try {
        const response = await api.get(`/activos/${id}/solicitudes-historial`);
        return response.data; // Devolver la respuesta completa que incluye {success, message, data}
    } catch (error) {
        console.error('Error obteniendo historial de solicitudes:', error);
        throw error;
    }
}

export const getResponsablesDisponibles = async () => {
  try {
    const response = await api.get("/activos/responsables/disponibles");

    // El backend devuelve {success, message, data, timestamp}
    // Necesitamos extraer el array de usuarios
    if (response.data && response.data.success && response.data.data) {
      return response.data.data; // Devuelve el array de usuarios directamente
    }
    
    // Si la respuesta es directamente un array (formato antiguo)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si no, devolver la respuesta completa
    return response.data;
    
  } catch (error) {
    console.error('Error obteniendo responsables disponibles:', error);
    throw error;
  }
};