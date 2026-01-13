import client from './client';

export const getTeacherStats = async () => {
    const response = await client.get('/auth/teacher-stats');
    return response.data;
};

export const getTeacherCourses = async () => {
    const response = await client.get('/courses');
    return response.data;
};

export const getPendingSubmissions = async () => {
    const response = await client.get('/assignments/submissions/pending');
    return response.data;
};

export const getClassrooms = async () => {
    const response = await client.get('/classrooms');
    return response.data;
};

export const postAnnouncement = async (data) => {
    const response = await client.post('/classrooms/announcements', data);
    return response.data;
};
