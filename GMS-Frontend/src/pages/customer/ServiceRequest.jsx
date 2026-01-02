import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ServiceRequest = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState({
        vehicle_reg_number: '',
        vehicle_model: '',
        reported_issues: ''
    });

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
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
                body: JSON.stringify({
                    ...request,
                    status: 'PENDING' // Explicitly set status to PENDING
                })
            });

            if (response.ok) {
                alert('Service Request Submitted Successfully!');
                navigate('/customer/dashboard'); // Redirect back to dashboard
            } else {
                const err = await response.json();
                alert('Failed to submit request: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 flex justify-center items-center">
            <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Request Service</h2>
                    <p className="text-slate-400">Fill in the details below to schedule a repair.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Registration Number</label>
                            <input
                                type="text"
                                name="vehicle_reg_number"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="ABC-1234"
                                value={request.vehicle_reg_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Model</label>
                            <input
                                type="text"
                                name="vehicle_model"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Toyota Corolla"
                                value={request.vehicle_model}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Issue / Service Required</label>
                        <textarea
                            name="reported_issues"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-32 transition-all resize-none"
                            placeholder="Describe the problem (e.g., Engine overheating, Oil change needed)..."
                            value={request.reported_issues}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/customer/dashboard')}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
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
