import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../../api/users';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const UserManagement = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (err) {
                console.error('Failed to delete user:', err);
                alert('Failed to delete user');
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
                    <div className="flex h-full flex-col justify-between p-4">
                        <div className="flex flex-col gap-6">
                            {/* Profile/Brand Area */}
                            <div className="flex gap-3 items-center px-2">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEB_5YJ-TEp0suUNJWRDHbP6Ekga6bn6vLUVkDW3tLG1ibFItbgGoIumvuiSGHlA--M-maAA7Qh1_xWm-_wfgRPIMg9RLpKpCReAYW8USwZrjsVtB-v9lVfWrQMrrTpn9O0cIy2jTF05e2YLfjQK8uV4nGn8Zi3KFHGRZYVsqa8WSTo9MjcXt2NoqsJjmvQu_tEvdsid9XDRHf0F7_xCed5fPknDbX0DVDGWQCjaBzHvzY-e583jL2RPMa97h8ZjDUh1DiExw4Qnv3")' }}></div>
                                <div className="flex flex-col">
                                    <h1 className="text-slate-900 dark:text-white text-base font-semibold leading-normal">Admin Portal</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Classroom Manager</p>
                                </div>
                            </div>
                            {/* Navigation */}
                            <nav className="flex flex-col gap-2">
                                <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary dark:text-slate-400">dashboard</span>
                                    <p className="text-sm font-medium">Dashboard</p>
                                </Link>
                                <Link to="/dashboard/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300">
                                    <span className="material-symbols-outlined fill" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                                    <p className="text-sm font-medium">Users</p>
                                </Link>
                                <Link to="/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary dark:text-slate-400">menu_book</span>
                                    <p className="text-sm font-medium">Courses</p>
                                </Link>
                                <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary dark:text-slate-400">bar_chart</span>
                                    <p className="text-sm font-medium">Reports</p>
                                </Link>
                                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-primary dark:text-slate-400">settings</span>
                                    <p className="text-sm font-medium">Settings</p>
                                </Link>
                            </nav>
                        </div>
                        {/* User Profile Bottom */}
                        <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: `url("${user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgheVThuoSsmQO69O4f84XnuI_YFYcTTh8R_3k2TpusBlhCEEYIfYKfet7h4nakyigFhjU4Aj6URnxlkJ1WBriBbi1DGFHu7qzZmOqDO16r95fL_r7jmoURfIFFvzYFuU0PnMzAVhM7wRtCX62DiyFO6Nq7wgd1EQCPCnfxDiIHNPswZKzvg0oK3uWOsnnzQSAoo3ufKOH_oFBs6rHZMHCHaUC7ck3Oa4pRpol7_M8NZTASi_K1hRfLtODDm8ZslH1NQNXnWKRxuwo'}")` }}></div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Alex Morgan'}</p>
                                    <button onClick={handleLogout} className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 text-left">Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark">
                    {/* Top Bar / Breadcrumbs */}
                    <header className="px-6 py-5 lg:px-10 border-b border-transparent dark:border-slate-800">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Link to="/dashboard/admin" className="hover:text-primary transition-colors">Dashboard</Link>
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                <span className="text-slate-900 font-medium dark:text-white">Users</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 px-6 pb-10 lg:px-10">
                        <div className="max-w-7xl mx-auto flex flex-col gap-6">
                            {/* Page Heading */}
                            <div className="flex flex-wrap justify-between items-end gap-4">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
                                    <p className="text-slate-500 dark:text-slate-400">View and manage students, teachers, and administrative staff.</p>
                                </div>
                            </div>

                            {/* Controls & Table Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
                                {/* Action Bar */}
                                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
                                    {/* Search & Filter */}
                                    <div className="flex flex-1 w-full md:w-auto gap-3">
                                        <div className="relative flex-1 max-w-md group">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">search</span>
                                            <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="Search users by name or email..." type="text" />
                                        </div>
                                        <div className="relative min-w-[160px]">
                                            <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                                                <option value="">All Roles</option>
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                    {/* Add Button */}
                                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-primary/30 w-full md:w-auto active:scale-95">
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        <span>Add New User</span>
                                    </button>
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-12">
                                                    <input className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer" type="checkbox" />
                                                </th>
                                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Status</th>
                                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {loading ? (
                                                <tr>
                                                    <td colspan="5" className="py-8 text-center text-slate-500">Loading users...</td>
                                                </tr>
                                            ) : users.length === 0 ? (
                                                <tr>
                                                    <td colspan="5" className="py-8 text-center text-slate-500">No users found</td>
                                                </tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="py-4 px-6">
                                                            <input className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer" type="checkbox" />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-slate-900 shadow-sm" style={{ backgroundImage: `url("${user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}`}")` }}></div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name || user.username}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : user.role === 'teacher' ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-300 dark:border-primary/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'}`}>
                                                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                                <span className="text-sm text-slate-600 dark:text-slate-300">{user.is_active ? 'Active' : 'Inactive'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Edit">
                                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                                </button>
                                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-semibold text-slate-900 dark:text-white">1-5</span> of <span className="font-semibold text-slate-900 dark:text-white">48</span> users</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors" disabled>Previous</button>
                                        <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white shadow-sm shadow-primary/30">1</button>
                                        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">2</button>
                                        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">3</button>
                                        <span className="px-2 py-1.5 text-slate-400">...</span>
                                        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserManagement;
