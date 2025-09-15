import axios from "axios";

const api = axios.create({
  baseURL: "http://codesoldiers.ap-south-1.elasticbeanstalk.com",
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
