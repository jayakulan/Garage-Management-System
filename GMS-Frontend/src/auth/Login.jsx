import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900 text-white">
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex flex-col justify-center items-center bg-slate-800 p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-slate-400">Manage your garage efficiently with GMS.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold">Login</h2>
                        <p className="mt-2 text-slate-400">Please sign in to your account</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">{error}</div>}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email or Username</label>
                                <input id="email" name="email" type="text" required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="Enter your email or username" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                                <input id="password" name="password" type="password" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-slate-700 border-none" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]">
                            Sign in
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
