import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || 'Alex',
        lastName: user?.name?.split(' ').slice(1).join(' ') || 'Johnson',
        email: user?.email || 'alex.johnson@university.edu',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [activeSection, setActiveSection] = useState('personal');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Handle save logic here
        console.log('Saving profile:', formData);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {/* Top Navbar */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 shadow-sm">
                    <Link to="/" className="flex items-center gap-4">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Classroom Portal</h2>
                    </Link>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="hidden md:flex items-center gap-9">
                            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
                            <Link to="/assignments" className="text-sm font-medium hover:text-primary transition-colors">Assignments</Link>
                            <Link to="/profile" className="text-primary text-sm font-bold">Profile</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button className="relative rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">notifications</span>
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer border-2 border-primary/20">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 py-8 md:px-40 md:py-10">
                    <div className="mx-auto flex max-w-[960px] flex-col gap-6">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap gap-2 text-sm">
                            <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">Dashboard</Link>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">/</span>
                            <span className="text-slate-900 dark:text-white font-semibold">Profile Settings</span>
                        </div>

                        {/* Page Heading */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Account Settings</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Manage your personal information, privacy, and security preferences.</p>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                            {/* Left Column: Profile Card */}
                            <div className="lg:col-span-1 flex flex-col gap-6">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="relative group cursor-pointer mb-4">
                                        <div className="size-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold border-4 border-background-light dark:border-background-dark shadow-md transition-transform group-hover:scale-105">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white">photo_camera</span>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Johnson'}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 capitalize">{user?.role || 'Student'}</p>
                                    <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-lg">upload</span>
                                        Change Photo
                                    </button>
                                    <button className="mt-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors">Remove Photo</button>
                                </div>

                                {/* Navigation/Quick Links Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm hidden lg:block">
                                    <nav className="flex flex-col">
                                        <button
                                            onClick={() => setActiveSection('personal')}
                                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors ${activeSection === 'personal' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <span className="material-symbols-outlined">person</span>
                                            Personal Details
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('security')}
                                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors ${activeSection === 'security' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <span className="material-symbols-outlined">lock</span>
                                            Login & Security
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('notifications')}
                                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors ${activeSection === 'notifications' ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <span className="material-symbols-outlined">notifications</span>
                                            Notifications
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Right Column: Edit Forms */}
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                {/* Personal Information Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold">Personal Information</h3>
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">edit_note</span>
                                    </div>
                                    <form className="flex flex-col gap-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="firstName">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your first name"
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="lastName">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your last name"
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="email">Email Address</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-xl">mail</span>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="name@example.com"
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="bio">Bio</label>
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Tell us a little about yourself..."
                                                rows="3"
                                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                            ></textarea>
                                        </div>
                                    </form>
                                </div>

                                {/* Security / Password Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold">Password & Security</h3>
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">lock_reset</span>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="currentPassword">Current Password</label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                placeholder="••••••••••••"
                                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="newPassword">New Password</label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="New password"
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400" htmlFor="confirmPassword">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm new password"
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <Link to="/forgot-password" className="text-primary hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors">
                                                Forgot password?
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="flex items-center justify-end gap-4 mt-2">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">save</span>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
