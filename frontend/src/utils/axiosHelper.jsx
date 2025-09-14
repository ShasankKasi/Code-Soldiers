import axios from "axios";

const api = axios.create({
  baseURL: "https://awseb--AWSEB-kQns1ZCQCz5w-1733795718.ap-south-1.elb.amazonaws.com:8080",
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
