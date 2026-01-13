import client from './client';

export const getStudentStats = async () => {
    const response = await client.get('/auth/student-stats');
    return response.data;
};

export const getMyCourses = async () => {
    // This is already filtered in CourseViewSet by enrollment
    const response = await client.get('/courses');
    return response.data;
};

export const getUpcomingAssignments = async () => {
    // We can filter this on the frontend or backend
    const response = await client.get('/assignments');
    return response.data;
};

export const getAnnouncements = async () => {
    const response = await client.get('/classrooms/announcements');
    return response.data;
};
