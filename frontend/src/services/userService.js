import api from "./api";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data; // Devolver la respuesta completa que incluye {success, message, data}
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data; // Devolver la respuesta completa que incluye {success, message, data, timestamp}
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};