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
    const response = await api.put(`/activos/${id}`, activoData);
    return response.data.activo;
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