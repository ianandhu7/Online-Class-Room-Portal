import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClassroomJoin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanCode = code.trim();
        if (cleanCode.length < 5) {
            setError('Class code must be at least 5 characters.');
            return;
        }

        setLoading(true);
        try {
            const { joinClassroom } = await import('../../api/classrooms');
            await joinClassroom(cleanCode);
            navigate('/classrooms');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join classroom. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
            {/* Simple Header */}
            <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/classrooms')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h1 className="text-lg font-bold">Join class</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!code.trim() || loading}
                    className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-md shadow-primary/20 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? 'Joining...' : 'Join'}
                </button>
            </header>

            <main className="flex-1 flex justify-center p-4 sm:p-8">
                <div className="w-full max-w-[500px] space-y-6">

                    {/* User Account Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">You're signed in as</p>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-cover bg-slate-200" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLGPI-_049Do_3ZN4yo047kacdWFK7oVn60NF1zeI1gISN-Aqq6QdHmO2ka3amjamZEotyLWOdjE99H7RmrUB7yi7_KMLNnlEWaIPPrer_pwGRbnmU5Gg2pbW8bT_0VjmCFRYPXTnEArzWB1yrpxu7YvU1ppBDi7YcX6hJJV5Ax2U4kvbfttzaWkdK3DyGblh_c0ySCDOg5s2YGHCH9LKw-ae6lJHTkPsMfoCaTOLo3gzGWmQDDxuU-nlXqFXm_Ft2ZhDc-ZdUuTX'}")` }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Alex Morgan'}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email || 'alex.morgan@example.com'}</p>
                            </div>
                            <button className="text-primary text-sm font-semibold hover:underline">Switch account</button>
                        </div>
                    </div>

                    {/* Code Input */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-1">Class code</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ask your teacher for the class code, then enter it here.</p>

                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setError('');
                                }}
                                placeholder="Class code"
                                className={`w-full h-14 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary/20'} text-slate-900 dark:text-white placeholder-slate-400 text-lg transition-all focus:ring-4 outline-none`}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="pl-2">
                        <h3 className="font-bold text-sm mb-2 text-slate-900 dark:text-white">To sign in with a class code</h3>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-1">
                            <li>Use an authorized account</li>
                            <li>Use a class code with 5-7 letters or numbers, and no spaces or symbols</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClassroomJoin;
