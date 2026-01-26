import React, { useState, useEffect } from 'react';
import { Users, Wrench, FileText, BarChart3, Settings, LogOut, TrendingUp, AlertCircle, Clock, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../../components/EditProfileModal';
import UserManagement from './UserManagement';
import InventoryManagement from './Inventory';
import JobManagement from './JobManagement';
import BillingManagement from './Billing';
// Removed unused single line import of icons, they are now merged above.

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeJobs: 0,
        inventoryValue: 0,
        completedJobs: 0,
        pendingJobs: 0,
        lowStockItems: []
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            // Fetch Users
            const usersRes = await fetch('http://127.0.0.1:8000/api/users/', { headers: { 'Authorization': `Bearer ${token}` } });
            const usersData = await usersRes.json();

            // Fetch Jobs
            const jobsRes = await fetch('http://127.0.0.1:8000/api/jobs/', { headers: { 'Authorization': `Bearer ${token}` } });
            const jobsData = await jobsRes.json();

            // Fetch Inventory
            const invRes = await fetch('http://127.0.0.1:8000/api/parts/', { headers: { 'Authorization': `Bearer ${token}` } });
            const invData = await invRes.json();

            // Calculate Stats
            const totalInventoryValue = invData.reduce((acc, part) => acc + (parseFloat(part.price) * part.quantity), 0);
            // Filter out DIAGNOSED status from display
            const activeJobs = jobsData.filter(j => j.status === 'IN_PROGRESS' && j.status !== 'DIAGNOSED');
            const active = activeJobs.length;
            const completed = jobsData.filter(j => j.status === 'COMPLETED').length;
            const pending = jobsData.filter(j => j.status === 'PENDING').length;
            const lowStock = invData.filter(part => part.quantity < 5);

            setStats({
                totalUsers: usersData.length,
                activeJobs: active,
                inventoryValue: totalInventoryValue,
                completedJobs: completed,
                pendingJobs: pending,
                lowStockItems: lowStock
            });

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileSave = (updatedUser) => {
        // Optionally update local state or refetch data
        console.log('Profile updated:', updatedUser);
        // You might want to refresh the token or user data here
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <UserManagement />;
            case 'inventory': return <InventoryManagement />;
            case 'jobs': return <JobManagement />;
            case 'billing': return <BillingManagement />;
            default:
                return (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={64} className="text-blue-500" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Total Users</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Wrench size={64} className="text-orange-500" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">{stats.activeJobs}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CheckCircle size={64} className="text-green-500" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-500/20 p-3 rounded-lg text-green-500">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Completed Jobs</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">{stats.completedJobs}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BarChart3 size={64} className="text-emerald-500" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-500">
                                        <BarChart3 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Inventory Value</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">Rs {stats.inventoryValue.toLocaleString()}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity & Alerts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Actions / Recent Status */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-blue-400" /> Job Status Overview
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            <span className="text-slate-300">Pending Approval</span>
                                        </div>
                                        <span className="font-bold text-white">{stats.pendingJobs}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                            <span className="text-slate-300">In Progress</span>
                                        </div>
                                        <span className="font-bold text-white">{stats.activeJobs}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                            <span className="text-slate-300">Completed This Month</span>
                                        </div>
                                        <span className="font-bold text-white">{stats.completedJobs}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Low Stock Alerts */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-red-400" /> Low Stock Alerts
                                </h3>
                                <div className="space-y-3">
                                    {stats.lowStockItems.length > 0 ? (
                                        stats.lowStockItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-500/20 p-2 rounded text-red-500">
                                                        <Settings size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                                        <p className="text-xs text-red-400">SKU: {item.sku}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-red-500">{item.quantity}</span>
                                                    <p className="text-[10px] text-red-400 uppercase">Remaining</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>No inventory alerts. Stock looks good!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white">G</span>
                        </div>
                        <span className="font-bold text-xl text-slate-100">GMS Admin</span>
                    </div>

                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <BarChart3 size={18} /> Overview
                        </button>
                        <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <Users size={18} /> Users & Mechanics
                        </button>
                        <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <FileText size={18} /> Job Cards
                        </button>
                        <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <Wrench size={18} /> Inventory
                        </button>
                        <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <FileText size={18} /> Billing
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1>
                        <p className="text-slate-400 text-sm">Manage your garage {activeTab}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleProfileClick}
                            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600 hover:border-blue-500 hover:bg-slate-600 transition-all cursor-pointer group"
                            title="Edit Profile"
                        >
                            {user?.username?.charAt(0).toUpperCase() || <User size={20} className="group-hover:scale-110 transition-transform" />}
                        </button>
                    </div>
                </header>

                {renderContent()}
            </main>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onSave={handleProfileSave}
                showFields={{ username: true, email: true, phone: false, address: false, password: true }}
            />
        </div>
    );
};

export default AdminDashboard;
