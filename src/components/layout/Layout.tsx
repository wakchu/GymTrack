import React from 'react';
import { Menu, Home, PlusCircle, Dumbbell, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'My Routines', path: '/' },
        { icon: PlusCircle, label: 'Create Routine', path: '/create' },
        // Add more as needed
    ];

    return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-background-dark z-10 border-b border-white/10">
                <div className="w-10">
                    {/* Placeholder for back button or menu if needed */}
                </div>
                <h1 className="text-lg font-bold uppercase tracking-widest">{title || 'Gym Tracker'}</h1>
                <div className="w-10 flex justify-end">
                    <button className="p-2">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#1E1E1E] border-r border-white/10 p-6 sticky top-0 h-screen">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-primary tracking-widest">GYM TRACKER</h1>
                </div>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
