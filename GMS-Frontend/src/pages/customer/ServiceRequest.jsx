import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const ServiceRequest = ({ onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    // In standalone page mode, if onSuccess/onCancel are not props, define defaults
    const handleSuccess = onSuccess || (() => navigate('/customer/dashboard'));
    const handleCancel = onCancel || (() => navigate('/customer/dashboard'));

    const [request, setRequest] = useState({
        vehicle_reg_number: '',
        vehicle_model: '',
        reported_issues: ''
    });

    const handleChange = (e) => setRequest({ ...request, [e.target.name]: e.target.value });

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast({ message: '', type: '', visible: false });
        }, 3000);
    };

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
                showToast('Service request submitted successfully!', 'success');
                setTimeout(() => {
                    handleSuccess();
                }, 1500);
            } else {
                const err = await response.json();
                showToast(`Failed: ${err.detail || 'Please try again'}`, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Something went wrong. Please try again.', 'error');
        }
    };

    return (
        <div className="text-white">
            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className={`p-4 rounded-lg flex items-center gap-3 shadow-lg ${
                        toast.type === 'success' 
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

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-white">New Service Request</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Reg. Number</label>
                            <input
                                type="text"
                                name="vehicle_reg_number"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                                value={request.vehicle_reg_number}
                                onChange={handleChange}
                                placeholder="ABC-1234"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Model</label>
                            <input
                                type="text"
                                name="vehicle_model"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                                value={request.vehicle_model}
                                onChange={handleChange}
                                placeholder="Toyota Corolla"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Issue Description</label>
                        <textarea
                            name="reported_issues"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-32 resize-none"
                            value={request.reported_issues}
                            onChange={handleChange}
                            placeholder="Describe the issue..."
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors text-white"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceRequest;
