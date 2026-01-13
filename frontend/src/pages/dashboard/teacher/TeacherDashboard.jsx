import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getTeacherStats, getTeacherCourses, getClassrooms, postAnnouncement } from '../../../api/teacher';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total_courses: 0,
        active_classrooms: 0,
        pending_submissions: 0,
        total_students: 124,
        assignments_given: 12
    });
    const [courses, setCourses] = useState([]);
    const [activities, setActivities] = useState([
        { id: 1, student: 'John Doe', action: 'submitted', target: 'Algebra Homework', time: '2 mins ago' },
        { id: 2, student: 'Sarah Smith', action: 'joined', target: 'Mathematics 101', time: '15 mins ago' },
        { id: 3, student: 'Alex Johnson', action: 'asked a question', target: 'Physics Lab', time: '1 hour ago' },
    ]);
    const [loading, setLoading] = useState(true);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', classroom: '' });
    const [announcementPosting, setAnnouncementPosting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, coursesData, classroomsData] = await Promise.all([
                    getTeacherStats(),
                    getTeacherCourses(),
                    getClassrooms()
                ]);
                setStats(statsData);
                setCourses(coursesData);
                setClassrooms(classroomsData);
                if (classroomsData.length > 0) {
                    setAnnouncementForm(prev => ({ ...prev, classroom: classroomsData[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch teacher dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        setAnnouncementPosting(true);
        try {
            await postAnnouncement(announcementForm);
            setIsAnnouncementModalOpen(false);
            setAnnouncementForm({ ...announcementForm, title: '', content: '' });
            alert("Announcement posted successfully!");
        } catch (error) {
            console.error("Failed to post announcement", error);
            alert("Failed to post announcement.");
        } finally {
            setAnnouncementPosting(false);
        }
    };

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
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-gray-100 overflow-hidden">
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <aside className="w-[280px] shrink-0 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-slate-800 flex flex-col justify-between p-4 h-full overflow-y-auto hidden md:flex">
                    <div className="flex flex-col gap-6">
                        {/* User Profile */}
                        <div className="flex gap-3 items-center px-2">
                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg overflow-hidden shrink-0">
                                {user?.photo_url ? <img src={user.photo_url} alt="" className="size-full object-cover" /> : (user?.name?.charAt(0) || 'T')}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white truncate">{user?.name || 'Professor'}</h1>
                                <p className="text-slate-500 dark:text-gray-400 text-xs font-normal truncate">Academic Staff</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            <Link to="/dashboard/teacher" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-colors">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link to="/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">menu_book</span>
                                <span className="text-sm font-medium">My Courses</span>
                            </Link>
                            <Link to="/assignments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">assignment</span>
                                <span className="text-sm font-medium">Assignments</span>
                            </Link>
                            <Link to="/classrooms" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">groups</span>
                                <span className="text-sm font-medium">Classrooms</span>
                            </Link>
                            <Link to="/attendance" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">how_to_reg</span>
                                <span className="text-sm font-medium">Attendance</span>
                            </Link>
                            <Link to="/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">forum</span>
                                <span className="text-sm font-medium">Messages</span>
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        <Link to="/assignments/create" className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="truncate">Create New</span>
                        </Link>
                        <button
                            onClick={() => setIsAnnouncementModalOpen(true)}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-amber-500 hover:bg-amber-600 transition-colors text-white text-sm font-bold shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">campaign</span>
                            <span className="truncate">Post Announcement</span>
                        </button>
                        <div className="flex flex-col gap-1 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="text-sm font-medium">Log Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
                    {/* Top Header */}
                    <header className="h-16 px-8 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-4 w-1/3">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Search courses, students, or assignments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">help</span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-6xl mx-auto flex flex-col gap-8">
                            {/* Welcome Hero */}
                            <div className="w-full rounded-xl overflow-hidden bg-gradient-to-r from-primary to-blue-600 shadow-md relative min-h-[180px] flex items-center">
                                <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=2000&h=400&fit=crop")' }}></div>
                                <div className="relative z-10 p-8 flex flex-col justify-center h-full">
                                    <h1 className="text-white text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Professor'}</h1>
                                    <p className="text-blue-100 text-lg">You have {stats.pending_submissions} assignments pending review today.</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[160px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">library_books</span>
                                        </div>
                                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">Academic</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Courses</h3>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_courses}</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[160px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                                            <span className="material-symbols-outlined">school</span>
                                        </div>
                                        <span className="text-gray-400 text-xs font-medium px-2 py-1">Active</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Classrooms</h3>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active_classrooms}</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-l-4 border-l-primary border-y border-r border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[160px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-orange-600 dark:text-orange-400">
                                            <span className="material-symbols-outlined">pending_actions</span>
                                        </div>
                                        <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-full">Needs Review</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Submissions</h3>
                                        <p className="text-3xl font-bold text-primary">{stats.pending_submissions}</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[160px] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
                                            <span className="material-symbols-outlined">group</span>
                                        </div>
                                        <span className="text-gray-400 text-xs font-medium px-2 py-1">Students</span>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Enrolled</h3>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_students}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <div className="flex items-center justify-between px-1">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Courses</h2>
                                        <Link to="/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                                            View All
                                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {courses.map((course) => (
                                            <div key={course.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group">
                                                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'})` }}></div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{course.description || 'No description provided.'}</p>
                                                    <button onClick={() => navigate(`/courses/${course.id}`)} className="w-full py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
                                                        Manage Course
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {courses.length === 0 && (
                                            <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">library_books</span>
                                                <p className="text-slate-500">No courses found yet.</p>
                                                <Link to="/courses/create" className="text-primary font-bold mt-2 inline-block">Create your first course</Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mock Performance Chart */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold">Assignment Completion Rate</h3>
                                            <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-xs font-bold py-1 px-3">
                                                <option>Last 7 Days</option>
                                                <option>Last 30 Days</option>
                                            </select>
                                        </div>
                                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                                            {[65, 40, 85, 50, 90, 75, 95].map((val, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div className="w-full bg-primary/10 dark:bg-primary/5 rounded-t-lg relative flex items-end justify-center" style={{ height: '100%' }}>
                                                        <div className="w-[70%] bg-primary rounded-t-lg transition-all duration-500 group-hover:bg-blue-400" style={{ height: `${val}%` }}></div>
                                                        <span className="absolute -top-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1.5 py-0.5 rounded">{val}%</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Column: Recent Activities */}
                                <div className="flex flex-col gap-6">
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
                                        <div className="flex flex-col gap-5">
                                            {activities.map((act) => (
                                                <div key={act.id} className="flex gap-3">
                                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-lg">person</span>
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-xs text-slate-700 dark:text-gray-300">
                                                            <span className="font-bold">{act.student}</span> {act.action} <span className="font-medium text-primary">{act.target}</span>
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 mt-0.5">{act.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-6 py-2 text-primary font-bold text-xs hover:bg-primary/5 rounded-lg transition-colors border border-primary/20">
                                            View Activity Log
                                        </button>
                                    </div>

                                    {/* Attendance Summary */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Average Attendance</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="relative size-20">
                                                <svg className="size-full" viewBox="0 0 36 36">
                                                    <path className="text-slate-100 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <path className="text-primary" strokeWidth="3" strokeDasharray="88, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">88%</div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">trending_up</span>
                                                    +4% from last week
                                                </span>
                                                <span className="text-[11px] text-slate-500">Good standing across all 12 classes.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">New Announcement</h3>
                            <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handlePostAnnouncement} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Classroom</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                    value={announcementForm.classroom}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, classroom: e.target.value })}
                                    required
                                >
                                    {classrooms.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter title..."
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Content</label>
                                <textarea
                                    rows="4"
                                    placeholder="Type your message here..."
                                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none dark:text-white"
                                    value={announcementForm.content}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={announcementPosting}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl mt-4 hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {announcementPosting ? "Posting..." : "Broadcast Announcement"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
