import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    if (!url.endsWith('/api') && !url.endsWith('/api/')) {
        url += '/api';
    }
    return url;
};

const API_URL = getBaseUrl();

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default client;
