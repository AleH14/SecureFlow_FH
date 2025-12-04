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
        console.log('Iniciando petición para obtener activos...');
        const response = await api.get("/activos");
        console.log('Respuesta exitosa de activos:', response.status, response.statusText);
        return response.data; // Devolver la respuesta completa que incluye {success, message, data, timestamp}
    } catch (error) {
        console.error('Error obteniendo activos:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method
        });
        
        // Proporcionar un mensaje más específico según el tipo de error
        if (error.code === 'ERR_NETWORK') {
            throw new Error('Error de conexión con el servidor. Verifica que el backend esté ejecutándose.');
        } else if (error.response?.status === 401) {
            throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
        } else if (error.response?.status === 403) {
            throw new Error('No tienes permisos para ver los activos.');
        } else if (error.response?.status >= 500) {
            throw new Error('Error del servidor. Intenta nuevamente en unos momentos.');
        } else {
            throw new Error(`Error al obtener activos: ${error.message}`);
        }
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