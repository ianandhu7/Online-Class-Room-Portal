import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createClassroom } from '../../api/classrooms'; // We'll assume this exists or I'll add it
import { getCourses } from '../../api/courses';

const ClassroomCreate = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        section: '',
        courseId: '',
        schedule: '',
        room: ''
    });

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getCourses();
                // Filter courses where the user is the teacher
                // (Though backend should already filter or we can just show all if admin)
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses for selection", error);
            }
        };
        loadCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.courseId) {
            alert('Class Name and Course are required.');
            setLoading(false);
            return;
        }

        try {
            await createClassroom({
                name: formData.name,
                courseId: parseInt(formData.courseId)
            });
            navigate('/classrooms');
        } catch (error) {
            console.error("Failed to create classroom", error);
            alert("Failed to create classroom. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/classrooms')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">Create New Class</h1>
                </div>
            </header>

            <main className="flex-1 flex justify-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Course Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Select Course</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Each class must be linked to a course curriculum.</p>
                                <div className="relative">
                                    <select
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-4 pr-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                                        required
                                    >
                                        <option value="">Choose a course...</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                                </div>
                                <div className="text-right">
                                    <Link to="/courses/create" className="text-xs font-medium text-primary hover:underline">+ Create new course</Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Class Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Class Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Fall 2024 - Section A"
                                        className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Room / Location */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Room / Location <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input
                                        name="room"
                                        value={formData.room}
                                        onChange={handleChange}
                                        placeholder="e.g. Virtual or Room 302"
                                        className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Schedule Description */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Schedule / Timings <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    name="schedule"
                                    value={formData.schedule}
                                    onChange={handleChange}
                                    placeholder="e.g. Mon, Wed 10:00 AM - 11:30 AM"
                                    className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/classrooms')}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-600 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Creating...' : 'Create Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClassroomCreate;
