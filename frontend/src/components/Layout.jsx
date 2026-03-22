import { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import Clock from './Clock';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex min-h-screen text-light-textPrimary dark:text-dark-textPrimary bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-100 dark:from-gray-950 dark:via-black dark:to-neutral-950 relative overflow-hidden transition-colors duration-300 z-0">
            {/* Ambient Background Blobs for Premium Glass Effect */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-900/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 dark:bg-purple-900/10 blur-[120px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300 relative z-10">
                {/* Header */}
                <header className="glass rounded-none border-x-0 border-t-0 h-20 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button
                            aria-label="Open sidebar"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-light-textSecondary dark:text-dark-textSecondary hover:text-light-primary dark:hover:text-dark-primary p-2 -ml-2 rounded-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary flex-shrink-0"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="ml-1 sm:ml-4 text-sm sm:text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary lg:hidden truncate max-w-[100px] sm:max-w-none">ExpenseTracker</h1>
                    </div>

                    <div className="ml-auto flex items-center gap-1 sm:gap-4 flex-shrink-0">
                        <ThemeToggle />
                        <div className="px-1 sm:px-2 py-1 flex-shrink-0 overflow-hidden max-w-full">
                            <Clock />
                        </div>
                    </div>
                </header>

                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 p-4 lg:p-8 overflow-x-hidden relative z-10 pb-[180px] lg:pb-8"
                >
                    {children}
                </motion.main>

                {/* Footer — hidden on mobile to give the bottom nav breathing room */}
                <footer className="hidden lg:block py-4 text-center text-sm text-light-textSecondary dark:text-dark-textSecondary relative z-10 mt-auto">
                    &copy; 2026 Mathi | Built with ❤️ using React
                </footer>

                {/* Mobile bottom navigation */}
                <BottomNav />
            </div>
        </div>
    );
};

export default Layout;
