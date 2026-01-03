import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const BillingManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // In a real app, query param ?status=COMPLETED works best
            // Here filtering client side logic for demonstration
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only jobs that are COMPLETED or READY
                const billableJobs = data.filter(job => job.status === 'COMPLETED' || job.status === 'READY');
                setJobs(billableJobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const [generateModal, setGenerateModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [laborCost, setLaborCost] = useState('');

    const openGenerateModal = (jobId) => {
        setSelectedJobId(jobId);
        setLaborCost(''); // Reset
        setGenerateModal(true);
    };

    const submitInvoiceGeneration = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/invoices/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    job: selectedJobId,
                    labor_cost: laborCost,
                    status: 'UNPAID'
                })
            });

            if (response.ok) {
                const invoice = await response.json();
                alert(`Invoice Generated! Total: $${invoice.grand_total}`);
                setGenerateModal(false);
                fetchJobs(); // Refresh list to show 'View Invoice' button
            } else {
                const error = await response.json();
                alert('Error creating invoice: ' + JSON.stringify(error));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [viewModal, setViewModal] = useState(false);

    const handleViewInvoice = async (job) => {
        // Ideally we fetch the specific invoice for this job
        // Since our API separates them, we might need to fetch by job ID or filter.
        // For now, let's assume we can fetch all invoices and find it, OR the job object has 'invoice' ID (OneToOne).
        // The JobCard serializer has 'invoice' if related_name='invoice' is in model (it is!).
        // Wait, current serializer might not expose it unless we added it.
        // Let's assume we fetch /api/invoices/?job={job.id} or similar filtering.
        // Or simpler: The backend API `invoices` usually returns a list.

        try {
            // Fetch all invoices (Not efficient for prod, but fine for prototype) or filter
            const response = await fetch('http://127.0.0.1:8000/api/invoices/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const inv = data.find(i => i.job === job.id);
                if (inv) {
                    setSelectedInvoice(inv);
                    setViewModal(true);
                } else {
                    alert('Invoice not found, try generating it first.');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkPaid = async () => {
        if (!selectedInvoice) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/invoices/${selectedInvoice.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'PAID' })
            });
            if (response.ok) {
                alert('Invoice Marked as PAID');
                setSelectedInvoice({ ...selectedInvoice, status: 'PAID' });
                // Also update Job status to COMPLETED if not already
                updateJobStatus(selectedInvoice.job, 'COMPLETED');
                fetchJobs(); // Refresh main list
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateJobStatus = async (jobId, status) => {
        await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        });
    };

    return (
        <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">Billing & Invoices</h2>

            {jobs.length === 0 ? (
                <div className="text-center p-12 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-slate-400">No completed jobs pending billing.</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 border-b border-slate-700">Job ID</th>
                                <th className="p-4 border-b border-slate-700">Vehicle</th>
                                <th className="p-4 border-b border-slate-700">Status</th>
                                <th className="p-4 border-b border-slate-700">Date Completed</th>
                                <th className="p-4 border-b border-slate-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 border-b border-slate-700 text-slate-300">#{job.id}</td>
                                    <td className="p-4 border-b border-slate-700 font-medium">{job.vehicle_reg_number}</td>
                                    <td className="p-4 border-b border-slate-700">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b border-slate-700 text-slate-400">
                                        {job.completed_at || new Date(job.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 border-b border-slate-700">
                                        {/* If Job is READY, show Generate. If COMPLETED, show View Invoice */}
                                        {job.status === 'READY' ? (
                                            <button
                                                onClick={() => openGenerateModal(job.id)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded font-medium transition-colors"
                                            >
                                                Generate Invoice
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleViewInvoice(job)}
                                                className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded font-medium transition-colors border border-slate-600"
                                            >
                                                View Invoice
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invoice Detail Modal */}
            {viewModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-slate-900 p-8 rounded-xl w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setViewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">INVOICE</h3>
                            <p className="text-sm text-slate-500">#{selectedInvoice.id}</p>
                            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedInvoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedInvoice.status}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="font-medium text-slate-600">Parts Total</span>
                                <span className="font-bold">${selectedInvoice.parts_total}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="font-medium text-slate-600">Labor Cost</span>
                                <span className="font-bold">${selectedInvoice.labor_cost}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2">
                                <span className="font-bold text-slate-800">Grand Total</span>
                                <span className="font-bold text-blue-600">${selectedInvoice.grand_total}</span>
                            </div>
                        </div>

                        {selectedInvoice.status === 'UNPAID' && (
                            <button
                                onClick={handleMarkPaid}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-green-900/20"
                            >
                                Mark as PAID & Close Job
                            </button>
                        )}

                        {selectedInvoice.status === 'PAID' && (
                            <button
                                onClick={() => setViewModal(false)}
                                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-bold transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
            {/* Generate Invoice Modal */}
            {generateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-xl w-full max-w-sm border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-white">Generate Invoice</h3>
                        <form onSubmit={submitInvoiceGeneration} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Labor Cost ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                                    value={laborCost}
                                    onChange={(e) => setLaborCost(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setGenerateModal(false)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingManagement;
