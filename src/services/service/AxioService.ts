
import axios from "axios";

export const instanceApi = axios.create({
  baseURL: import.meta.env.PROD ? "https://traning-now-api-h9b4a0b0duc6cjaq.eastus2-01.azurewebsites.net/api" : "https://localhost:7233/api",  
});

