import client from './client';

export const getAssignments = async (classroomId = null) => {
    const url = classroomId ? `/assignments?classroomId=${classroomId}` : '/assignments';
    const response = await client.get(url);
    return response.data;
};

export const getAssignment = async (id) => {
    const response = await client.get(`/assignments/${id}`);
    return response.data;
};

export const createAssignment = async (data) => {
    const response = await client.post('/assignments', data);
    return response.data;
};

export const submitAssignment = async (id, data) => {
    const response = await client.post(`/assignments/${id}/submit`, data);
    return response.data;
};

export const getSubmissions = async (assignmentId) => {
    const response = await client.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
};

export const gradeSubmission = async (submissionId, data) => {
    const response = await client.put(`/submissions/${submissionId}/grade`, data);
    return response.data;
};
