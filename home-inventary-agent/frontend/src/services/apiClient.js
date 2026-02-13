import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle 422 validation errors
            if (error.response.status === 422 && error.response.data?.detail) {
                const validationErrors = error.response.data.detail.map((err) => ({
                    field: err.loc?.join('.') || 'unknown',
                    message: err.msg || 'Validation error',
                }));
                error.validationErrors = validationErrors;
            }

            // Handle other HTTP errors
            error.message = error.response.data?.message || error.response.data?.detail || error.message;
        } else if (error.request) {
            // Network error
            error.message = 'Network error. Please check your connection.';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
