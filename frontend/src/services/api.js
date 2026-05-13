import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put('/auth/profile', data, config);
  },
  uploadResume: (formData) => api.post('/auth/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  createUser: (data) => api.post('/auth/create-user', data),
  getUsers: (params) => api.get('/auth/users', { params }),
};

// Jobs
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats/overview'),
};

// Applications
export const applicationsAPI = {
  apply: (formData) => api.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => api.get('/applications/my'),
  getAll: (params) => api.get('/applications', { params }),
  getOne: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

// Interviews
export const interviewsAPI = {
  create: (data) => api.post('/interviews', data),
  getAll: (params) => api.get('/interviews', { params }),
  getMy: () => api.get('/interviews/my'),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
};

// Branches
export const branchesAPI = {
  getAll: () => api.get('/branches'),
  getOne: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`),
};

// Email
export const emailAPI = {
  send: (data) => api.post('/email/send', data),
};

export default api;
