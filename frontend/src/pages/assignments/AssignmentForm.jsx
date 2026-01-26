import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AssignmentForm = ({ isEdit = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classroomId: '',
        dueDate: '',
        points: 100
    });
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadClassrooms = async () => {
            try {
                const { getClassrooms } = await import('../../api/classrooms');
                const data = await getClassrooms();
                setClassrooms(data);
            } catch (error) {
                console.error("Failed to load classrooms", error);
            }
        };
        loadClassrooms();

        if (isEdit && id) {
            const fetchDetail = async () => {
                try {
                    const { getAssignment } = await import('../../api/assignments');
                    const data = await getAssignment(id);
                    setFormData({
                        title: data.title,
                        description: data.description || '',
                        classroomId: data.classroomId || '',
                        dueDate: data.dueDate ? data.dueDate.substring(0, 16) : '',
                        points: data.points
                    });
                } catch (error) {
                    console.error("Failed to fetch assignment details", error);
                }
            };
            fetchDetail();
        }
    }, [isEdit, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.classroomId) {
            alert("Title and Classroom are required.");
            return;
        }

        setLoading(true);
        try {
            const { createAssignment } = await import('../../api/assignments');
            await createAssignment(formData);
            navigate('/assignments');
        } catch (error) {
            console.error("Failed to save assignment", error);
            alert("Error saving assignment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/assignments')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h1 className="text-lg font-bold">{isEdit ? 'Edit Assignment' : 'Create Assignment'}</h1>
                </div>
                <div className="flex gap-3">
                    <button className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Save Draft
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-md shadow-primary/20 hover:bg-blue-600 disabled:opacity-50 transition-all">
                        {loading ? 'Processing...' : (isEdit ? 'Update' : 'Assign')}
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-10">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Assignment title"
                            className="w-full text-2xl font-bold border-none border-b-2 border-slate-200 dark:border-slate-700 bg-transparent px-0 py-2 focus:ring-0 focus:border-primary placeholder-slate-300 dark:placeholder-slate-600 transition-colors"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">Instructions (Optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Add instructions..."
                            className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 resize-y"
                        ></textarea>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">Attach Materials</label>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-primary font-medium text-sm transition-colors">
                                <span className="material-symbols-outlined text-[20px]">upload_file</span> Upload
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-primary font-medium text-sm transition-colors">
                                <span className="material-symbols-outlined text-[20px]">link</span> Link
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-primary font-medium text-sm transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add_to_drive</span> Drive
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

                    {/* Meta Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">For</label>
                            <div className="relative">
                                <select
                                    name="classroomId"
                                    value={formData.classroomId}
                                    onChange={handleChange}
                                    className="appearance-none w-full h-11 pl-4 pr-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-slate-900 dark:text-white"
                                    required
                                >
                                    <option value="" disabled>Select classroom</option>
                                    {classrooms.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.course?.title})</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">Points</label>
                            <input
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">Due Date</label>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">Topic</label>
                            <div className="relative">
                                <select className="appearance-none w-full h-11 pl-4 pr-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                    <option value="">No topic</option>
                                    <option value="week1">Week 1</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssignmentForm;
