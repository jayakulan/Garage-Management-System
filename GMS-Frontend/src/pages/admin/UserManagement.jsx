import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const { user } = useAuth(); // Current logged in user
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'MECHANIC', // Default to Mechanic as admin likely adds these
        phone: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.results || data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setShowModal(false);
                fetchUsers();
                setNewUser({ username: '', email: '', password: '', role: 'MECHANIC', phone: '' });
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User & Mechanic Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    + Add New User
                </button>
            </div>

            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th className="p-4 border-b border-slate-700">Username</th>
                            <th className="p-4 border-b border-slate-700">Email</th>
                            <th className="p-4 border-b border-slate-700">Role</th>
                            <th className="p-4 border-b border-slate-700">Status</th>
                            <th className="p-4 border-b border-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 border-b border-slate-700 font-medium">{u.username}</td>
                                <td className="p-4 border-b border-slate-700 text-slate-400">{u.email}</td>
                                <td className="p-4 border-b border-slate-700">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                                        ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                                            u.role === 'MECHANIC' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-green-500/20 text-green-400'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4 border-b border-slate-700">
                                    <span className="text-green-400 text-sm">Active</span>
                                </td>
                                <td className="p-4 border-b border-slate-700">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">Add New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input
                                type="text" placeholder="Username" required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                                value={newUser.username}
                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            />
                            <input
                                type="email" placeholder="Email" required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <input
                                type="password" placeholder="Password" required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="MECHANIC">Mechanic</option>
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <input
                                type="text" placeholder="Phone"
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none"
                                value={newUser.phone}
                                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                            />
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
