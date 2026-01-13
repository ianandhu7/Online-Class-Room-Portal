import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await forgotPassword(email);
            setMessage(response.message || 'Password reset link has been sent to your email.');
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setSubmitted(false);
        handleSubmit({ preventDefault: () => { } });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden antialiased flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Classroom Portal</h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Home</Link>
                            <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Support</a>
                        </nav>
                        <Link to="/login" className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-start py-10 px-4 md:px-8 gap-16">
                {/* Main Flow - Request Reset Link or Success State */}
                <section className="w-full max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px]">
                        {/* Left Side: Visual */}
                        <div className="hidden md:flex w-1/2 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                            {/* Decorative abstract shapes */}
                            <div className="absolute top-10 left-10 size-20 rounded-full bg-blue-400/10 blur-xl"></div>
                            <div className="absolute bottom-10 right-10 size-32 rounded-full bg-primary/10 blur-2xl"></div>
                            <div className="relative z-10 text-center max-w-xs">
                                <img
                                    alt="Education Graphic"
                                    className="w-full h-auto object-cover rounded-xl shadow-lg mb-6 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop"
                                />
                                <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Secure Access</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Ensure your classroom data stays safe. Resetting your password is quick and easy.</p>
                            </div>
                        </div>

                        {/* Right Side: Form or Success Message */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
                                {!submitted ? (
                                    <>
                                        {/* Header */}
                                        <div className="flex flex-col gap-2">
                                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                                <span className="material-symbols-outlined">lock_reset</span>
                                            </div>
                                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Forgot Password?</h1>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter the email associated with your classroom account and we'll send you a link to reset it.</p>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                                            </div>
                                        )}

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</span>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                                    <input
                                                        type="email"
                                                        placeholder="student@school.edu"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                            </label>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-2 w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                                            >
                                                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                                                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                                            </button>
                                        </form>

                                        {/* Footer */}
                                        <div className="flex items-center justify-center gap-2 pt-2">
                                            <Link to="/login" className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 hover:text-primary transition-colors group">
                                                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                                Back to Login
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    /* Success State */
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                                            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check your mail</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-8">
                                            We have sent password recovery instructions to <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span>.
                                        </p>
                                        <button
                                            onClick={() => window.open('mailto:', '_blank')}
                                            className="w-full max-w-xs bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors mb-4"
                                        >
                                            Open Email App
                                        </button>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 mb-1">Did not receive the email?</p>
                                            <button
                                                onClick={handleResend}
                                                className="text-sm font-semibold text-primary hover:text-blue-500"
                                            >
                                                Resend email
                                            </button>
                                        </div>
                                        <div className="mt-6">
                                            <Link to="/login" className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 hover:text-primary transition-colors group">
                                                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                                Back to Login
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-400 text-sm">
                <p>© 2025 Classroom Portal Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ForgotPassword;
