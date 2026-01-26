import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/layout/SidebarLayout';
import EditProfileModal from '../../components/EditProfileModal';
import ServiceRequest from './ServiceRequest';
import ServiceHistory from './ServiceHistory';
import MyVehicles from './MyVehicles';
import {
    Home, History, PlusCircle, Car, Clock, CheckCircle,
    AlertCircle, TrendingUp, Calendar, Wrench, DollarSign,
    ArrowRight, Activity, Check
} from 'lucide-react';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user && activeTab === 'overview') {
            fetchOverviewData();
        }
    }, [user, activeTab]);

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Handle both paginated (data.results) and non-paginated (data) responses
                const allJobs = data.results || data;
                // Filter out DIAGNOSED status and get only customer's jobs
                const myJobs = allJobs.filter(job =>
                    Number(job.customer) === Number(user.user_id) &&
                    job.status !== 'DIAGNOSED'
                );
                setJobs(myJobs);

                // Get recent jobs (last 5)
                const sortedJobs = [...myJobs].sort((a, b) =>
                    new Date(b.created_at || b.id) - new Date(a.created_at || a.id)
                );
                setRecentJobs(sortedJobs.slice(0, 5));

                const uniqueVehicles = [...new Set(myJobs.map(job => job.vehicle_reg_number))];
                setVehicles(uniqueVehicles);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast({ message: '', type: '', visible: false });
        }, 3000);
    };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileSave = (updatedUser) => {
        // Optionally update local state or refetch data
        console.log('Profile updated:', updatedUser);
        showToast('Profile saved successfully!', 'success');
        // You might want to refresh the token or user data here
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'request', label: 'Request Service', icon: PlusCircle },
        { id: 'history', label: 'Service History', icon: History },
        { id: 'vehicles', label: 'My Vehicles', icon: Car },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            'IN_PROGRESS': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            'COMPLETED': 'text-green-400 bg-green-400/10 border-green-400/20',
            'CANCELLED': 'text-red-400 bg-red-400/10 border-red-400/20',
        };
        return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4" />;
            case 'IN_PROGRESS': return <Activity className="w-4 h-4" />;
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const renderOverview = () => {
        // Filter out DIAGNOSED status from display
        const validJobs = jobs.filter(j => j.status !== 'DIAGNOSED');
        const activeJobs = validJobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length;
        const completedJobs = validJobs.filter(j => j.status === 'COMPLETED').length;
        const pendingJobs = validJobs.filter(j => j.status === 'PENDING').length;
        const totalSpent = validJobs
            .filter(j => j.status === 'COMPLETED')
            .reduce((sum, job) => sum + (parseFloat(job.total_cost) || 0), 0);

        return (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Active Jobs Card */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Active Jobs</h3>
                        <p className="text-3xl font-bold text-white">{activeJobs}</p>
                        <p className="text-xs text-slate-500 mt-2">In progress</p>
                    </div>

                    {/* Total Vehicles Card */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Car className="w-6 h-6 text-green-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">My Vehicles</h3>
                        <p className="text-3xl font-bold text-white">{vehicles.length}</p>
                        <p className="text-xs text-slate-500 mt-2">Registered</p>
                    </div>

                    {/* Completed Jobs Card */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Completed</h3>
                        <p className="text-3xl font-bold text-white">{completedJobs}</p>
                        <p className="text-xs text-slate-500 mt-2">Services done</p>
                    </div>

                    {/* Total Spent Card */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Spent</h3>
                        <p className="text-3xl font-bold text-white">Rs {totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-2">All time</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-400" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setActiveTab('request')}
                            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <PlusCircle className="w-5 h-5 text-white" />
                                    <span className="text-white font-medium">New Service Request</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('vehicles')}
                            className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-white" />
                                    <span className="text-white font-medium">Manage Vehicles</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History className="w-5 h-5 text-white" />
                                    <span className="text-white font-medium">View History</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Services */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            Recent Services
                        </h2>
                        <div className="space-y-3">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job, index) => (
                                    <div
                                        key={job.id || index}
                                        className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">
                                                {job.vehicle_reg_number}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(job.status)}`}>
                                                {getStatusIcon(job.status)}
                                                {job.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-2">
                                            {job.description || 'Service request'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Job #{job.id}</span>
                                            {job.total_cost && (
                                                <span className="text-green-400 font-medium">
                                                    ₹{parseFloat(job.total_cost).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400">No recent services</p>
                                    <button
                                        onClick={() => setActiveTab('request')}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Request Service
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Insights */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" />
                            Service Insights
                        </h2>
                        <div className="space-y-4">
                            {/* Pending Jobs Alert */}
                            {pendingJobs > 0 && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                                        <div>
                                            <h3 className="text-yellow-400 font-medium mb-1">
                                                Pending Approval
                                            </h3>
                                            <p className="text-slate-300 text-sm">
                                                You have {pendingJobs} service {pendingJobs === 1 ? 'request' : 'requests'} waiting for approval.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Jobs Info */}
                            {activeJobs > 0 && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Activity className="w-5 h-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <h3 className="text-blue-400 font-medium mb-1">
                                                Work in Progress
                                            </h3>
                                            <p className="text-slate-300 text-sm">
                                                {activeJobs} {activeJobs === 1 ? 'vehicle is' : 'vehicles are'} currently being serviced.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Maintenance Tip */}
                            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Wrench className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-purple-400 font-medium mb-1">
                                            Maintenance Tip
                                        </h3>
                                        <p className="text-slate-300 text-sm">
                                            Regular servicing every 6 months keeps your vehicle in optimal condition.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* All Clear Message */}
                            {pendingJobs === 0 && activeJobs === 0 && jobs.length > 0 && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <h3 className="text-green-400 font-medium mb-1">
                                                All Caught Up!
                                            </h3>
                                            <p className="text-slate-300 text-sm">
                                                No pending services. Your vehicles are all set!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loading && activeTab === 'overview') {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'request':
                return <ServiceRequest onSuccess={() => setActiveTab('history')} onCancel={() => setActiveTab('overview')} />;
            case 'history':
                return <ServiceHistory />;
            case 'vehicles':
                return <MyVehicles />;
            case 'overview':
            default:
                return renderOverview();
        }
    };

    return (
        <>
            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className={`p-4 rounded-lg flex items-center gap-3 shadow-lg ${toast.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                        {toast.type === 'success' ? (
                            <Check size={20} />
                        ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        )}
                        {toast.message}
                    </div>
                </div>
            )}

            <SidebarLayout
                title="Customer"
                user={user}
                menuItems={menuItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
            >
                {renderContent()}
            </SidebarLayout>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onSave={handleProfileSave}
                showFields={{ username: true, email: true, phone: true, address: true, password: true }}
            />
        </>
    );
};

export default CustomerDashboard;
