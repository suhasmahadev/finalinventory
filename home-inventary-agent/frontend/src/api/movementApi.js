import apiClient from './client';

export const adjustStock = async (data) => {
    const response = await apiClient.post('/movement/adjust', data);
    return response.data;
};

export const transferStock = async (data) => {
    const response = await apiClient.post('/movement/transfer', data);
    return response.data;
};
