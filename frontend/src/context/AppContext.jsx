import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Initialize theme from localStorage or default to 'system'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('classportal_theme') || 'system';
        }
        return 'system';
    });

    // Apply theme changes
    React.useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (themeStr) => {
            if (themeStr === 'dark') {
                root.classList.add('dark');
            } else if (themeStr === 'light') {
                root.classList.remove('dark');
            } else if (themeStr === 'system') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
            localStorage.setItem('classportal_theme', themeStr);
        };

        applyTheme(theme);

        // Listen for system changes if mode is system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                if (e.matches) root.classList.add('dark');
                else root.classList.remove('dark');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const addNotification = (notification) => {
        setNotifications((prev) => [...prev, { ...notification, id: Date.now() }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
        theme,
        toggleTheme,
        setTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
