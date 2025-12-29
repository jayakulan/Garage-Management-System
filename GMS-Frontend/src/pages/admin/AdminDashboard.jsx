import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
            </div>
            <p>Welcome, {user?.username} (Admin)</p>
            {/* Admin specific content here */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-800 p-6 rounded-lg">Manage Users</div>
                <div className="bg-slate-800 p-6 rounded-lg">Overview Stats</div>
                <div className="bg-slate-800 p-6 rounded-lg">System Settings</div>
            </div>
        </div>
    );
};

export default AdminDashboard;
