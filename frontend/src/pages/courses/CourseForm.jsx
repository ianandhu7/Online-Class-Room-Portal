import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CourseForm = ({ isEdit = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        teacherId: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const { getTeachers } = await import('../../api/users');
                const data = await getTeachers();
                setTeachers(data);
            } catch (error) {
                console.error("Failed to fetch teachers", error);
            }
        };
        fetchTeachers();

        if (isEdit && id) {
            // Simulate fetching course data
            setLoading(true);
            setTimeout(() => {
                setFormData({
                    title: 'Advanced Calculus II',
                    category: 'mathematics',
                    description: 'Deep dive into differential equations and multivariable calculus concepts.\n\nPrerequisites:\n- Calculus I\n- Linear Algebra',
                    teacherId: 't1',
                    image: null
                });
                setLoading(false);
            }, 500);
        }
    }, [isEdit, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        // Handle file upload roughly
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { createCourse, updateCourse } = await import('../../api/courses');

            // Basic validation
            if (!formData.title) {
                alert('Title is required');
                setLoading(false);
                return;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                // In a real app, upload image first. Here we use a random one or the existing one.
                thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
            };

            if (isEdit && id) {
                await updateCourse(id, payload);
            } else {
                await createCourse(payload);
            }
            navigate('/courses');
        } catch (error) {
            console.error("Failed to save course", error);
            alert("Failed to save course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white overflow-x-hidden">
            {/* TopNavBar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2233] border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 text-primary group">
                            <span className="material-symbols-outlined text-3xl group-hover:scale-105 transition-transform">school</span>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Classroom Portal</h2>
                        </Link>
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                            <Link to="/courses" className="text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Courses</Link>
                            <Link to="/students" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Students</Link>
                            <Link to="/settings" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Settings</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                            <input className="bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 w-full ml-2" placeholder="Search..." type="text" />
                        </div>
                        {/* User Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeDlMI2SmfKPdbKfluimM-jIdJHABcqF43R09PQEdGZml9jwQpcYZCsKtY0t7XzuPTo8S5-4qMt9cduFWL8UlDhxkhp_SvoyFbYjZYU3x5Elofhlu95NM91xO3rzku2HxKtsaFP7NvlhRH4ztA8bEbJJicnuyBmrqClfHhNgJTdcDDdHbjDjZs8yT2OSE1myprlw0wGBUAB7EaMXgtPjuRGt8OimTwoqtbGKJNTSAqfXIaTZyb28jr4inbwaQ_Tm62fZht59B_PJBk'}")` }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Home</Link>
                        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
                        <Link to="/courses" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Courses</Link>
                        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">{isEdit ? 'Edit Course' : 'Create Course'}</span>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">{isEdit ? 'Update details used for this course in the catalog.' : 'Fill in the details below to add a new course to the catalog.'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/courses')} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[18px]">{loading ? 'hourglass_empty' : 'save'}</span>
                                {loading ? 'Saving...' : 'Save Course'}
                            </button>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-[#1a2233] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                            {/* Section: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Name */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Course Name</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-primary focus:ring-1 placeholder:text-slate-400 transition-all"
                                        placeholder="e.g., Introduction to Advanced Biology"
                                        type="text"
                                        required
                                    />
                                </div>
                                {/* Category - Only visual for now as backend doesn't support it */}
                                <div className="space-y-2 relative">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Category</label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="appearance-none w-full h-12 pl-4 pr-10 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-primary focus:ring-1 transition-all cursor-pointer"
                                        >
                                            <option value="">Select a category</option>
                                            <option value="science">Science</option>
                                            <option value="mathematics">Mathematics</option>
                                            <option value="arts">Arts & Humanities</option>
                                            <option value="computer_science">Computer Science</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">arrow_drop_down</span>
                                    </div>
                                </div>
                                {/* Teacher */}
                                <div className="space-y-2 relative">
                                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Assigned Teacher</label>
                                    <div className="relative">
                                        <select
                                            name="teacherId"
                                            value={formData.teacherId}
                                            onChange={handleInputChange}
                                            className="appearance-none w-full h-12 pl-11 pr-10 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-primary focus:ring-1 transition-all cursor-pointer"
                                        >
                                            <option value="">Select a teacher</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name || teacher.username || teacher.email}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">person_search</span>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">arrow_drop_down</span>
                                    </div>
                                    {teachers.length === 0 && (
                                        <p className="text-xs text-amber-500 mt-1">No teachers found. Please register teacher accounts first.</p>
                                    )}
                                </div>
                            </div>

                            {/* Section: Details */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Course Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[160px] p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-primary focus:ring-1 placeholder:text-slate-400 resize-y transition-all"
                                    placeholder="Describe the curriculum, learning objectives, and prerequisites..."
                                ></textarea>
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Markdown supported</span>
                                    <span>{formData.description.length}/500 characters</span>
                                </div>
                            </div>

                            {/* Section: Media */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">Course Thumbnail</label>
                                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-6 py-10 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer group relative">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">add_photo_alternate</span>
                                        <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                                            <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-blue-500" htmlFor="file-upload">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-2"></div>

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <button onClick={() => navigate('/courses')} className="px-6 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" type="button">
                                    Cancel
                                </button>
                                <button disabled={loading} className="px-8 py-3 rounded-lg text-sm font-medium text-white bg-primary shadow-lg shadow-primary/30 hover:bg-blue-600 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50" type="submit">
                                    {loading ? 'Saving...' : (isEdit ? 'Update Course' : 'Publish Course')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseForm;
