import apiClient from './client';

export const getWarehouses = async () => {
    const response = await apiClient.get('/warehouse/list');
    console.log('Warehouse API Response:', response);
    console.log('Response data:', response.data);
    console.log('Response data.data:', response.data?.data);
    return response.data?.data || [];
};

export const createWarehouse = async (data) => {
    const response = await apiClient.post('/warehouse/', data);
    console.log('Create warehouse response:', response);
    return response.data;
};

export const deleteWarehouse = async (warehouseId) => {
    const response = await apiClient.delete(`/warehouse/${warehouseId}`);
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
