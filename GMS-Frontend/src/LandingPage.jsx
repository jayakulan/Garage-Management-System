import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <span className="font-bold text-white text-lg">SD</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-100">Service Desk</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={(e) => scrollToSection(e, 'features')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">Features</button>
                            <button onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">How it Works</button>
                            <button onClick={(e) => scrollToSection(e, 'testimonials')} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium cursor-pointer bg-transparent border-none">Testimonials</button>
                            <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Login</Link>
                            <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                Sign Up
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-slate-300 hover:text-white focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button onClick={(e) => scrollToSection(e, 'features')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer bg-transparent border-none">Features</button>
                            <button onClick={(e) => scrollToSection(e, 'how-it-works')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer bg-transparent border-none">How it Works</button>
                            <button onClick={(e) => scrollToSection(e, 'testimonials')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer bg-transparent border-none">Testimonials</button>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Login</Link>
                            <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
                    <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide uppercase">
                        Streamline Your Garage Operations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Service Desk <br className="hidden md:block" /> Garage Management
                    </h1>
                    <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Effortlessly manage job cards, work orders, inventory, and billing.
                        Digitalize your workflow and deliver exceptional service to your customers.
                    </p>
                    

                    {/* Dashboard Preview Mockup */}
                    <div className="mt-20 relative mx-auto w-full max-w-5xl rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-2xl backdrop-blur-sm p-2">
                        <div className="rounded-lg overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-slate-700">
                            {/* Placeholder for dashboard screenshot */}
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <span className="text-lg font-medium opacity-40">Interactive Dashboard Interface</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to run your garage</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">From job card creation to final billing, we've got every step of your workflow covered.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Digital Job Cards', desc: 'Create and track job cards instantly. Move away from messy paper trails.', icon: '📋' },
                            { title: 'Inventory Management', desc: 'Track spare parts in real-time. Never run out of essential stock.', icon: '🔧' },
                            { title: 'Smart Billing', desc: 'Generate professional invoices with one click. Manage tax and discounts easily.', icon: '💰' },
                            { title: 'Customer History', desc: 'Access vehicle service history instantly to provide better recommendations.', icon: '👥' },
                            { title: 'Mechanic Assignment', desc: 'Efficiently allocate work to your staff based on expertise and availability.', icon: '👨‍🔧' },
                            { title: 'Analytics & Reports', desc: 'Get insights into your business performance with detailed reports.', icon: '📊' },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
                                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-slate-800/50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Get up and running in just a few simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Sign Up', desc: 'Create your account and configure your garage profile in minutes.' },
                            { step: '2', title: 'Add Services', desc: 'Define your services, pricing, and available time slots.' },
                            { step: '3', title: 'Manage Jobs', desc: 'Create job cards and track progress in real-time.' },
                            { step: '4', title: 'Get Paid', desc: 'Generate invoices and track payments effortlessly.' },
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                                {idx < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent transform -translate-y-1/2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Trusted by garage owners and mechanics across the country</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Rajesh Kumar',
                                role: 'Garage Owner',
                                text: 'AutoHub Pro transformed how we manage our operations. Job tracking is seamless and billing is accurate. Highly recommended!',
                                rating: 5,
                            },
                            {
                                name: 'Priya Singh',
                                role: 'Senior Mechanic',
                                text: 'The interface is intuitive and makes my daily work so much easier. I can focus on repairs instead of paperwork.',
                                rating: 5,
                            },
                            {
                                name: 'Ahmed Hassan',
                                role: 'Workshop Manager',
                                text: 'Inventory tracking has saved us thousands. We never run out of parts and waste is minimal. Great ROI!',
                                rating: 5,
                            },
                        ].map((testimonial, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border-y border-slate-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Garage?</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of garage owners who have streamlined their operations with AutoHub Pro</p>
                    <Link to="/signup" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold transition-all shadow-xl shadow-blue-900/20 hover:scale-105">
                        Start Your Free Trial Today
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <span className="font-bold text-white">A</span>
                                </div>
                                <span className="font-bold text-lg text-white">AutoHub Pro</span>
                            </div>
                            <p className="text-slate-500 text-sm">Revolutionizing garage management for the modern mechanic.</p>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-slate-500 hover:text-white transition-colors text-sm">Features</a></li>
                                <li><a href="#how-it-works" className="text-slate-500 hover:text-white transition-colors text-sm">How It Works</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Pricing</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Security</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">About Us</a></li>
                                <li><a href="#testimonials" className="text-slate-500 hover:text-white transition-colors text-sm">Testimonials</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Blog</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Careers</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Contact Support</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-500 text-sm">
                            © 2025 AutoHub Pro. All rights reserved. | Designed for garage owners, by garage professionals.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.45 10.009 10.009 0 01-2.8.856 4.958 4.958 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
