import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(credentials);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#0B1120] flex items-center justify-center p-4 font-display transition-colors duration-300">
            <div className="w-full max-w-[500px]">
                {/* Main Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-10 md:p-12 relative">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 bg-[#EFF4FF] dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-6 text-[#2D6CFF]">
                            <span className="material-icons-outlined text-4xl">school</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Log in to your Online Classroom Portal</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3">
                            <span className="material-icons-outlined text-red-600 dark:text-red-400 text-xl">error_outline</span>
                            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Role Select Toggle */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Sign in as</label>
                            <div className="bg-[#F8FAFC] dark:bg-slate-800 p-1.5 rounded-2xl flex w-full border border-slate-200 dark:border-slate-700">
                                <label className="flex-1 relative cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={credentials.role === 'student'}
                                        onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                                        className="peer sr-only"
                                    />
                                    <div className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-slate-500 dark:text-slate-400 transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-[#2D6CFF] peer-checked:shadow-sm">
                                        Student
                                    </div>
                                </label>
                                <label className="flex-1 relative cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="teacher"
                                        checked={credentials.role === 'teacher'}
                                        onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                                        className="peer sr-only"
                                    />
                                    <div className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-slate-500 dark:text-slate-400 transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-[#2D6CFF] peer-checked:shadow-sm">
                                        Teacher
                                    </div>
                                </label>
                                <label className="flex-1 relative cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={credentials.role === 'admin'}
                                        onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                                        className="peer sr-only"
                                    />
                                    <div className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-slate-500 dark:text-slate-400 transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-[#2D6CFF] peer-checked:shadow-sm">
                                        Admin
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email or Username</label>
                            <div className="relative">
                                <input
                                    className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                    placeholder="Enter your email"
                                    type="text"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                    placeholder="Enter your password"
                                    type={showPassword ? "text" : "password"}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                />
                                <button
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-[#2D6CFF] cursor-pointer transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-icons-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm font-bold text-[#2D6CFF] hover:underline underline-offset-4">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full h-[60px] bg-[#2D6CFF] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-[#2D6CFF]/25 flex items-center justify-center gap-2 group transition-all duration-200 active:scale-[0.98] cursor-pointer text-base"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Don't have an account?
                            <Link to="/register" className="text-[#2D6CFF] font-bold hover:underline ml-1 cursor-pointer">Register</Link>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                        © 2025 EduPortal Online Classroom
                    </p>
                </div>
            </div>

            {/* Theme Toggle */}
            <div className="fixed bottom-6 right-6">
                <button
                    className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-500 hover:text-[#2D6CFF] dark:text-slate-400 dark:hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                    onClick={() => document.documentElement.classList.toggle('dark')}
                >
                    <span className="material-icons-outlined block dark:hidden">dark_mode</span>
                    <span className="material-icons-outlined hidden dark:block">light_mode</span>
                </button>
            </div>
        </div>
    );
};

export default Login;
