import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Auth Check Failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async ({ email, password }) => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            let message = 'Login failed';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.error) message = data.error;
                else if (data.detail) message = data.detail; // DRF common detail field
                else if (typeof data === 'object') {
                    const firstField = Object.keys(data)[0];
                    const errors = data[firstField];
                    message = Array.isArray(errors) ? `${firstField}: ${errors[0]}` : String(errors);
                }
            }
            return {
                success: false,
                message: message
            };
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            return { success: true };
        } catch (error) {
            let message = 'Registration failed';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.error) message = data.error;
                else if (typeof data === 'object') {
                    // Extract the first error message from field-level errors
                    const firstField = Object.keys(data)[0];
                    const errors = data[firstField];
                    message = Array.isArray(errors) ? `${firstField}: ${errors[0]}` : String(errors);
                }
            }
            return {
                success: false,
                message: message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
