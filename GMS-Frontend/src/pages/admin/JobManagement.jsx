import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // New Job Form State
    const [newJob, setNewJob] = useState({
        customer: '', // ID
        vehicle_reg_number: '',
        vehicle_model: '',
        reported_issues: '',
        assigned_mechanic: '' // ID
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchJobs();
        fetchUsers();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter out DIAGNOSED status
                const jobsList = data.results || data;
                const filteredData = jobsList.filter(job => job.status !== 'DIAGNOSED');
                setJobs(filteredData);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter roles
                const users = data.results || data;
                setCustomers(users.filter(u => u.role === 'CUSTOMER'));
                setMechanics(users.filter(u => u.role === 'MECHANIC'));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newJob)
            });

            if (response.ok) {
                setShowModal(false);
                fetchJobs(); // Refresh list
                setNewJob({ customer: '', vehicle_reg_number: '', vehicle_model: '', reported_issues: '', assigned_mechanic: '' });
            } else {
                console.error('Failed to create job');
                const err = await response.json();
                alert(JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error creating job:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
            case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
            case 'COMPLETED': return 'bg-green-500/20 text-green-400';
            case 'CANCELLED': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        if (!selectedJob) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/jobs/${selectedJob.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newJob) // Reusing newJob state for edits to keep it simple
            });

            if (response.ok) {
                setShowModal(false);
                setSelectedJob(null);
                fetchJobs();
                setNewJob({ customer: '', vehicle_reg_number: '', vehicle_model: '', reported_issues: '', assigned_mechanic: '' });
            } else {
                console.error('Failed to update job');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openEditModal = (job) => {
        setSelectedJob(job);
        setNewJob({
            customer: job.customer,
            vehicle_reg_number: job.vehicle_reg_number,
            vehicle_model: job.vehicle_model,
            reported_issues: job.reported_issues,
            assigned_mechanic: job.assigned_mechanic || '',
            status: job.status
        });
        setShowModal(true);
    };

    // Add selectedJob state if not present (it was not in original file, I need to add it to the top level variables, 
    // but I can't easily inject it into the top without replacing the whole file or using multi-replace cautiously.
    // I will replace the whole component body for safety.)

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Job Cards & Work Orders</h2>
                <button
                    onClick={() => { setSelectedJob(null); setNewJob({ customer: '', vehicle_reg_number: '', vehicle_model: '', reported_issues: '', assigned_mechanic: '' }); setShowModal(true); }}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    + Create Job Card
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <div key={job.id} onClick={() => openEditModal(job)} className="cursor-pointer bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-100">{job.vehicle_reg_number}</h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">{job.vehicle_model}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Customer</p>
                                <p className="text-sm font-medium">{customers.find(c => c.id === job.customer)?.username || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Reported Issues</p>
                                <p className="text-sm text-slate-300 line-clamp-2">{job.reported_issues}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Assigned To</p>
                                <p className="text-sm text-blue-300 font-medium">
                                    {mechanics.find(m => m.id === job.assigned_mechanic)?.username || <span className="text-yellow-500">Unassigned</span>}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                            <p className="text-xs text-slate-500">
                                Date: {new Date(job.created_at).toLocaleDateString()}
                            </p>
                            <span className="text-blue-400 hover:text-blue-300 text-sm font-medium">Manage &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">{selectedJob ? 'Manage Job Card' : 'Create New Job Card'}</h3>
                        <form onSubmit={selectedJob ? handleUpdateJob : handleCreateJob} className="space-y-4">
                            {/* Read Only Customer in Edit Mode helps avoid confusion, but we allow edit if needed */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Customer</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none disabled:opacity-50"
                                    value={newJob.customer}
                                    onChange={e => setNewJob({ ...newJob, customer: e.target.value })}
                                    required
                                    disabled={!!selectedJob}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.username} ({c.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle Reg No.</label>
                                    <input type="text" disabled={!!selectedJob} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none disabled:opacity-50" value={newJob.vehicle_reg_number} onChange={e => setNewJob({ ...newJob, vehicle_reg_number: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle Model</label>
                                    <input type="text" disabled={!!selectedJob} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none disabled:opacity-50" value={newJob.vehicle_model} onChange={e => setNewJob({ ...newJob, vehicle_model: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Reported Issues</label>
                                <textarea required className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none h-24" value={newJob.reported_issues} onChange={e => setNewJob({ ...newJob, reported_issues: e.target.value })}></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Assign Mechanic</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-blue-500"
                                    value={newJob.assigned_mechanic}
                                    onChange={e => setNewJob({ ...newJob, assigned_mechanic: e.target.value })}
                                >
                                    <option value="">Select Mechanic (Unassigned)</option>
                                    {mechanics.map(m => (
                                        <option key={m.id} value={m.id}>{m.username}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedJob && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none focus:border-blue-500"
                                        value={newJob.status || 'PENDING'}
                                        onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="READY">Ready</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium">{selectedJob ? 'Update Job' : 'Create Job Card'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManagement;
