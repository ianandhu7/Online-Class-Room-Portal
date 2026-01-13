import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TeacherList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const teachers = [
        { id: 1, name: 'Sarah Jenkins', department: 'Mathematics', email: 'sarah.j@edu.com', courses: 4, students: 120, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 2, name: 'Dr. Alan Grant', department: 'Physics', email: 'alan.grant@edu.com', courses: 3, students: 85, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { id: 3, name: 'Emily Rivera', department: 'Literature', email: 'emily.r@edu.com', courses: 5, students: 140, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        { id: 4, name: 'David Lee', department: 'Computer Science', email: 'david.lee@edu.com', courses: 2, students: 60, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        { id: 5, name: 'Robert Chen', department: 'History', email: 'robert.c@edu.com', courses: 3, students: 95, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
        { id: 6, name: 'Amanda Wilson', department: 'Art', email: 'amanda.w@edu.com', courses: 4, students: 110, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    ];

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
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                        <Link to="/courses" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Courses</Link>
                        <Link to="/students" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Students</Link>
                        <Link to="/teachers" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Teachers</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLGPI-_049Do_3ZN4yo047kacdWFK7oVn60NF1zeI1gISN-Aqq6QdHmO2ka3amjamZEotyLWOdjE99H7RmrUB7yi7_KMLNnlEWaIPPrer_pwGRbnmU5Gg2pbW8bT_0VjmCFRYPXTnEArzWB1yrpxu7YvU1ppBDi7YcX6hJJV5Ax2U4kvbfttzaWkdK3DyGblh_c0ySCDOg5s2YGHCH9LKw-ae6lJHTkPsMfoCaTOLo3gzGWmQDDxuU-nlXqFXm_Ft2ZhDc-ZdUuTX'}")` }}></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Teachers Directory</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">Meet the faculty members of our institution.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.department.toLowerCase().includes(searchQuery.toLowerCase())).map((teacher) => (
                        <div key={teacher.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 flex flex-col items-center text-center">
                            <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm relative">
                                <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{teacher.name}</h3>
                            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">{teacher.department}</span>

                            <div className="w-full flex justify-center gap-6 py-4 border-t border-b border-slate-100 dark:border-slate-800 mb-4">
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white text-lg">{teacher.courses}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Courses</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white text-lg">{teacher.students}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Students</span>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full">
                                <button className="flex-1 h-10 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm transition-colors">Profile</button>
                                <button className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TeacherList;
