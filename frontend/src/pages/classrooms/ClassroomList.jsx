import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClassroomList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const { getClassrooms } = await import('../../api/classrooms');
                const data = await getClassrooms();
                // Map backend data to UI format if needed
                const formattedData = data.map(c => ({
                    ...c,
                    bgImage: c.bannerUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80', // Default image
                    teacher: c.teacher || { name: 'Unknown', avatar: null }
                }));
                setClassrooms(formattedData);
            } catch (error) {
                console.error("Failed to load classrooms", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClassrooms();
    }, []);

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading classrooms...</p>
                </div>
            </div>
        );
    }

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
                        <Link to="/courses" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Courses</Link>
                        <Link to="/classrooms" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Classrooms</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/classrooms/join')} className="hidden sm:flex items-center gap-2 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Join
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <div className="flex items-center gap-3">
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
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Your Classrooms</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">Access your enrolled classes, assignments, and discussions.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/classrooms/join')} className="flex shrink-0 h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">add_link</span>
                            <span className="text-sm font-bold truncate">Join Class</span>
                        </button>
                        {user?.role === 'teacher' && (
                            <button className="flex shrink-0 h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-white shadow-md hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span className="text-sm font-bold truncate">Create Class</span>
                            </button>
                        )}
                    </div>
                </div>

                {classrooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-slate-400">class_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No classrooms found</h3>
                        <p className="text-slate-500 max-w-md mb-6">You haven't joined or created any classrooms yet. Get started by joining a class with a code.</p>
                        <button onClick={() => navigate('/classrooms/join')} className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Join a Class
                        </button>
                    </div>
                ) : (
                    /* Classroom Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {classrooms.map((classroom) => (
                            <div key={classroom.id} onClick={() => navigate(`/classrooms/${classroom.id}`)} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-[280px]">
                                {/* Card Header with Image */}
                                <div className="relative h-28 bg-gray-200 dark:bg-slate-800">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${classroom.bgImage}")` }}></div>
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                                    <div className="absolute top-4 left-4 right-4 text-white">
                                        <h3 className="text-xl font-bold truncate underline-offset-2 group-hover:underline">{classroom.name}</h3>
                                        <p className="text-sm opacity-90 truncate">{classroom.section}</p>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <button className="p-1 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 flex-1 flex flex-col relative">
                                    {/* Floating Teacher Avatar */}
                                    <div className="absolute -top-8 right-4 size-16 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                                        <img src={classroom.teacher.photoUrl || classroom.teacher.avatar || 'https://ui-avatars.com/api/?name=Teacher'} alt={classroom.teacher.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="mt-6 flex-1">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{classroom.description || `Course Code: ${classroom.code}`}</p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all" title="Open Gradebook">
                                        <span className="material-symbols-outlined text-[20px]">trending_up</span>
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all" title="Open Folder">
                                        <span className="material-symbols-outlined text-[20px]">folder_open</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Classroom Placeholder for Teachers */}
                        {user?.role === 'teacher' && (
                            <button className="group flex flex-col items-center justify-center h-[280px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent hover:border-primary hover:bg-primary/5 transition-all duration-300">
                                <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors mb-3">
                                    <span className="material-symbols-outlined text-[28px]">add</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Class</h3>
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ClassroomList;
