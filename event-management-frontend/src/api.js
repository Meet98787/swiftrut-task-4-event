import axios from 'axios';

// Base URL for your backend server (adjust according to your setup)
const api = axios.create({
    baseURL: 'https://swiftrut-task-4-event.vercel.app/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
