import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Please check your inputs.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900 text-white">
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex flex-col justify-center items-center bg-slate-800 p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-blue-600/20 z-0"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">Join GMS Today</h1>
                    <p className="text-slate-400">Start optimizing your garage workflow instantly.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold">Create Account</h2>
                        <p className="mt-2 text-slate-400">Get started with your free account</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">{error}</div>}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
                                <input id="username" name="username" type="text" required
                                    value={formData.username} onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="johndoe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
                                <input id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Phone</label>
                                <input id="phone" name="phone" type="text"
                                    value={formData.phone} onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="+1234567890" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                                <input id="password" name="password" type="password" required
                                    value={formData.password} onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="••••••••" />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-slate-300">Role</label>
                                <select id="role" name="role"
                                    value={formData.role} onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white transition-all outline-none">
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="MECHANIC">Mechanic</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]">
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
