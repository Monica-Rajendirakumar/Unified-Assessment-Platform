import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Automatically attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
