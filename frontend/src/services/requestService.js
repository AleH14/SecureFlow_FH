import api from "./api";


export const getRequests = async () => {
    const response = await api.get("/solicitudes");
    return response.data.solicitudes;
}


export const getRequestById = async (id) => {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data.solicitud;
}

export const reviewRequest = async (id, status, comentarios) => {
    const response = await api.put(`/solicitudes/${id}/revisar`, { status, comentarios });
    return response.data.solicitud;
}

export const addCommentToRequestByAuditory = async (id, comentario) => {
    const response = await api.post(`/solicitudes/${id}/auditoria`, { comentario });
    return response.data.comment;
}