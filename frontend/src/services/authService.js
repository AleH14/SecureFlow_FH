import api from "./api";

export const login = async (email, contrasena) => {
  const response = await api.post("/auth/login", { email, contrasena });
  
  // Si el login es exitoso, guardar token en cookie
  if (response.data?.success && response.data?.data?.token) {
    // Guardar en cookie para el middleware
    document.cookie = `token=${response.data.data.token}; path=/; max-age=86400; SameSite=Strict`;
  }
  
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
  try {
    // Llamar al endpoint de logout en el servidor
    const token = localStorage.getItem("token");
    if (token) {
      await api.post("/auth/logout");
    }
  } catch (error) {
    console.error('Error en logout del servidor:', error);
    // Continuar con la limpieza local aunque falle el servidor
  } finally {
    // Limpiar datos locales independientemente del resultado del servidor
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Limpiar cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
  }
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