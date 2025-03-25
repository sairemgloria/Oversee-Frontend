import axios from "axios";
import { useAuthAdminStore } from "@/stores/auth/authAdminStore"; // Adjust path if needed

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token dynamically before each request
api.interceptors.request.use(
  (config) => {
    const authAdminStore = useAuthAdminStore();
    if (authAdminStore.token) {
      config.headers.Authorization = `Bearer ${authAdminStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
