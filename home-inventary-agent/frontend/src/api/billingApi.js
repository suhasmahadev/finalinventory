import apiClient from './client';

export const createBill = async (data) => {
    const response = await apiClient.post('/billing/', data);
    return response.data;
};

export const postBill = async (billId) => {
    const response = await apiClient.post(`/billing/${billId}/post`);
    return response.data;
};

export const getBill = async (billId) => {
    const response = await apiClient.get(`/billing/${billId}`);
    return response.data;
};

export const getBillByNumber = async (billNumber) => {
    const response = await apiClient.get(`/billing/number/${billNumber}`);
    return response.data;
};

export const listBills = async () => {
    const response = await apiClient.get('/billing/');
    return response.data?.data || [];
};
