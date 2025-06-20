import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach Authorization header automatically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 👈 Use your camelCase key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
