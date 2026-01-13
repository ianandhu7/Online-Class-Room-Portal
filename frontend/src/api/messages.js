import client from './client';

export const getMessages = async () => {
    const response = await client.get('/messages');
    return response.data;
};

export const sendMessage = async (data) => {
    const response = await client.post('/messages', data);
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await client.patch(`/messages/${id}`, { is_read: true });
    return response.data;
};
