import axios from 'axios';
const http = axios.create({ baseURL: 'https://employment-management-system-j1cs.onrender.com/api' });
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default http;