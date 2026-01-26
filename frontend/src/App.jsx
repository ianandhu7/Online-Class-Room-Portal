import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import './styles/globals.css';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </AppProvider>
        </Router>

    );
}

export default App;
