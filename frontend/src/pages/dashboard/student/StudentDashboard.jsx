import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getStudentStats, getMyCourses, getUpcomingAssignments, getAnnouncements } from '../../../api/student';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        enrolled_courses: 0,
        pending_assignments: 0,
        completed_courses: 0,
        attendance: 100,
        gpa: 3.8
    });
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [examResults, setExamResults] = useState([
        { id: 1, subject: 'Mathematics', score: 'A', percentage: 92, date: '2025-11-15' },
        { id: 2, subject: 'Physics', score: 'B+', percentage: 88, date: '2025-11-18' },
    ]);
    const [loading, setLoading] = useState(true);

    const quickCourses = [
        { name: 'My Grades', icon: 'grade', color: 'blue', hoverBorder: 'hover:border-blue-500' },
        { name: 'Schedule', icon: 'calendar_month', color: 'purple', hoverBorder: 'hover:border-purple-500' },
        { name: 'Resources', icon: 'folder', color: 'orange', hoverBorder: 'hover:border-orange-500' },
        { name: 'Support', icon: 'help_center', color: 'emerald', hoverBorder: 'hover:border-emerald-500' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, coursesData, assignmentsData, announcementsData] = await Promise.all([
                    getStudentStats(),
                    getMyCourses(),
                    getUpcomingAssignments(),
                    getAnnouncements()
                ]);
                setStats(statsData || stats);
                setCourses(coursesData || []);
                setAssignments(assignmentsData || []);
                setAnnouncements(announcementsData || []);
            } catch (error) {
                console.error("Failed to fetch student dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium font-display">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
                    <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">EduPortal</h1>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-4 py-6">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link to="/dashboard/student" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                                    <span className="text-sm font-medium">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">menu_book</span>
                                    <span className="text-sm font-medium">Enrolled Courses</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/assignments" className="group flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined">assignment</span>
                                        <span className="text-sm font-medium">Assignments</span>
                                    </div>
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">3</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/grades" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">bar_chart</span>
                                    <span className="text-sm font-medium">Grades</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/calendar" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    <span className="text-sm font-medium">Calendar</span>
                                </Link>
                            </li>
                        </ul>

                        <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>

                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link to="/settings" className="group flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">settings</span>
                                    <span className="text-sm font-medium">Settings</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">logout</span>
                                    <span className="text-sm font-medium">Log Out</span>
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Next Exam Card */}
                    <div className="p-4">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-blue-400 p-4 text-white">
                            <div className="relative z-10">
                                <p className="mb-1 text-xs font-medium opacity-90">Next Exam</p>
                                <p className="text-sm font-bold">Physics Mid-term</p>
                                <p className="mt-2 text-xs opacity-75">In 2 days</p>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-6xl text-white opacity-20">science</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Top Navbar */}
                    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-4">
                            <button className="text-slate-500 hover:text-slate-700 md:hidden dark:text-slate-400">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            {/* Search */}
                            <div className="hidden max-w-md items-center rounded-lg bg-slate-100 px-3 py-2 md:flex dark:bg-slate-800">
                                <span className="material-symbols-outlined text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ml-2 w-full border-none bg-transparent p-0 text-sm text-slate-900 placeholder-slate-400 focus:ring-0 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined">mail</span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Johnson'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Student ID: 492021</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="mx-auto max-w-6xl space-y-8">
                            {/* Greeting Section */}
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Good Morning, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
                                    <p className="text-slate-500 dark:text-slate-400">You have {stats.pending_assignments} assignments pending.</p>
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                <div className="flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <span className="material-symbols-outlined text-xl">pending_actions</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending Tasks</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending_assignments}</p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <span className="material-symbols-outlined text-xl">library_books</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Courses</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.enrolled_courses}</p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <span className="material-symbols-outlined text-xl">fact_check</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Completed</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed_courses}</p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-indigo-500">
                                        <span className="material-symbols-outlined text-xl">event_available</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Attendance</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.attendance}%</p>
                                </div>
                                <div className="flex flex-col gap-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-purple-500">
                                        <span className="material-symbols-outlined text-xl">grade</span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">GPA</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.gpa}</p>
                                </div>
                            </div>

                            {/* Join Live Class Hero */}
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                                        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            LIVE NOW
                                        </div>
                                        <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Mathematics 101 - Algebra Basics</h3>
                                        <p className="mb-6 text-slate-500 dark:text-slate-400">Professor Smith is starting the session on Linear Equations. Don't be late!</p>
                                        <button className="flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95">
                                            <span className="material-symbols-outlined">videocam</span>
                                            Join Classroom
                                        </button>
                                    </div>
                                    <div className="h-48 w-full bg-slate-100 md:h-auto md:w-1/3 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop")' }}></div>
                                </div>
                            </div>

                            {/* Two Column Section */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Left Column: Assignments */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Assignments</h3>
                                        <Link to="/assignments" className="text-sm font-medium text-primary hover:underline">View All</Link>
                                    </div>

                                    {assignments.slice(0, 4).map((assignment) => (
                                        <div key={assignment.id} className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary`}>
                                                    <span className="material-symbols-outlined">assignment</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{assignment.title}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className={`rounded bg-primary/5 px-2 py-0.5 font-medium text-primary`}>{assignment.classroom?.course?.title || 'Course'}</span>
                                                        <span>•</span>
                                                        <span>Due {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'TBD'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => navigate(`/assignments/${assignment.id}`)} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-primary dark:border-slate-700 dark:hover:bg-slate-800 transition-all font-bold text-xs">
                                                START
                                            </button>
                                        </div>
                                    ))}
                                    {assignments.length === 0 && (
                                        <div className="py-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                            <p className="text-gray-400 text-sm italic font-medium">No assignments yet. Great job!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Schedule & Quick Access */}
                                <div className="space-y-6">
                                    {/* Schedule Widget */}
                                    <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Active Courses</h3>
                                        <div className="flex flex-col gap-4">
                                            {courses.slice(0, 3).map((course) => (
                                                <div key={course.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                                                    <div className="h-10 w-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop'})` }}></div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{course.title}</span>
                                                        <span className="text-[10px] text-gray-500">{course.teacher_name || 'Instructor'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {courses.length === 0 && (
                                                <div className="py-2 text-center text-xs text-gray-400 italic">Not enrolled in any courses</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Announcements Section */}
                                    <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Announcements</h3>
                                        <div className="flex flex-col gap-3">
                                            {announcements.map((item) => (
                                                <div key={item.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{item.title}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{item.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Exam Results Summary */}
                                    <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Exam Results</h3>
                                        <div className="flex flex-col gap-3">
                                            {examResults.map((result) => (
                                                <div key={result.id} className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{result.subject}</span>
                                                        <span className="text-[10px] text-slate-400">{result.date}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-black text-primary">{result.score}</span>
                                                        <span className="text-[10px] block text-slate-400">{result.percentage}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick Access Courses */}
                                    <div>
                                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Quick Access</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {quickCourses.map((course, index) => (
                                                <Link key={index} to="/courses" className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white p-4 text-center transition-colors ${course.hoverBorder} dark:border-slate-800 dark:bg-slate-900`}>
                                                    <div className={`h-10 w-10 rounded-full bg-${course.color}-100 flex items-center justify-center text-${course.color}-600`}>
                                                        <span className="material-symbols-outlined">{course.icon}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
