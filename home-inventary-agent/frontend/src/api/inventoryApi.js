import apiClient from './client';

// Get all inventory items
export const getItems = async () => {
    const response = await apiClient.get('/inventory/items');
    return response.data?.data || [];
};

export const createItem = async (data) => {
    const response = await apiClient.post('/inventory/item', null, { params: data });
    return response.data;
};

export const addStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/add', null, { params: data });
    return response.data;
};

export const deductStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/deduct', null, { params: data });
    return response.data;
};

export const getItemStock = async (itemId) => {
    const response = await apiClient.get(`/inventory/stock/${itemId}`);
    return response.data;
};
