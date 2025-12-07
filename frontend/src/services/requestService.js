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
          console.error(`Error obteniendo solicitud ${id}:`, error);
        throw error;
    }
};

export const reviewRequest = async (id, estado, comentario) => {
    try {     
        const response = await api.put(`/solicitudes/${id}/revisar`, { 
            estado, 
            comentario 
        });
        
        return response.data;
    } catch (error) {
         console.error(`Error revisando solicitud ${id}:`, error);
        throw error;
    }
};

export const addCommentToRequestByAuditory = async (id, comentario) => {
    try {    
        const response = await api.put(`/solicitudes/${id}/auditoria`, { comentario });
        
        return response.data;
    } catch (error) {
       console.error(`Error agregando comentario a solicitud ${id}:`, error);
        throw error;
    }
}