import axios from "axios";

const api = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: "http://localhost:5000",
});

// Add JWT to headers automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
