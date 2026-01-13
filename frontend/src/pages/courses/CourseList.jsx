import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CourseList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);

    React.useEffect(() => {
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
    }, []);

    React.useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { getCourses } = await import('../../api/courses');
                const data = await getCourses();

                // Map backend data to UI format
                const formattedData = data.map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description || 'No description provided',
                    category: 'General', // Default category as schema doesn't have it yet
                    image: c.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
                    bgImage: c.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
                    status: 'Active',
                    enrollment: 0, // Placeholder
                    maxEnrollment: 50, // Placeholder
                    teacher: c.teacher ? {
                        name: c.teacher.name,
                        avatar: c.teacher.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.teacher.name)}`
                    } : null,
                    colors: {
                        bg: 'bg-blue-100 dark:bg-blue-900/40',
                        text: 'text-blue-700 dark:text-blue-300',
                        dot: 'bg-blue-500',
                        theme: 'text-primary'
                    }
                }));
                setCourses(formattedData);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading courses...</p>
                </div>
            </div>
        );
    }



    const getProgressColor = (category) => {
        switch (category) {
            case 'Mathematics': return 'bg-primary';
            case 'Science': return 'bg-purple-500';
            case 'Literature': return 'bg-amber-500';
            case 'History': return 'bg-orange-500';
            case 'Computer Science': return 'bg-blue-500';
            default: return 'bg-primary';
        }
    };


    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Mathematics': return 'functions';
            case 'Science': return 'science';
            case 'Literature': return 'menu_book';
            case 'History': return 'history_edu';
            case 'Computer Science': return 'code';
            default: return 'school';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
                    <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <div className="size-8 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[32px]">school</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">EduPortal</h2>
                    </Link>
                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                        <Link to="/courses" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Courses</Link>
                        <Link to="/students" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Students</Link>
                        <Link to="/teachers" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Teachers</Link>
                        <Link to="/settings" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Settings</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-sm font-bold text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">notifications</span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none dark:text-white">{user?.name || 'Alex Morgan'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{user?.role || 'Admin'}</p>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLGPI-_049Do_3ZN4yo047kacdWFK7oVn60NF1zeI1gISN-Aqq6QdHmO2ka3amjamZEotyLWOdjE99H7RmrUB7yi7_KMLNnlEWaIPPrer_pwGRbnmU5Gg2pbW8bT_0VjmCFRYPXTnEArzWB1yrpxu7YvU1ppBDi7YcX6hJJV5Ax2U4kvbfttzaWkdK3DyGblh_c0ySCDOg5s2YGHCH9LKw-ae6lJHTkPsMfoCaTOLo3gzGWmQDDxuU-nlXqFXm_Ft2ZhDc-ZdUuTX'}")` }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 lg:p-10 flex flex-col gap-6">
                {/* Page Heading & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">All Courses</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">Manage your curriculum, assign teachers, and track active enrollments across all departments.</p>
                    </div>
                    <button onClick={() => navigate('/courses/create')} className="flex shrink-0 h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-white shadow-md hover:bg-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="text-sm font-bold truncate">Add New Course</span>
                    </button>
                </div>

                {/* Search & Filters Toolbar */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 w-full lg:max-w-[400px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                            placeholder="Search by course name or ID..."
                            type="text"
                        />
                    </div>
                    {/* Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Teacher Filter */}
                        <div className="relative min-w-[160px] flex-1 lg:flex-none">
                            <select className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                                <option value="">All Teachers</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name || t.username}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                        {/* Chips/Quick Filters */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                            {['All Categories', 'Mathematics', 'Science', 'Literature'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category === 'All Categories' ? 'All' : category)}
                                    className={`h-9 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${(selectedCategory === 'All' && category === 'All Categories') || selectedCategory === category
                                        ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.filter(c => (selectedCategory === 'All' || c.category === selectedCategory) && c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                        <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                            <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${course.bgImage}")` }}></div>
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm ${course.colors.bg} ${course.colors.text}`}>
                                        <span className={`size-1.5 rounded-full ${course.colors.dot}`}></span> {course.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`material-symbols-outlined text-[16px] ${course.colors.theme}`}>{getCategoryIcon(course.category)}</span>
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${course.colors.theme}`}>{course.category}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors cursor-pointer">{course.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-3">
                                        {course.teacher ? (
                                            <>
                                                <div className="size-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-900" style={{ backgroundImage: `url("${course.teacher.avatar}")` }}></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Teacher</span>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{course.teacher.name}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="size-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-slate-900">
                                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-300">NA</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Teacher</span>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 italic text-gray-400">Not Assigned</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col gap-1 w-full mr-4">
                                            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span>Enrollment</span>
                                                <span>{course.enrollment}/{course.maxEnrollment}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full ${getProgressColor(course.category)} rounded-full`} style={{ width: `${(course.enrollment / course.maxEnrollment) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        <button className="flex items-center justify-center h-8 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:text-primary transition-colors" title="View Details">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="flex items-center justify-center h-8 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:text-primary transition-colors" title="Edit Course">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className={`flex items-center justify-center h-8 rounded transition-colors ${!course.teacher ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 dark:hover:text-primary'}`} title="Assign Teacher">
                                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                                        </button>
                                        <button className="flex items-center justify-center h-8 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Course Placeholder Card */}
                    <button onClick={() => navigate('/courses/create')} className="group flex flex-col items-center justify-center min-h-[400px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent hover:border-primary hover:bg-primary/5 transition-all duration-300">
                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                            <span className="material-symbols-outlined text-[32px]">add</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Course</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new class module</p>
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center mt-6">
                    <nav className="flex items-center gap-2">
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors" disabled>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-sm">1</button>
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">2</button>
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">3</button>
                        <span className="text-slate-400 px-1">...</span>
                        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </main>
        </div>
    );
};

export default CourseList;
