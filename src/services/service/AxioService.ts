
import axios from "axios";

export const instanceApi = axios.create({
  baseURL: import.meta.env.PROD ? "https://instituto-barros-sistema.azurewebsites.net/api" : "http://localhost:5101/api",  
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