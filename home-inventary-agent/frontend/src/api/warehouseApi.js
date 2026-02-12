import apiClient from './client';

export const getWarehouses = async () => {
    const response = await apiClient.get('/warehouse/list');
    return response.data?.data || [];
};

export const createWarehouse = async (data) => {
    const response = await apiClient.post('/warehouse/', data);
    return response.data;
};

export const createRoom = async (data) => {
    const response = await apiClient.post('/warehouse/room', data);
    return response.data;
};

export const deleteRoom = async (roomId) => {
    const response = await apiClient.delete(`/warehouse/room/${roomId}`);
    return response.data;
};

export const getWarehouseDashboard = async (warehouseId) => {
    const response = await apiClient.get(`/warehouse/dashboard/${warehouseId}`);
    return response.data;
};
