import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMsg = error.response?.data?.detail || error.message || 'Unknown API Error';
        console.error('API Error:', errorMsg);
        return Promise.reject(error);
    }
);

export default apiClient;
