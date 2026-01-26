import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const ServiceHistory = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            fetchMyHistory();
        }
    }, [user]);

    const fetchMyHistory = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const allJobs = data.results || data;
                const myJobs = allJobs.filter(job => Number(job.customer) === Number(user.user_id));
                setJobs(myJobs);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
            case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
            case 'READY': return 'bg-cyan-500/20 text-cyan-400';
            case 'COMPLETED': return 'bg-green-500/20 text-green-400';
            case 'CANCELLED': return 'bg-red-500/20 text-red-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="text-white">
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th className="p-5 border-b border-slate-700">Date</th>
                            <th className="p-5 border-b border-slate-700">Vehicle</th>
                            <th className="p-5 border-b border-slate-700">Issue</th>
                            <th className="p-5 border-b border-slate-700">Status</th>
                            <th className="p-5 border-b border-slate-700">Billing</th>
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
                                <td className="p-5 border-b border-slate-700 font-medium">
                                    {job.invoice_details ? (
                                        <button
                                            onClick={() => handleViewInvoice(job.invoice_details)}
                                            className="flex flex-col gap-1 items-start hover:bg-slate-700 p-2 rounded transition-colors w-full text-left group"
                                        >
                                            <span className="text-white group-hover:text-blue-400 transition-colors">
                                                ${job.invoice_details.grand_total}
                                            </span>
                                            <span className={`text-[10px] uppercase font-bold ${job.invoice_details.status === 'PAID' ? 'text-green-400' : 'text-red-400'}`}>
                                                {job.invoice_details.status}
                                            </span>
                                            <span className="text-[10px] text-slate-500 underline decoration-slate-600 group-hover:text-blue-300">View Breakdown</span>
                                        </button>
                                    ) : (
                                        <span className="text-slate-500 text-xs">
                                            {job.status === 'READY' ? 'Generating Bill...' : '-'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No service history found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invoice Modal */}
            {showInvoiceModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-xl font-bold text-white">Invoice Details</h2>
                            <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                                <span className="text-slate-400">Invoice Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedInvoice.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {selectedInvoice.status}
                                </span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-800">
                                <div className="flex justify-between text-slate-300">
                                    <span>Parts Total</span>
                                    <span>${selectedInvoice.parts_total}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>Labor Cost</span>
                                    <span>${selectedInvoice.labor_cost}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-slate-700 mt-4">
                                    <span>Grand Total</span>
                                    <span>${selectedInvoice.grand_total}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-800/30">
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceHistory;
