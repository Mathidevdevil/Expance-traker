import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingDown, TrendingUp, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

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
        { path: '/incomes', label: 'Incomes', icon: TrendingUp, color: '#10B981' },
        { path: '/expenses', label: 'Expenses', icon: TrendingDown, color: '#F43F5E' },
        { path: '/profile', label: 'Profile', icon: User, color: '#3B82F6' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={clsx(
                "flex flex-col w-64 h-screen glass rounded-none border-y-0 border-l-0 border-r border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary fixed left-0 top-0 z-50 transition-transform duration-300 transform lg:translate-x-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-center h-20 border-b border-light-border dark:border-dark-border px-4">
                    <h1 className="text-xl font-bold text-light-primary dark:text-dark-primary">
                        ExpenseTracker
                    </h1>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="lg:hidden text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:bg-black/10 dark:hover:bg-white/10 p-1.5 rounded-full transition-colors absolute right-4"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border flex items-center justify-center text-xl font-bold shrink-0 text-light-primary dark:text-dark-primary shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-light-textPrimary dark:text-dark-textPrimary">{user?.name ? user.name : 'User'}</p>
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary truncate">{user?.email ? user.email : ''}</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            let activeIconColor = item.color;

                            return (
                                <motion.div key={item.path} whileHover={{ x: 6 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                                    <Link
                                        to={item.path}
                                        className={clsx(
                                            'flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200',
                                            isActive(item.path)
                                                ? 'bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary font-bold shadow-sm'
                                                : 'text-light-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-white/20 dark:hover:border-white/10 hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:shadow-sm'
                                        )}
                                    >
                                        <Icon
                                            className="w-5 h-5 mr-3 shrink-0 transition-colors duration-200"
                                            style={{ color: isActive(item.path) ? activeIconColor : 'inherit' }}
                                        />
                                        {item.label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsLogoutConfirmOpen(true)}
                        className="flex items-center px-4 py-3.5 text-sm font-medium text-light-expense dark:text-dark-expense rounded-xl hover:text-red-600 dark:hover:text-red-400 transition-colors mt-auto border border-transparent hover:border-light-expense/30 dark:hover:border-dark-expense/30"
                    >
                        <LogOut className="w-5 h-5 mr-3 shrink-0" />
                        Sign Out
                    </motion.button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={logout}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                cancelText="Cancel"
                isDestructive={true}
            />
        </>
    );
};

export default Sidebar;

