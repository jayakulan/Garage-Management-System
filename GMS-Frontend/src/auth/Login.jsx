import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // Treating email as 'username' input
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            // Redirect based on role
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'MECHANIC') {
                navigate('/mechanic/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950 text-white">
            {/* Left Side - Brand Context */}
            <div className="hidden md:flex flex-col justify-between bg-slate-900 p-12 relative overflow-hidden text-white">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8 hover:scale-105 transition-transform">
                        <span className="font-bold text-white text-2xl">G</span>
                    </Link>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Welcome back to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">GarageFlow</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md">
                        Log in to access your dashboard, manage jobs, and keep your workshop running smoothly.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-slate-500 font-medium tracking-wide uppercase">
                    <span>Secure</span>
                    <span>•</span>
                    <span>Fast</span>
                    <span>•</span>
                    <span>Reliable</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                            <LogIn className="text-blue-500" /> Member Login
                        </h2>
                        <p className="mt-2 text-slate-400">Access your GarageFlow account</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input id="email" name="email" type="text" required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Username or Email" />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="password" name="password" type="password" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Password" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                                <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0" />
                                Remember me
                            </label>
                            <a href="#" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">Forgot password?</a>
                        </div>

                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5">
                            Sign In <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">Sign up now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
