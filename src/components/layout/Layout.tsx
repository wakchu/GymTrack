import React from 'react';
import { Home, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/StoInAllenamento_Logo.png';

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
        <div className="min-h-screen bg-background-dark text-white flex flex-col relative pb-24">
            {/* Top Logo */}
            <div className="flex justify-center pt-8 pb-4 z-20">
                <img src={Logo} alt="StoInAllenamento Logo" className="w-96 h-auto object-contain drop-shadow-2xl" />
            </div>

            {/* Main Content */}
            <main className="p-4 md:p-8 max-w-4xl mx-auto w-full flex-1">
                {title && (
                    <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
                )}
                {children}
            </main>

            {/* Floating Switcher */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <nav className="flex items-center gap-2 bg-[#1E1E1E]/90 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-3 rounded-full transition-all duration-300 group relative flex items-center justify-center ${isActive
                                    ? 'bg-primary text-white shadow-lg scale-110'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                {isActive && (
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
