import apiClient from './apiClient';

export const createWarehouse = async (data) => {
    const response = await apiClient.post('/warehouse/', data);
    return response.data;
};

export const createRoom = async (data) => {
    const response = await apiClient.post('/warehouse/room', data);
    return response.data;
};

export const getWarehouses = async () => {
    const response = await apiClient.get('/warehouse/list');
    // Backend returns { count: n, data: [...] }
    // We unwrap it here for frontend convenience
    return response.data?.data || [];
};
