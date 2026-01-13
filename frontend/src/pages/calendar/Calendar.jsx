import React from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 flex-col">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 opacity-50">calendar_month</span>
            <h1 className="text-2xl font-bold dark:text-white">Calendar Module</h1>
            <p className="text-slate-500 mb-6">This feature is coming soon.</p>
            <Link to="/dashboard" className="text-primary hover:underline">Return Home</Link>
        </div>
    );
};
export default Calendar;
