import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/layout/SidebarLayout';
import InventoryManagement from './InventoryManagement'; // Correct Import placement
import { Briefcase, Package, Wrench, CheckCircle } from 'lucide-react';

const MechanicDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [parts, setParts] = useState([]); // Available parts in inventory
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeTab, setActiveTab] = useState('assignments');

    // Status Update State
    const [newStatus, setNewStatus] = useState('');

    // Add Part State
    const [partToAdd, setPartToAdd] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            fetchMyJobs();
            fetchParts();
        }
    }, [user, activeTab]);

    const fetchMyJobs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter jobs where assigned_mechanic matches current user ID
                const myJobs = data.filter(job => job.assigned_mechanic === user.user_id);
                setJobs(myJobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchParts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/parts/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setParts(await response.json());
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedJob) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/jobs/${selectedJob.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert('Status Updated');
                setSelectedJob({ ...selectedJob, status: newStatus });
                fetchMyJobs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPart = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/job-parts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    job: selectedJob.id,
                    part: partToAdd,
                    quantity: quantityToAdd
                })
            });

            if (response.ok) {
                alert('Part added to job');
                setPartToAdd('');
                setQuantityToAdd(1);
            } else {
                alert('Failed to add part (Check stock quantity or if part already added)');
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
            case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
            case 'COMPLETED': return 'bg-green-500/20 text-green-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const menuItems = [
        { id: 'assignments', label: 'My Assignments', icon: Briefcase },
        { id: 'parts', label: 'Parts Inventory', icon: Package },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'parts':
                return <InventoryManagement />;
            case 'assignments':
            default:
                return (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {jobs.map(job => (
                                <div key={job.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all shadow-xl shadow-black/20">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{job.vehicle_reg_number}</h3>
                                            <p className="text-sm text-slate-400">{job.vehicle_model}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Reported Issues</p>
                                        <p className="text-slate-300 text-sm leading-relaxed">{job.reported_issues}</p>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedJob(job); setNewStatus(job.status); }}
                                        className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Manage Job
                                    </button>
                                </div>
                            ))}
                        </div>

                        {jobs.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <p className="text-slate-400 text-lg">No jobs assigned to you yet.</p>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <SidebarLayout
            title="Mechanic"
            user={user}
            menuItems={menuItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
        >
            {renderContent()}

            {/* Job Management Modal - Kept outside renderContent to work across tabs if needed, but mostly for assignments */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Job #{selectedJob.id} - {selectedJob.vehicle_reg_number}</h2>
                            <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="space-y-8">
                            {/* Update Status */}
                            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                                <h3 className="text-lg font-semibold mb-4 text-blue-400">Update Status</h3>
                                <div className="flex gap-4">
                                    <select
                                        className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="DIAGNOSED">Diagnosed</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="READY">Ready for Delivery</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                    <button
                                        onClick={handleUpdateStatus}
                                        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Add Parts */}
                            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                                <h3 className="text-lg font-semibold mb-4 text-blue-400">Add Parts Used</h3>
                                <form onSubmit={handleAddPart} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <select
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
                                                value={partToAdd}
                                                onChange={e => setPartToAdd(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Part</option>
                                                {parts.map(p => (
                                                    <option key={p.id} value={p.id} disabled={p.quantity < 1}>
                                                        {p.name} (Stock: {p.quantity}) - ${p.price}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
                                                value={quantityToAdd}
                                                onChange={e => setQuantityToAdd(e.target.value)}
                                                placeholder="Qty"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition-colors">
                                        Add Part to Job
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
};

export default MechanicDashboard;
