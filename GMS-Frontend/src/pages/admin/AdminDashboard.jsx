import React, { useState, useEffect } from 'react';
import { Users, Wrench, FileText, BarChart3, Settings, LogOut, TrendingUp, AlertCircle, Clock, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../../components/EditProfileModal';
// Removed unused single line import of icons, they are now merged above.

const AdminDashboard = () => {
    const { user } = useAuth();
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
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch Users
            const usersRes = await fetch('http://127.0.0.1:8000/api/users/', { headers: { 'Authorization': `Bearer ${token}` } });
            const usersData = await usersRes.json();
            const usersList = usersData.results || usersData;

            // Fetch Jobs
            const jobsRes = await fetch('http://127.0.0.1:8000/api/jobs/', { headers: { 'Authorization': `Bearer ${token}` } });
            const jobsData = await jobsRes.json();
            const jobsList = jobsData.results || jobsData;

            // Fetch Inventory
            const invRes = await fetch('http://127.0.0.1:8000/api/parts/', { headers: { 'Authorization': `Bearer ${token}` } });
            const invData = await invRes.json();
            const invList = invData.results || invData;

            // Calculate Stats
            const totalInventoryValue = invList.reduce((acc, part) => acc + (parseFloat(part.price) * part.quantity), 0);
            const activeJobs = jobsList.filter(j => j.status === 'IN_PROGRESS');
            const active = activeJobs.length;
            const completed = jobsList.filter(j => j.status === 'COMPLETED').length;
            const pending = jobsList.filter(j => j.status === 'PENDING').length;
            const lowStock = invList.filter(part => part.quantity < 5);

            setStats({
                totalUsers: usersData.count || usersList.length,
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



    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileSave = (updatedUser) => {
        // Optionally update local state or refetch data
        console.log('Profile updated:', updatedUser);
        // You might want to refresh the token or user data here
    };

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
