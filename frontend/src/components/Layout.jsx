import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import Clock from './Clock';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen text-light-textPrimary dark:text-dark-textPrimary bg-transparent">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="glass rounded-none border-x-0 border-t-0 h-20 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-light-textSecondary dark:text-dark-textSecondary hover:text-light-primary dark:hover:text-dark-primary p-2 -ml-2 rounded-md transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="ml-2 sm:ml-4 text-lg sm:text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary lg:hidden truncate max-w-[120px] sm:max-w-none">ExpenseTracker</h1>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <div className="bg-light-bg dark:bg-dark-bg px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border border-light-border dark:border-dark-border text-xs sm:text-sm font-medium shadow-sm">
                            <Clock />
                        </div>
                    </div>
                </header>

                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 p-4 lg:p-8 overflow-x-hidden relative z-10"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
};

export default Layout;
