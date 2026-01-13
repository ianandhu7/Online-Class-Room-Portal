import client from './client';

export const getUsers = async (role = null) => {
    const params = role ? { role } : {};
    const response = await client.get('/auth/users', { params });
    return response.data;
};

export const getTeachers = async () => {
    return getUsers('teacher');
};

export const deleteUser = async (id) => {
    const response = await client.delete(`/auth/users/${id}`);
    return response.data;
};
