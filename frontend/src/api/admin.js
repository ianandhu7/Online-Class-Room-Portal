import client from './client';

export const getUsers = async () => {
    const response = await client.get('/auth/users');
    return response.data;
};

export const getStats = async () => {
    const response = await client.get('/auth/stats');
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await client.delete(`/auth/users/${id}`);
    return response.data;
};
