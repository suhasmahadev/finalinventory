import apiClient from './apiClient';

// Get all inventory items
export const getInventoryItems = async () => {
    const response = await apiClient.get('/inventory/items');
    // Backend returns { count: n, data: [...] }
    // We unwrap it here for frontend convenience
    return response.data?.data || [];
};

// Create a new item
export const createItem = async (data) => {
    const response = await apiClient.post('/inventory/item', null, { params: data });
    return response.data;
};

// Add stock to an item
export const addStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/add', null, { params: data });
    return response.data;
};

// Deduct stock from an item
export const deductStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/deduct', null, { params: data });
    return response.data;
};

// Get specific item stock summary
export const getItemStock = async (itemId) => {
    const response = await apiClient.get(`/inventory/stock/${itemId}`);
    return response.data;
};
