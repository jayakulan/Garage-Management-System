import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardCheck,
    Wrench,
    CreditCard,
    History,
    Users,
    BarChart3,
    Menu,
    X,
    ChevronRight,
    Github,
    Twitter,
    Linkedin,
    Mail,
    Car,
    Quote
} from 'lucide-react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="font-bold text-white text-lg">G</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-100">GarageFlow</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={(e) => scrollToSection(e, 'features')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">Features</button>
                            <button onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">How it Works</button>
                            <button onClick={(e) => scrollToSection(e, 'testimonials')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">Testimonials</button>
                            <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Login</Link>
                            <Link to="/signup" className="group relative px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all overflow-hidden">
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-slate-800 transition-colors">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top-4 duration-200">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Features</a>
                            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">How it Works</a>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Login</Link>
                            <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-grow" style={{ backgroundImage: 'url(/1111.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll' }}>
                <div className="absolute inset-0 bg-slate-800/80 z-0"></div>
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-blob"></div>
                    <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Streamline Your Garage Operations
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400">
                            Next Gen Garage
                        </span>
                        <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Management System
                        </span>
                    </h1>

                    <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Effortlessly manage job cards, work orders, inventory, and billing.
                        Digitalize your workflow and deliver exceptional service to your customers.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/30 flex items-center justify-center gap-2 group">
                            Start Free Trial
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                    </div>
                </div>
            </section>

            

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-950 relative border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to run your garage</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">From job card creation to final billing, we've got every step of your workflow covered with precision.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Digital Job Cards', desc: 'Create and track job cards instantly. Move away from messy paper trails.', icon: ClipboardCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { title: 'Inventory Control', desc: 'Track spare parts in real-time. Never run out of essential stock.', icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { title: 'Smart Billing', desc: 'Generate professional invoices with one click. Manage tax and discounts.', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { title: 'Service History', desc: 'Access vehicle service history instantly to provide better recommendations.', icon: History, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            { title: 'Mechanic Management', desc: 'Efficiently allocate work to your staff based on expertise and availability.', icon: Users, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                            { title: 'Analytics & Reports', desc: 'Get insights into your business performance with detailed revenue reports.', icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-900/10 group cursor-default relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed relative z-10">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section - Moved Out of Hero */}
            <section id="how-it-works" className="py-24 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How GarageFlow Works</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">A simple, streamlined process to get your workshop running efficiently.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto relative px-4">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-slate-700 to-blue-500/0 -translate-y-1/2 pointer-events-none"></div>

                        {[
                            { step: '01', title: 'Vehicle Entry', desc: 'Scan & register incoming jobs instantly.', icon: Car },
                            { step: '02', title: 'Diagnostics', desc: 'Assign mechanics and inspect issues.', icon: Wrench },
                            { step: '03', title: 'Repair & Parts', desc: 'Manage inventory usage in real-time.', icon: ClipboardCheck },
                            { step: '04', title: 'Billing & Exit', desc: 'Generate auto-invoices & gate passes.', icon: CreditCard }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl relative z-10 hover:-translate-y-2 transition-transform duration-300 hover:border-blue-500/30 shadow-2xl h-full">
                                    <div className="text-4xl font-bold text-slate-800/80 group-hover:text-blue-500/10 transition-colors absolute top-4 right-4 select-none font-mono">{item.step}</div>
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 group-hover:border-blue-500/50 transition-all shadow-lg">
                                        <item.icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-slate-950 relative border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Mechanic Shops</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">See what garage owners are saying about GarageFlow.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Alex Johnson', role: 'Owner, Speedy Auto', text: 'GarageFlow transformed our daily operations. We save 2 hours every day on paperwork alone!' },
                            { name: 'Maria Garcia', role: 'Manager, City Motors', text: 'The inventory tracking is a lifesaver. No more missing parts or billing errors.' },
                            { name: 'David Smith', role: 'Lead Mechanic, FixIt Bros', text: 'Super easy to use. I can check my assigned jobs and update status right from my phone.' }
                        ].map((t, i) => (
                            <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 relative">
                                <Quote className="absolute top-8 right-8 text-blue-500/20" size={48} />
                                <p className="text-slate-300 mb-6 italic relative z-10">"{t.text}"</p>
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-blue-400 text-sm">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer - Stylish & Neat */}
            <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <span className="font-bold text-white text-lg">G</span>
                                </div>
                                <span className="font-bold text-2xl text-slate-100">GarageFlow</span>
                            </div>
                            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                                The ultimate solution for modern workshops. Streamline operations, boost efficiency, and grow your business with our all-in-one platform.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all">
                                    <Github size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Testimonials</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">API Documentation</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-6">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-400">
                                    <Mail size={20} className="text-blue-400 shrink-0" />
                                    <span>support@gms.com</span>
                                </li>
                                <li className="text-slate-400">
                                    123 Innovation Dr,<br />
                                    Tech City, TC 90210
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2025 GarageFlow. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
