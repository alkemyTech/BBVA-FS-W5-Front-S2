import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Agrega un interceptor para incluir el token en los headers antes de cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtiene el token actual
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
