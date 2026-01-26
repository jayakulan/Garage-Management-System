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
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation functions
    const validateUsername = (username) => {
        if (!username) return 'Username is required';
        if (username.length < 3) return 'Username must be at least 3 characters';
        if (username.length > 20) return 'Username must not exceed 20 characters';
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) return 'Username can only contain letters, numbers, underscores, and hyphens';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePhone = (phone) => {
        if (!phone) return 'Phone number is required';
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
        if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Real-time validation
        let error = '';
        if (name === 'username') error = validateUsername(value);
        else if (name === 'email') error = validateEmail(value);
        else if (name === 'phone') error = validatePhone(value);
        else if (name === 'password') {
            error = validatePassword(value);
            // Also check confirmPassword when password changes
            if (formData.confirmPassword) {
                const confirmError = validateConfirmPassword(formData.confirmPassword, value);
                setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        }
        else if (name === 'confirmPassword') error = validateConfirmPassword(value, formData.password);

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate all fields
        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
        const phoneError = validatePhone(formData.phone);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

        const newErrors = {
            username: usernameError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setErrors(newErrors);

        // Check if any errors exist
        if (Object.values(newErrors).some(err => err !== '')) {
            return;
        }

        try {
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData);
            navigate('/login');
        } catch (err) {
            setError('Signup failed. Please check your inputs.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950 text-white">
            {/* Left Side - Brand Awareness */}
            <div className="flex flex-col justify-between bg-slate-900 p-6 md:p-12 relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 md:mb-8 hover:scale-105 transition-transform">
                        <img src="/log.jpeg" alt="GarageFlow Logo" className="w-12 h-12 md:w-14 md:h-14 rounded-lg shadow-lg shadow-blue-500/30 object-cover border border-blue-500/50" />
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Future of Garage</span> <br />
                        Management
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-md">
                        Streamline your workflow, manage inventory, and delight customers with GarageFlow's all-in-one platform.
                    </p>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto md:min-h-screen">
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
                            {/* Username Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <UserCircle size={20} />
                                </div>
                                <input id="username" name="username" type="text" required
                                    value={formData.username} onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${
                                        errors.username ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                    }`}
                                    placeholder="Username" />
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${
                                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                    }`}
                                    placeholder="Email address" />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Phone size={20} />
                                </div>
                                <input id="phone" name="phone" type="text" required
                                    value={formData.phone} onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${
                                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                    }`}
                                    placeholder="Phone number" />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="password" name="password" type={showPassword ? "text" : "password"} required
                                    value={formData.password} onChange={handleChange}
                                    className={`block w-full pl-10 pr-12 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${
                                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                    }`}
                                    placeholder="Password" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-500 transition-colors"
                                >
                                    {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className={`block w-full pl-10 pr-12 py-3 bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 transition-all outline-none ${
                                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                                    }`}
                                    placeholder="Confirm Password" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-500 transition-colors"
                                >
                                    {/* {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5">
                            Create Account <ArrowRight size={18} />
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
