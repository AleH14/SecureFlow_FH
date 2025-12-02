import api from "./api";

export const login = async (email, contrasena) => {
  const response = await api.post("/auth/login", { email, contrasena });
  const { token, user } = response.data;
  return { token, user };
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
  const { token, user } = response.data;
  return { token, user };
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
    return response.data.user;
}