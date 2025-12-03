import api from "./api";

export const login = async (email, contrasena) => {
  const response = await api.post("/auth/login", { email, contrasena });
  return response.data; // Devolver la respuesta completa que tiene la estructura { success: true, data: { token, user } }
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
  return response.data; // Devolver la respuesta completa
};


export const logout = async () => {
    localStorage.removeItem("token");
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;    
    const response = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.data; // La API devuelve { success: true, data: { user info } }
}