import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AssignmentList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const { getAssignments } = await import('../../api/assignments');
                const data = await getAssignments();

                // Map backend data to UI format
                const formattedData = data.map(a => {
                    const submission = a.submissions?.[0];
                    let status = 'Pending';
                    if (submission) {
                        status = submission.grade !== null ? 'Graded' : 'Submitted';
                    }

                    const dateObj = a.dueDate ? new Date(a.dueDate) : null;

                    return {
                        id: a.id,
                        title: a.title,
                        course: a.classroom?.course?.title || a.classroom?.name || 'General',
                        dueDate: dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
                        dueTime: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
                        status: status,
                        points: a.points,
                        description: a.description,
                        icon: a.title.toLowerCase().includes('quiz') ? 'quiz' : (a.title.toLowerCase().includes('lab') ? 'science' : 'assignment'),
                        color: status === 'Graded' ? 'text-green-600' : (status === 'Submitted' ? 'text-blue-600' : 'text-orange-600'),
                        bg: status === 'Graded' ? 'bg-green-100 dark:bg-green-900/30' : (status === 'Submitted' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30')
                    };
                });
                setAssignments(formattedData);
            } catch (error) {
                console.error("Failed to load assignments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'Submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'Graded': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'Late': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
                        <h2 className="text-xl font-bold leading-tight tracking-tight">ClassPortal</h2>
                    </Link>
                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                        <Link to="/classrooms" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Classrooms</Link>
                        <Link to="/assignments" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Assignments</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/assignments/create')} className="hidden sm:flex items-center gap-2 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Create
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLGPI-_049Do_3ZN4yo047kacdWFK7oVn60NF1zeI1gISN-Aqq6QdHmO2ka3amjamZEotyLWOdjE99H7RmrUB7yi7_KMLNnlEWaIPPrer_pwGRbnmU5Gg2pbW8bT_0VjmCFRYPXTnEArzWB1yrpxu7YvU1ppBDi7YcX6hJJV5Ax2U4kvbfttzaWkdK3DyGblh_c0ySCDOg5s2YGHCH9LKw-ae6lJHTkPsMfoCaTOLo3gzGWmQDDxuU-nlXqFXm_Ft2ZhDc-ZdUuTX'}")` }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
                {/* Page Heading & Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Assignments</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">Track your upcoming homwork, quizzes, and projects.</p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {['all', 'pending', 'submitted', 'graded'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assignment List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your assignments...</p>
                        </div>
                    ) : assignments.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 italic">assignment</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No assignments found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Check back later or contact your teacher.</p>
                        </div>
                    ) : assignments.filter(a => filter === 'all' || a.status.toLowerCase() === filter).map((assignment) => (
                        <div key={assignment.id} onClick={() => navigate(`/assignments/${assignment.id}`)} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all">

                            {/* Icon/Date Column */}
                            <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
                                <div className={`size-12 rounded-xl flex items-center justify-center ${assignment.bg} ${assignment.color}`}>
                                    <span className="material-symbols-outlined text-[24px]">{assignment.icon}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{assignment.dueDate}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.dueTime}</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{assignment.course}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusColor(assignment.status)}`}>{assignment.status === 'Go Graded' ? 'Graded' : assignment.status}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{assignment.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{assignment.description}</p>
                            </div>

                            {/* Action/Points */}
                            <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:pl-6 md:border-l border-slate-100 dark:border-slate-800">
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{assignment.points}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 block">pts</span>
                                </div>
                                <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    View Details
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AssignmentList;
