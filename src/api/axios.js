import axios from "axios";

const api = axios.create({
  baseURL: 'http://sarm-server.duckdns.org:8888',
  // baseURL: "http://localhost:8888",
  withCredentials: true, // ✅ 세션 인증 시 꼭 필요
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
