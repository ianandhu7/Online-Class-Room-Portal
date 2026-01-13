import client from './client';

export const getClassrooms = async () => {
    const response = await client.get('/classrooms');
    return response.data;
};

export const getClassroom = async (id) => {
    const response = await client.get(`/classrooms/${id}`);
    return response.data;
};

export const createClassroom = async (data) => {
    const response = await client.post('/classrooms', data);
    return response.data;
};

export const joinClassroom = async (code) => {
    const response = await client.post('/classrooms/join', { code });
    return response.data;
};

export const getAnnouncements = async (classroomId) => {
    const response = await client.get(`/classrooms/announcements?classroom=${classroomId}`);
    return response.data;
};

export const createAnnouncement = async (data) => {
    const response = await client.post('/classrooms/announcements', data);
    return response.data;
};
