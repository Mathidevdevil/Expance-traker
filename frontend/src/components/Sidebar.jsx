import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingDown, TrendingUp, User, LogOut, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { useEffect } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    }, [location.pathname]);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/incomes', label: 'Incomes', icon: TrendingUp },
        { path: '/expenses', label: 'Expenses', icon: TrendingDown },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={clsx(
                "flex flex-col w-64 h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white fixed left-0 top-0 z-50 transition-transform duration-300 transform lg:translate-x-0 border-r border-slate-200 dark:border-slate-800",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-800 px-4">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">FinTracker</h1>
                    <button onClick={onClose} className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 flex flex-col flex-1 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shrink-0 text-white">
                            {user ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{user ? user.name : 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user ? user.email : ''}</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                        isActive(item.path)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    )}
                                >
                                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors w-full text-left mt-4"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
                        </button>
                    </nav>

                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-300 transition-colors mt-auto"
                    >
                        <LogOut className="w-5 h-5 mr-3 shrink-0" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
