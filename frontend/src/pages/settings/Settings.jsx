import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppContext } from '../../context/AppContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('classportal_settings_notifications');
        return saved ? JSON.parse(saved) : {
            email: true,
            push: true,
            updates: false,
        };
    });

    React.useEffect(() => {
        localStorage.setItem('classportal_settings_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                const { deleteAccount } = await import('../../api/auth');
                await deleteAccount();
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Failed to delete account', error);
                alert('Failed to delete account. Please try again.');
                setIsDeleting(false);
            }
        }
    };

    const { theme, toggleTheme, setTheme } = React.useContext(AppContext);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-3 shadow-sm transition-colors duration-300">

                <div className="max-w-[1440px] mx-auto flex items-center justify-between whitespace-nowrap">
                    <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <div className="size-8 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[32px]">school</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">ClassPortal</h2>
                    </Link>
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                        <Link to="/profile" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Profile</Link>
                        <Link to="/settings" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Settings</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLGPI-_049Do_3ZN4yo047kacdWFK7oVn60NF1zeI1gISN-Aqq6QdHmO2ka3amjamZEotyLWOdjE99H7RmrUB7yi7_KMLNnlEWaIPPrer_pwGRbnmU5Gg2pbW8bT_0VjmCFRYPXTnEArzWB1yrpxu7YvU1ppBDi7YcX6hJJV5Ax2U4kvbfttzaWkdK3DyGblh_c0ySCDOg5s2YGHCH9LKw-ae6lJHTkPsMfoCaTOLo3gzGWmQDDxuU-nlXqFXm_Ft2ZhDc-ZdUuTX'}")` }}></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[800px] mx-auto p-6 md:p-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your account preferences and application settings.</p>

                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">palette</span>
                            Appearance
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {['light', 'dark', 'system'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setTheme(mode)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 active:scale-95 ${theme === mode ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[24px] mb-2">
                                        {mode === 'light' ? 'light_mode' : mode === 'dark' ? 'dark_mode' : 'settings_brightness'}
                                    </span>
                                    <span className="capitalize font-medium text-sm">{mode}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notifications</span>
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Email Notifications</p>
                                    <p className="text-sm text-slate-500">Receive updates and course alerts via email.</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.email ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </label>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            <label className="flex items-center justify-between cursor-pointer group">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Push Notifications</p>
                                    <p className="text-sm text-slate-500">Receive alerts on your device.</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.push ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </label>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            <label className="flex items-center justify-between cursor-pointer group">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Product Updates</p>
                                    <p className="text-sm text-slate-500">Receive news about new features.</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.updates ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} onClick={() => setNotifications(prev => ({ ...prev, updates: !prev.updates }))}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications.updates ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/30 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                            <span className="material-symbols-outlined">warning</span>
                            Danger Zone
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Delete Account</p>
                                <p className="text-sm text-slate-500">Permanently delete your account and all data.</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors text-sm border border-red-200 dark:border-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
