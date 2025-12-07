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
    try {
        const response = await api.get(`/activos/${id}`);
        
        // Manejar diferentes estructuras de respuesta del backend
        if (response.data) {
            // Si tiene estructura {success, data: {activo: ...}}
            if (response.data.success && response.data.data && response.data.data.activo) {
                return response.data.data.activo;
            }
            // Si tiene estructura {activo: ...}
            if (response.data.activo) {
                return response.data.activo;
            }
            // Si tiene estructura {success, data: activo}
            if (response.data.success && response.data.data) {
                return response.data.data;
            }
            // Si response.data es directamente el activo
            if (response.data._id || response.data.id) {
                return response.data;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error obteniendo activo por ID:', error);
        throw error;
    }
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

// para reasignacion desde admin
export const getActivosByResponsable = async (responsableId, params = {}) => {
    try {
        const queryParams = new URLSearchParams({
            responsable: responsableId,
            ...params
        }).toString();
        
        const response = await api.get(`/activos?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo activos por responsable:', error);
        throw error;
    }
};

export const hasActivosAsignados = async (responsableId) => {
    try {
        const response = await getActivosByResponsable(responsableId, { limit: 1 });
        return response.data?.activos?.length > 0 || response.activos?.length > 0;
    } catch (error) {
        console.error('Error verificando activos asignados:', error);
        return false;
    }
};