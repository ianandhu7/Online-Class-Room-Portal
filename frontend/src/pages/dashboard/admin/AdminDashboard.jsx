import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getUsers, getStats } from '../../../api/admin';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        total_users: 0,
        total_courses: 0,
        total_classrooms: 0,
        pending_requests: 0,
        active_sessions: 42,
        storage_used: '12.4 GB'
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, statsData] = await Promise.all([
                    getUsers(),
                    getStats()
                ]);
                setUsers(userData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleIcon = (role) => {
        switch (role.toLowerCase()) {
            case 'student': return { icon: 'school', color: 'text-indigo-500' };
            case 'teacher': return { icon: 'cast_for_education', color: 'text-purple-500' };
            case 'admin': return { icon: 'supervisor_account', color: 'text-orange-500' };
            default: return { icon: 'person', color: 'text-slate-500' };
        }
    };

    const getStatusStyle = (status) => {
        if (!status) return 'bg-slate-100 text-slate-700 border-slate-200';
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'Offline': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            case 'Suspended': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusDotColor = (status) => {
        if (!status) return 'bg-green-500';
        switch (status) {
            case 'Active': return 'bg-green-500';
            case 'Offline': return 'bg-slate-400';
            case 'Suspended': return 'bg-red-500';
            default: return 'bg-green-500';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display antialiased overflow-hidden">
            <div className="flex h-screen w-full">
                {/* SideNavBar */}
                <aside className={`w-64 h-full ${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-300 fixed md:relative z-30`}>
                    <div className="flex flex-col h-full p-4 justify-between">
                        {/* Header / Logo */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 px-2">
                                <div className="bg-primary aspect-square rounded-lg size-10 flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">ClassPortal</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Admin Panel</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex flex-col gap-1">
                                <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md shadow-blue-500/20 group transition-colors">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    <span className="text-sm font-medium">Dashboard</span>
                                </Link>
                                <Link to="/dashboard/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined">group</span>
                                    <span className="text-sm font-medium">Users</span>
                                </Link>
                                <Link to="/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined">menu_book</span>
                                    <span className="text-sm font-medium">Courses</span>
                                </Link>
                                <Link to="/classrooms" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined">meeting_room</span>
                                    <span className="text-sm font-medium">Classrooms</span>
                                </Link>
                                <Link to="/assignments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <span className="material-symbols-outlined">assignment</span>
                                    <span className="text-sm font-medium">Assignments</span>
                                </Link>
                            </nav>
                        </div>

                        {/* Footer / Profile */}
                        <div className="flex flex-col gap-1 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                            <div className="mt-4 flex items-center gap-3 px-2">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                    {user?.photo_url ? <img src={user.photo_url} alt="" className="size-full object-cover" /> : (user?.name?.charAt(0) || 'A')}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Admin User'}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Super Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
                )}

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary aspect-square rounded-lg size-8 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">school</span>
                            </div>
                            <span className="font-bold text-lg">ClassPortal</span>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    {/* Page Header */}
                    <div className="px-6 sm:px-8 pt-8 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name || 'Admin'}. Here is what is happening today.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                                    <span>Export Report</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="px-6 sm:px-8 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-xs">trending_up</span>
                                        Real-time
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Users</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total_users}</h3>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <span className="material-symbols-outlined">menu_book</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-xs">add</span>
                                        Catalog
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Courses</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total_courses}</h3>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                                        Needs Review
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium relative z-10">Pending Requests</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 relative z-10">{stats.pending_requests}</h3>
                            </div>

                            {/* Additional Admin Stats */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-medium">Monthly</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Storage Used</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.storage_used}</h3>
                            </div>
                        </div>

                        {/* Middle Analytics Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold">Platform Usage (Daily Active Users)</h3>
                                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                        <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-slate-600 rounded shadow-sm">Week</button>
                                        <button className="px-3 py-1 text-[10px] font-bold text-slate-400">Month</button>
                                    </div>
                                </div>
                                <div className="h-48 flex items-end justify-between gap-4">
                                    {[30, 45, 35, 60, 80, 55, 70].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className="w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg relative flex items-end justify-center h-full">
                                                <div
                                                    className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-lg transition-all duration-700 group-hover:opacity-80"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <span className="absolute -top-7 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {h * 10} active
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-lg font-bold mb-6">Recent System Activity</h3>
                                <div className="flex flex-col gap-5">
                                    {activities.map((act) => (
                                        <div key={act.id} className="flex gap-4">
                                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 
                                                ${act.type === 'settings' ? 'bg-orange-50 text-orange-600' :
                                                    act.type === 'course' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                                <span className="material-symbols-outlined">
                                                    {act.type === 'settings' ? 'settings' : act.type === 'course' ? 'menu_book' : 'verified_user'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{act.user}</p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{act.action}</p>
                                                <span className="text-[10px] text-slate-400 mt-1 italic">{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                                    View Full System Logs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="px-6 sm:px-8 py-4 flex-1 pb-10">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full min-h-[500px]">
                            {/* Table Toolbar */}
                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border-none rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary w-full sm:w-64 transition-all"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                        <span className="hidden sm:inline">Filter</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-primary/20">
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        <span>Add User</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                                        <tr>
                                            <th className="px-6 py-4" scope="col">User</th>
                                            <th className="px-6 py-4" scope="col">Role</th>
                                            <th className="px-6 py-4" scope="col">Status</th>
                                            <th className="px-6 py-4" scope="col">Last Login</th>
                                            <th className="px-6 py-4 text-right" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {users.filter(u => (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())).map((userData) => {
                                            const roleInfo = getRoleIcon(userData.role);
                                            return (
                                                <tr key={userData.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold overflow-hidden shrink-0">
                                                                {userData.photo_url ? <img src={userData.photo_url} alt="" className="size-full object-cover" /> : (userData.name || userData.username).charAt(0)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-slate-900 dark:text-slate-200 truncate">{userData.name || userData.username}</div>
                                                                <div className="text-xs text-slate-500 truncate">{userData.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 capitalize">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`material-symbols-outlined text-[18px] ${roleInfo.color}`}>{roleInfo.icon}</span>
                                                            <span>{userData.role}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(userData.status || 'Active')}`}>
                                                            <span className={`size-1.5 rounded-full ${getStatusDotColor(userData.status || 'Active')}`}></span>
                                                            {userData.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {userData.last_login ? new Date(userData.last_login).toLocaleDateString() : 'Never'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 hover:text-primary transition-colors">
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                            <button className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-colors">
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-medium text-slate-900 dark:text-white">1-{users.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{users.length}</span> results
                                </p>
                                <div className="flex gap-2">
                                    <button disabled className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        Previous
                                    </button>
                                    <button disabled className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
