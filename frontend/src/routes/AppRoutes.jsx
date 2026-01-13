import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dashboard pages
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import UserManagement from '../pages/dashboard/admin/UserManagement';
import TeacherDashboard from '../pages/dashboard/teacher/TeacherDashboard';
import StudentDashboard from '../pages/dashboard/student/StudentDashboard';

// Course pages
import CourseList from '../pages/courses/CourseList';
import CourseCreate from '../pages/courses/CourseCreate';
import CourseEdit from '../pages/courses/CourseEdit';

// Classroom pages
import ClassroomList from '../pages/classrooms/ClassroomList';
import ClassroomCreate from '../pages/classrooms/ClassroomCreate';
import ClassroomJoin from '../pages/classrooms/ClassroomJoin';
import ClassroomDetails from '../pages/classrooms/ClassroomDetails';
import MarkAttendance from '../pages/classrooms/MarkAttendance';

// Assignment pages
import AssignmentList from '../pages/assignments/AssignmentList';
import AssignmentCreate from '../pages/assignments/AssignmentCreate';
import AssignmentEdit from '../pages/assignments/AssignmentEdit';
import AssignmentSubmit from '../pages/assignments/AssignmentSubmit';

// Directory pages
import StudentList from '../pages/directory/StudentList';
import TeacherList from '../pages/directory/TeacherList';
import Settings from '../pages/settings/Settings';
import Grades from '../pages/grades/Grades';
import Calendar from '../pages/calendar/Calendar';
import Messages from '../pages/messages/Messages';

// Profile page
import Profile from '../pages/profile/Profile';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={`/dashboard/${user.role}`} />;
    }

    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard routes */}
            <Route
                path="/dashboard/admin"
                element={
                    <PrivateRoute requiredRole="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/dashboard/admin/users"
                element={
                    <PrivateRoute requiredRole="admin">
                        <UserManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path="/dashboard/teacher"
                element={
                    <PrivateRoute>
                        <TeacherDashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/dashboard/student"
                element={
                    <PrivateRoute>
                        <StudentDashboard />
                    </PrivateRoute>
                }
            />

            {/* Generic dashboard redirect */}
            <Route
                path="/dashboard"
                element={
                    user ? (
                        <Navigate to={`/dashboard/${user.role}`} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* Course routes */}
            <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
            <Route path="/courses/create" element={<PrivateRoute><CourseCreate /></PrivateRoute>} />
            <Route path="/courses/:id/edit" element={<PrivateRoute><CourseEdit /></PrivateRoute>} />
            <Route path="/courses/:id" element={<PrivateRoute><ClassroomDetails /></PrivateRoute>} />

            {/* Classroom routes */}
            <Route path="/classrooms" element={<PrivateRoute><ClassroomList /></PrivateRoute>} />
            <Route path="/classrooms/create" element={<PrivateRoute><ClassroomCreate /></PrivateRoute>} />
            <Route path="/classrooms/join" element={<PrivateRoute><ClassroomJoin /></PrivateRoute>} />
            <Route path="/classrooms/:id" element={<PrivateRoute><ClassroomDetails /></PrivateRoute>} />

            {/* Assignment routes */}
            <Route path="/assignments" element={<PrivateRoute><AssignmentList /></PrivateRoute>} />
            <Route path="/assignments/create" element={<PrivateRoute><AssignmentCreate /></PrivateRoute>} />
            <Route path="/assignments/:id/edit" element={<PrivateRoute><AssignmentEdit /></PrivateRoute>} />
            <Route path="/assignments/:id/submit" element={<PrivateRoute><AssignmentSubmit /></PrivateRoute>} />

            {/* Directory Routes */}
            <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/teachers" element={<PrivateRoute><TeacherList /></PrivateRoute>} />

            {/* Utility Routes */}
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/grades" element={<PrivateRoute><Grades /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute requiredRole="teacher"><MarkAttendance /></PrivateRoute>} />

            {/* Default route */}
            <Route
                path="/"
                element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
        </Routes>
    );
};

export default AppRoutes;
