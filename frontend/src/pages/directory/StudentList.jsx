import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StudentList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const students = [
        { id: 1, name: 'Alex Morgan', grade: 'Grade 12', email: 'alex.m@edu.com', major: 'Science', gpa: '3.8', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
        { id: 2, name: 'Jessica Lee', grade: 'Grade 11', email: 'jess.lee@edu.com', major: 'Arts', gpa: '3.9', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 3, name: 'Michael Chen', grade: 'Grade 12', email: 'm.chen@edu.com', major: 'Math', gpa: '3.5', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { id: 4, name: 'Sarah Wilson', grade: 'Grade 10', email: 's.wilson@edu.com', major: 'History', gpa: '3.7', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        { id: 5, name: 'David Kim', grade: 'Grade 11', email: 'd.kim@edu.com', major: 'Physics', gpa: '4.0', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        { id: 6, name: 'Emily Davis', grade: 'Grade 9', email: 'e.davis@edu.com', major: 'General', gpa: '3.6', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
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
                        <Link to="/students" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Students</Link>
                        <Link to="/teachers" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Teachers</Link>
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
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Student Directory</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">Browse profiles of enrolled students across all years.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.grade.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                        <div key={student.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 flex items-center gap-4">
                            <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{student.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">{student.grade} • {student.major}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">GPA {student.gpa}</span>
                                </div>
                            </div>
                            <button className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default StudentList;
