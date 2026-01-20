import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Save } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedUser = await response.json();
            setSuccess('Profile updated successfully!');

            // Call the onSave callback to update the parent component
            if (onSave) {
                onSave(updatedUser);
            }

            // Close modal after 1.5 seconds
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 1500);

        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <p className="text-sm text-slate-400">Update your personal information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Success Message */}
                    {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="w-5 h-5 text-slate-500" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Address
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Enter address"
                            />
                        </div>
                    </div>

                    {/* Role (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Role
                        </label>
                        <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400">
                            {user?.role}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
