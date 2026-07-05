import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const updateCredentials = async (credentials) => {
  const response = await api.put('/auth/credentials', credentials);
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('token');
};

export const getSectionData = async (sectionType) => {
  const response = await api.get(`/data/${sectionType}`);
  return response.data;
};

export const createSectionData = async (sectionType, data) => {
  const response = await api.post(`/data/${sectionType}`, data);
  return response.data;
};

export const updateSectionData = async (sectionType, id, data) => {
  const response = await api.put(`/data/${sectionType}/${id}`, data);
  return response.data;
};

export const deleteSectionData = async (sectionType, id) => {
  const response = await api.delete(`/data/${sectionType}/${id}`);
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
