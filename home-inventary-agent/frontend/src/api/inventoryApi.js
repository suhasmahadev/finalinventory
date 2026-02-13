import apiClient from './client';

// =========================================================
// ITEMS - Use /products endpoint for ML integration
// =========================================================
export const getItems = async () => {
    const response = await apiClient.get('/products');
    return response.data || [];
};

export const createItem = async (data) => {
    // ✅ Use /products endpoint with ML integration
    const response = await apiClient.post('/products', data);
    return response.data;
};

export const updateItem = async (id, data) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
};

export const deleteItem = async (id) => {
    await apiClient.delete(`/products/${id}`);
};

export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data || [];
};


// =========================================================
// STOCK OPERATIONS
// =========================================================
export const addStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/add', data);
    return response.data;
};

export const deductStock = async (data) => {
    const response = await apiClient.post('/inventory/stock/deduct', data);
    return response.data;
};

export const getItemStock = async (itemId) => {
    const response = await apiClient.get(`/inventory/stock/${itemId}`);
    return response.data;
};
