import client from './client';

export const getGrades = async () => {
    const response = await client.get('/classrooms/grades');
    return response.data;
};

export const postGrade = async (data) => {
    const response = await client.post('/classrooms/grades', data);
    return response.data;
};

export const updateGrade = async (id, data) => {
    const response = await client.put(`/classrooms/grades/${id}`, data);
    return response.data;
};
