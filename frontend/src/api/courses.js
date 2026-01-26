import client from './client';

export const getCourses = async () => {
    const response = await client.get('/courses');
    return response.data;
};

export const getCourse = async (id) => {
    const response = await client.get(`/courses/${id}`);
    return response.data;
};

export const createCourse = async (data) => {
    const response = await client.post('/courses', data);
    return response.data;
};

export const updateCourse = async (id, data) => {
    const response = await client.put(`/courses/${id}`, data);
    return response.data;
};
