import apiClient from './client';

export const getSoldToday = async () => {
    const response = await apiClient.get('/analytics/sold-today');
    return response.data?.total_sold || 0;
};

export const getRevenueToday = async () => {
    const response = await apiClient.get('/analytics/revenue-today');
    return response.data?.total_revenue || 0;
};

export const getTopSelling = async (limit = 5) => {
    const response = await apiClient.get('/analytics/top-selling', { params: { limit } });
    return response.data?.data || [];
};

export const getLeastSelling = async (limit = 5) => {
    const response = await apiClient.get('/analytics/least-selling', { params: { limit } });
    return response.data?.data || [];
};

export const getExpiringItems = async (days = 7) => {
    const response = await apiClient.get('/analytics/expiring', { params: { days } });
    return response.data?.data || [];
};

export const getStockSummary = async () => {
    const response = await apiClient.get('/analytics/stock-summary');
    return response.data?.data || [];
};

export const getDeadStock = async (days = 30) => {
    const response = await apiClient.get('/analytics/dead-stock', { params: { days } });
    return response.data?.data || [];
};

export const getStockTurnover = async (itemId, days = 30) => {
    const response = await apiClient.get(`/analytics/turnover/${itemId}`, { params: { days } });
    return response.data;
};

export const getSalesHistory = async (itemId, days = 30) => {
    const response = await apiClient.get(`/analytics/history/${itemId}`, { params: { days } });
    return response.data;
};

export const getForecast = async (itemId, days = 7) => {
    const response = await apiClient.get(`/analytics/forecast/${itemId}`, { params: { days } });
    return response.data;
};

export const getReorderSuggestion = async (itemId, days = 7) => {
    const response = await apiClient.get(`/analytics/reorder/${itemId}`, { params: { days } });
    return response.data;
};
