import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://plazze.app/wp-json";

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones autenticadas
client.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
