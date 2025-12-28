import React, { useState } from 'react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <span className="font-bold text-white text-lg">G</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-100">GMS</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium">Features</a>
                            <a href="#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium">How it Works</a>
                            <a href="#testimonials" className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium">Testimonials</a>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                Get Started
                            </button>
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
                            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Features</a>
                            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">How it Works</a>
                            <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
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
                        Next Gen Garage <br className="hidden md:block" /> Management System
                    </h1>
                    <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Effortlessly manage job cards, work orders, inventory, and billing.
                        Digitalize your workflow and deliver exceptional service to your customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-105">
                            Start Free Trial
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-slate-200 transition-all hover:scale-105 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Watch Demo
                        </button>
                    </div>

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

            {/* Footer */}
            <footer className="bg-slate-950 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white text-xs">G</span>
                        </div>
                        <span className="font-bold text-lg text-slate-200">GMS</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2025 Garage Management System. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
