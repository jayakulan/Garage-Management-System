import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/layout/SidebarLayout';
import { Home, History, PlusCircle, Car } from 'lucide-react';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Derived state
    const [vehicles, setVehicles] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            fetchMyHistory();
        }
    }, [user, activeTab]); // Re-fetch when tab changes (especially after request submission)

    const fetchMyHistory = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter jobs for this customer
                const myJobs = data.filter(job => job.customer === user.user_id);
                setJobs(myJobs);

                // Extract unique vehicles
                const uniqueVehicles = [...new Set(myJobs.map(job => job.vehicle_reg_number))]
                    .map(reg => {
                        const job = myJobs.find(j => j.vehicle_reg_number === reg);
                        return { reg, model: job.vehicle_model };
                    });
                setVehicles(uniqueVehicles);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
            case 'COMPLETED': return 'bg-green-500/20 text-green-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'request', label: 'Request Service', icon: PlusCircle },
        { id: 'history', label: 'Service History', icon: History },
        { id: 'vehicles', label: 'My Vehicles', icon: Car },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'request':
                return (
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl max-w-3xl">
                        <ServiceRequestWrapper onSuccess={() => setActiveTab('overview')} onCancel={() => setActiveTab('overview')} />
                    </div>
                );
            case 'history':
                return (
                    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="p-5 border-b border-slate-700">Date</th>
                                    <th className="p-5 border-b border-slate-700">Vehicle</th>
                                    <th className="p-5 border-b border-slate-700">Issue</th>
                                    <th className="p-5 border-b border-slate-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-5 border-b border-slate-700 text-slate-400">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 border-b border-slate-700 font-medium">{job.vehicle_reg_number}</td>
                                        <td className="p-5 border-b border-slate-700 text-slate-300 max-w-xs truncate">{job.reported_issues}</td>
                                        <td className="p-5 border-b border-slate-700">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {jobs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">No service history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            case 'vehicles':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.length === 0 ? (
                            <p className="text-slate-500 col-span-full">No vehicles registered yet.</p>
                        ) : (
                            vehicles.map((v, idx) => (
                                <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{v.reg}</h3>
                                        <p className="text-slate-400 text-sm">{v.model}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                        <Car size={24} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Stats Cards */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                💳 Active Jobs
                            </h2>
                            <div className="text-center py-6">
                                <p className="text-slate-400 text-sm mb-2">Jobs In Progress</p>
                                <p className="text-4xl font-bold text-blue-400">
                                    {jobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                🚗 Total Vehicles
                            </h2>
                            <div className="text-center py-6">
                                <p className="text-slate-400 text-sm mb-2">My Fleet</p>
                                <p className="text-4xl font-bold text-green-400">
                                    {vehicles.length}
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <SidebarLayout
            title="Customer"
            user={user}
            menuItems={menuItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
        >
            {renderContent()}
        </SidebarLayout>
    );
};

// Internal wrapper to handle Service Request logic reuse
const ServiceRequestWrapper = ({ onSuccess, onCancel }) => {
    // const { user } = useAuth(); // Not strictly needed inside form unless we use user info for defaults

    const [request, setRequest] = useState({
        vehicle_reg_number: '',
        vehicle_model: '',
        reported_issues: ''
    });
    const token = localStorage.getItem('token');

    const handleChange = (e) => setRequest({ ...request, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...request, status: 'PENDING' })
            });
            if (response.ok) {
                alert('Service Request Submitted!');
                onSuccess();
            } else {
                alert('Failed to submit');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white">New Service Request</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Reg. Number</label>
                    <input type="text" name="vehicle_reg_number" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" value={request.vehicle_reg_number} onChange={handleChange} placeholder="ABC-1234" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Model</label>
                    <input type="text" name="vehicle_model" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" value={request.vehicle_model} onChange={handleChange} placeholder="Toyota Corolla" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Issue Description</label>
                <textarea name="reported_issues" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-32 resize-none" value={request.reported_issues} onChange={handleChange} placeholder="Describe the issue..."></textarea>
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-medium transition-colors text-white">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-medium transition-colors text-white">Submit Request</button>
            </div>
        </form>
    );
};

export default CustomerDashboard;
