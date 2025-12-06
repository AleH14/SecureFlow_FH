import api from "./api";

export const login = async (email, contrasena) => {
  try {
    const response = await api.post("/auth/login", { email, contrasena });
    return response.data;
  } catch (error) {
    // Re-lanzar el error para que LoginForm pueda manejarlo
    throw error;
  }
};

export const register = async (
  nombre,
  apellido,
  email,
  telefono,
  departamento,
  contrasena,
  confirmarContrasena,
  rol
) => {
  try {
    const response = await api.post("/auth/register", {
      nombre,
      apellido,
      email,
      telefono,
      departamento,
      contrasena,
      confirmarContrasena,
      rol,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    // Limpiar el token si es inválido
    if (error.response?.status === 401) {
      logout();
    }
    throw error;
  }
}