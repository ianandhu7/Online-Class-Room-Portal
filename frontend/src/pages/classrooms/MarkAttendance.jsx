import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClassrooms } from '../../api/teacher';
import client from '../../api/client';

const MarkAttendance = () => {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const data = await getClassrooms();
                setClassrooms(data);
                if (data.length > 0) {
                    setSelectedClassroom(data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch classrooms", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClassrooms();
    }, []);

    useEffect(() => {
        if (selectedClassroom) {
            const fetchStudents = async () => {
                try {
                    // Fetch enrollments for specific classroom
                    const response = await client.get(`/classrooms/${selectedClassroom}`);
                    // Extract student details from enrollments
                    if (response.data.enrollments && response.data.enrollments.length > 0) {
                        const studentList = response.data.enrollments.map(e => {
                            // Use user_detail if available, otherwise create basic object
                            if (e.user_detail) {
                                return e.user_detail;
                            } else {
                                return { id: e.user, name: 'Student ' + e.user };
                            }
                        });
                        setStudents(studentList);

                        // Initialize attendance status for all students
                        const initialAttendance = {};
                        studentList.forEach(student => {
                            initialAttendance[student.id] = 'present';
                        });
                        setAttendance(initialAttendance);
                    } else {
                        setStudents([]);
                        setAttendance({});
                    }
                } catch (error) {
                    console.error("Failed to fetch students", error);
                    setStudents([]);
                }
            };
            fetchStudents();
        }
    }, [selectedClassroom]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const promises = Object.entries(attendance).map(([userId, status]) => {
                return client.post('/classrooms/attendance', {
                    user: userId,
                    classroom: selectedClassroom,
                    date: date,
                    status: status
                });
            });
            await Promise.all(promises);
            alert("Attendance marked successfully!");
            navigate('/dashboard/teacher');
        } catch (error) {
            console.error("Failed to mark attendance", error);
            alert("Failed to mark attendance. Some records might already exist for this date.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 font-display">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-3xl font-bold dark:text-white">Mark Attendance</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-500">Select Classroom</label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                value={selectedClassroom}
                                onChange={(e) => setSelectedClassroom(e.target.value)}
                            >
                                {classrooms.length === 0 ? (
                                    <option value="">No classrooms available</option>
                                ) : (
                                    classrooms.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} {c.section ? `- ${c.section}` : ''}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-500">Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {students.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {students.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 font-medium dark:text-white">{student.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(student.id, 'present')}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${attendance[student.id] === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                                                >Present</button>
                                                <button
                                                    onClick={() => handleStatusChange(student.id, 'absent')}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${attendance[student.id] === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                                                >Absent</button>
                                                <button
                                                    onClick={() => handleStatusChange(student.id, 'late')}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${attendance[student.id] === 'late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                                                >Late</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_off</span>
                        <p className="text-slate-500">No students enrolled in this classroom.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;
