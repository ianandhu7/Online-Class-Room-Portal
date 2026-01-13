import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        termsAccepted: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.termsAccepted) {
            setError('Please accept the Terms of Service and Privacy Policy');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, termsAccepted, ...userData } = formData;
            const result = await register(userData);

            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
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
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-20 h-20 bg-[#EFF4FF] dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-6 text-[#2D6CFF]">
                            <span className="material-icons-outlined text-4xl">person_add</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Join our Online Classroom Portal</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3">
                            <span className="material-icons-outlined text-red-600 dark:text-red-400 text-xl">error_outline</span>
                            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Role Toggle */}
                        <div className="bg-[#F8FAFC] dark:bg-slate-800 p-1.5 rounded-2xl flex w-full border border-slate-200 dark:border-slate-700">
                            <label className="flex-1 relative cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                                    checked={formData.role === 'teacher'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                                    checked={formData.role === 'admin'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="peer sr-only"
                                />
                                <div className="py-2.5 px-3 rounded-xl text-xs font-bold text-center text-slate-500 dark:text-slate-400 transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-[#2D6CFF] peer-checked:shadow-sm">
                                    Admin
                                </div>
                            </label>
                        </div>

                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                placeholder="Enter your full name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                placeholder="Enter your email address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Passwords Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-[#2D6CFF]/10 focus:border-[#2D6CFF] outline-none transition-all"
                                        placeholder="••••••••"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-[#2D6CFF] cursor-pointer transition-colors"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-icons-outlined text-xl">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-2 pl-1">
                            <div className="flex h-6 items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                    className="h-5 w-5 rounded-lg border-slate-300 text-[#2D6CFF] focus:ring-[#2D6CFF] bg-white dark:bg-slate-800 dark:border-slate-600 cursor-pointer transition-all"
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="terms" className="font-medium text-slate-600 dark:text-slate-400">
                                    I agree to the <a href="#" className="text-[#2D6CFF] hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-[#2D6CFF] hover:underline font-bold">Privacy Policy</a>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full h-[60px] bg-[#2D6CFF] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-[#2D6CFF]/25 flex items-center justify-center gap-2 group transition-all duration-200 active:scale-[0.98] cursor-pointer text-base"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Already have an account?
                            <Link to="/login" className="text-[#2D6CFF] font-bold hover:underline ml-1">Sign in here</Link>
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

export default Register;
