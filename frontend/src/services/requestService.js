import api from "./api";


export const getRequests = async () => {
    try {
        const response = await api.get("/solicitudes");
        return response.data; // Devolver la respuesta completa que incluye {success, message, data, timestamp}
    } catch (error) {
        console.error('Error obteniendo solicitudes:', error);
        throw error;
    }
};


export const getRequestById = async (id) => {
    try {
        const response = await api.get(`/solicitudes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo solicitud por ID:', error);
        throw error;
    }
};

export const reviewRequest = async (id, estado, comentario) => {
    try {
        console.log('ReviewRequest - Sending data:', { id, estado, comentario });
        
        const response = await api.put(`/solicitudes/${id}/revisar`, { 
            estado, 
            comentario 
        });
        
        console.log('ReviewRequest - Response received:', response);
        console.log('ReviewRequest - Response status:', response.status);
        console.log('ReviewRequest - Response data:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('ReviewRequest - Error details:', error);
        console.error('ReviewRequest - Error response:', error.response?.data);
        console.error('ReviewRequest - Error status:', error.response?.status);
        throw error;
    }
};

export const addCommentToRequestByAuditory = async (id, comentario) => {
    const response = await api.post(`/solicitudes/${id}/auditoria`, { comentario });
    return response.data.comment;
}