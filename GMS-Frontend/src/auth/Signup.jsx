import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Wrench, ArrowRight, Mail, Lock, Phone, UserCircle, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Invalid email format";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData);
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Please check your inputs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950 text-white">
            {/* Left Side - Brand Awareness */}
            <div className="hidden md:flex flex-col justify-between bg-slate-900 p-12 relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8">
                        <span className="font-bold text-white text-2xl">G</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Future of Garage</span> <br />
                        Management
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md">
                        Streamline your workflow, manage inventory, and delight customers with GarageFlow's all-in-one platform.
                    </p>
                </div>


            </div>

            {/* Right Side - Signup Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white">Get Started</h2>
                        <p className="mt-2 text-slate-400">Create your new account</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* Role Selection - Styled */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('CUSTOMER')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'CUSTOMER' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800'}`}
                            >
                                <User size={24} />
                                <span className="font-medium text-sm">Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('MECHANIC')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'MECHANIC' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800'}`}
                            >
                                <Wrench size={24} />
                                <span className="font-medium text-sm">Mechanic</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <UserCircle size={20} />
                                </div>
                                <input id="username" name="username" type="text" required
                                    value={formData.username} onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Username" />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Email address" />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Phone size={20} />
                                </div>
                                <input id="phone" name="phone" type="text"
                                    value={formData.phone} onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Phone number" />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="password" name="password" type={showPassword ? "text" : "password"} required
                                    value={formData.password} onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder-slate-600 transition-all outline-none"
                                    placeholder="Confirm Password" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors">
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
