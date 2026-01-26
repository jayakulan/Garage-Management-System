import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, LogIn, Eye, EyeOff, X, Check } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    // Email validation
    const validateEmail = (emailValue) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_.-]+$/;
        if (!emailValue) {
            setEmailError('Email or username is required');
            return false;
        } else if (!emailRegex.test(emailValue)) {
            setEmailError('Please enter a valid email or username');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    // Password validation
    const validatePassword = (passwordValue) => {
        if (!passwordValue) {
            setPasswordError('Password is required');
            return false;
        } else if (passwordValue.length < 4) {
            setPasswordError('Password must be at least 4 characters');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value) validateEmail(value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value) validatePassword(value);
    };

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast({ message: '', type: '', visible: false });
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate both fields
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setLoading(true);

        try {
            const user = await login(email, password);
            showToast('Login successful! Redirecting...', 'success');
            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'MECHANIC') {
                    navigate('/mechanic/dashboard');
                } else {
                    navigate('/customer/dashboard');
                }
            }, 500);
        } catch (err) {
            setError('Invalid credentials');
            showToast('Invalid email/username or password', 'error');
            console.error(err);
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        if (!forgotEmail) {
            setForgotError('Please enter your email');
            return;
        }

        if (!validateEmail(forgotEmail)) {
            setForgotError('Please enter a valid email');
            return;
        }

        try {
            // Simulate API call - replace with actual endpoint
            console.log('Reset password link sent to:', forgotEmail);
            setForgotSuccess('Password reset link sent to your email');
            showToast('Reset link sent! Check your email', 'success');
            setForgotEmail('');
            setTimeout(() => {
                setShowForgotModal(false);
            }, 2000);
        } catch (err) {
            setForgotError('Failed to send reset link. Please try again.');
            showToast('Failed to send reset link', 'error');
            console.error(err);
        }
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setForgotEmail('');
        setForgotError('');
        setForgotSuccess('');
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950 text-white">
            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className={`p-4 rounded-lg flex items-center gap-3 shadow-lg ${toast.type === 'success'
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

            {/* Left Side - Brand Context */}
            <div className="flex flex-col justify-between bg-slate-900 p-6 md:p-12 relative overflow-hidden text-white">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 md:mb-8 hover:scale-105 transition-transform">
                        <img src="/log.jpeg" alt="GarageFlow Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-lg shadow-lg shadow-blue-500/30 object-cover border border-blue-500/50" />
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                        Welcome back to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">GarageFlow</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-md">
                        Log in to access your dashboard, manage jobs, and keep your workshop running smoothly.
                    </p>
                </div>

                <div className="relative z-10 flex gap-4 text-xs md:text-sm text-slate-500 font-medium tracking-wide uppercase">
                    <span>Secure</span>
                    <span>•</span>
                    <span>Fast</span>
                    <span>•</span>
                    <span>Reliable</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 md:min-h-screen">
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
                            {/* Email Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input id="email" name="email" type="text" required
                                    value={email} onChange={handleEmailChange}
                                    className={`block w-full pl-10 pr-3 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                        }`}
                                    placeholder="Username or Email" />
                                {emailError && (
                                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="password" name="password" type={showPassword ? "text" : "password"} required
                                    value={password} onChange={handlePasswordChange}
                                    className={`block w-full pl-10 pr-12 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                        }`}
                                    placeholder="Password" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-500 transition-colors"
                                >
                                    {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                                </button>
                                {passwordError && (
                                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                                <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0" />
                                Remember me
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgotModal(true)}
                                className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all bg-transparent border-none cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing In...
                                </span>
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">Sign up now</Link>
                    </p>

                    {/* Forgot Password Modal */}
                    {showForgotModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800 animate-in fade-in zoom-in duration-200">
                                <div className="p-8">
                                    {/* Close Button */}
                                    <button
                                        onClick={closeForgotModal}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>

                                    <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>

                                    {forgotSuccess && (
                                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2 mb-4 animate-in fade-in">
                                            <Check size={18} />
                                            {forgotSuccess}
                                        </div>
                                    )}

                                    {forgotError && (
                                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 mb-4 animate-in fade-in">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {forgotError}
                                        </div>
                                    )}

                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeForgotModal}
                                                className="flex-1 py-2 px-4 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors font-medium"
                                            >
                                                Send Reset Link
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
