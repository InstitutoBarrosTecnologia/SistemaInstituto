
import axios from "axios";
import toast from "react-hot-toast";

export const instanceApi = axios.create({
  baseURL: import.meta.env.PROD ? "https://instituto-barros-sistema.azurewebsites.net/api" : "http://localhost:5101/api",
  timeout: 30000, // 30 segundos
});

instanceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou onde você armazenou o token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erro 429
instanceApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      toast.error("Muitas tentativas de solicitação ao servidor, por favor tente daqui 1 minuto novamente", {
        duration: 5000,
        position: "top-center",
      });
    }
    return Promise.reject(error);
  }
);