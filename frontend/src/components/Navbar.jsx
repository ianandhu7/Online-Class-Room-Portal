import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Online Classroom
                </Link>

                <div className="navbar-menu">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                            <Link to="/courses" className="navbar-link">Courses</Link>
                            <Link to="/classrooms" className="navbar-link">Classrooms</Link>
                            <span className="navbar-user">{user.name}</span>
                            <button onClick={handleLogout} className="navbar-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Login</Link>
                            <Link to="/register" className="navbar-button">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
