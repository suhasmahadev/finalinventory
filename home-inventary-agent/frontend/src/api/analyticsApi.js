import apiClient from './apiClient';

export const getSoldToday = async () => {
    const response = await apiClient.get('/analytics/sold-today');
    // Returns { date: "...", total_sold: number }
    return response.data?.total_sold || 0;
};

export const getTopSelling = async (limit = 5) => {
    const response = await apiClient.get('/analytics/top-selling', { params: { limit } });
    // Returns { date: "...", data: [...] }
    return response.data?.data || [];
};

export const getLeastSelling = async (limit = 5) => {
    const response = await apiClient.get('/analytics/least-selling', { params: { limit } });
    // Returns { date: "...", data: [...] }
    return response.data?.data || [];
};

export const getExpiringItems = async (days = 7) => {
    const response = await apiClient.get('/analytics/expiring', { params: { days } });
    // Returns { within_days: n, count: n, data: [...] }
    return response.data?.data || [];
};

export const getForecast = async (itemId, days = 7) => {
    const response = await apiClient.get(`/analytics/forecast/${itemId}`, { params: { days } });
    return response.data;
};
