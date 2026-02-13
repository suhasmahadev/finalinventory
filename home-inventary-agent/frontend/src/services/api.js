import apiClient from './apiClient';

// =========================================================
// PRODUCTS API
// =========================================================
export const productsApi = {
    createProduct: (data) => apiClient.post('/products', data),
    getAllProducts: (skip = 0, limit = 50) => apiClient.get('/products', { params: { skip, limit } }),
    getProduct: (id) => apiClient.get(`/products/${id}`),
    updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`),
    getMLStatus: () => apiClient.get('/products/ml/status'),
};

// =========================================================
// CATEGORIES API
// =========================================================
export const categoriesApi = {
    getAllCategories: () => apiClient.get('/categories'),
    getCategory: (id) => apiClient.get(`/categories/${id}`),
    createCategory: (data) => apiClient.post('/categories', data),
    deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
};

// =========================================================
// INVENTORY API
// =========================================================
export const inventoryApi = {
    addStock: (data) => apiClient.post('/inventory/stock/add', data),
    deductStock: (data) => apiClient.post('/inventory/stock/deduct', data),
    getItemStock: (itemId) => apiClient.get(`/inventory/stock/${itemId}`),
};

// =========================================================
// ANALYTICS API
// =========================================================
export const analyticsApi = {
    getSoldToday: () => apiClient.get('/analytics/sold-today'),
    getRevenueToday: () => apiClient.get('/analytics/revenue-today'),
    getTopSelling: (limit = 10) => apiClient.get('/analytics/top-selling', { params: { limit } }),
    getLeastSelling: (limit = 10) => apiClient.get('/analytics/least-selling', { params: { limit } }),
    getExpiring: (days = 30) => apiClient.get('/analytics/expiring', { params: { days } }),
    getStockSummary: () => apiClient.get('/analytics/stock-summary'),
    getDeadStock: (days = 90) => apiClient.get('/analytics/dead-stock', { params: { days } }),
    getStockTurnover: (itemId, days = 30) => apiClient.get(`/analytics/turnover/${itemId}`, { params: { days } }),
    getSalesHistory: (itemId, days = 30) => apiClient.get(`/analytics/history/${itemId}`, { params: { days } }),
    getForecast: (itemId, days = 30) => apiClient.get(`/analytics/forecast/${itemId}`, { params: { days } }),
    getReorderSuggestion: (itemId, days = 30) => apiClient.get(`/analytics/reorder/${itemId}`, { params: { days } }),
};

// =========================================================
// WAREHOUSE API
// =========================================================
export const warehouseApi = {
    createWarehouse: (data) => apiClient.post('/warehouse/', data),
    deleteWarehouse: (id) => apiClient.delete(`/warehouse/${id}`),
    listWarehouses: () => apiClient.get('/warehouse/list'),
    getWarehouse: (id) => apiClient.get(`/warehouse/${id}`),
    getWarehouseDashboard: (id) => apiClient.get(`/warehouse/dashboard/${id}`),
    createRoom: (data) => apiClient.post('/warehouse/room', data),
    updateRoom: (id, data) => apiClient.put(`/warehouse/room/${id}`, data),
    deleteRoom: (id) => apiClient.delete(`/warehouse/room/${id}`),
    getRoom: (id) => apiClient.get(`/warehouse/room/${id}`),
};

// =========================================================
// BILLING API
// =========================================================
export const billingApi = {
    createBill: (data) => apiClient.post('/billing/', data),
    postBill: (id) => apiClient.post(`/billing/${id}/post`),
    getBill: (id) => apiClient.get(`/billing/${id}`),
    getBillByNumber: (billNumber) => apiClient.get(`/billing/number/${billNumber}`),
    listBills: () => apiClient.get('/billing/list'),
    deleteBill: (id) => apiClient.delete(`/billing/${id}`),
};

// =========================================================
// MOVEMENT API
// =========================================================
export const movementApi = {
    adjustStock: (data) => apiClient.post('/movement/adjust', data),
    transferStock: (data) => apiClient.post('/movement/transfer', data),
    getItemLedger: (itemId) => apiClient.get(`/movement/ledger/${itemId}`),
    getBatchMovements: (batchId) => apiClient.get(`/movement/batch/${batchId}`),
};

// =========================================================
// HEALTH API
// =========================================================
export const healthApi = {
    healthCheck: () => apiClient.get('/health'),
};
