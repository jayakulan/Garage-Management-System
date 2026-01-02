import React from 'react';
import { LogOut, User } from 'lucide-react';

const SidebarLayout = ({ title, user, menuItems, activeTab, onTabChange, onLogout, children }) => {
    return (
        <div className="min-h-screen bg-slate-900 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white text-lg">{title ? title.charAt(0) : 'G'}</span>
                        </div>
                        <span className="font-bold text-xl text-slate-100">{title || 'GMS'}</span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {Icon && <Icon size={18} />}
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header / Overlay would go here in a full responsiveness implementation */}

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize">
                            {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Welcome back, {user?.username}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-slate-400">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">
                            {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
