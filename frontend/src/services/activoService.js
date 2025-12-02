import api from "./api";


export const createActivo = async (activoData) => {    
    const response = await api.post("/activos", activoData);
    return response.data.activo;
};

export const getActivos = async () => {
    const response = await api.get("/activos");
    return response.data.activos;
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
    const response = await api.get(`/activos/${id}/solicitudes-historial`);
    return response.data.history;
}