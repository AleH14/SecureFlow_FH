import api from "./api";

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data.users;
  } catch (error) {
    // Rethrow the error so it can be handled at a higher level.
    // You may customize error handling here as needed.
   throw error;
 }
}