import apiClient from './client';

export const voiceInteraction = async (audioBase64, language = 'en-US') => {
    const response = await apiClient.post('/voice/', {
        audio_base64: audioBase64,
        language
    });
    return response.data;
};
