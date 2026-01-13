import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const adminLinks = [
        { path: '/dashboard/admin', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'Courses', icon: '📚' },
        { path: '/classrooms', label: 'Classrooms', icon: '🏫' },
        { path: '/assignments', label: 'Assignments', icon: '📝' },
    ];

    const teacherLinks = [
        { path: '/dashboard/teacher', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'My Courses', icon: '📚' },
        { path: '/classrooms', label: 'My Classrooms', icon: '🏫' },
        { path: '/assignments', label: 'Assignments', icon: '📝' },
    ];

    const studentLinks = [
        { path: '/dashboard/student', label: 'Dashboard', icon: '📊' },
        { path: '/courses', label: 'My Courses', icon: '📚' },
        { path: '/classrooms', label: 'My Classrooms', icon: '🏫' },
        { path: '/assignments', label: 'My Assignments', icon: '📝' },
    ];

    const getLinks = () => {
        if (!user) return [];
        switch (user.role) {
            case 'admin':
                return adminLinks;
            case 'teacher':
                return teacherLinks;
            case 'student':
                return studentLinks;
            default:
                return [];
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Menu</h2>
            </div>
            <nav className="sidebar-nav">
                {getLinks().map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-label">{link.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
