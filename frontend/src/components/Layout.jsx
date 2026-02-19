import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

import Clock from './Clock';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sticky top-0 z-30 transition-colors duration-300">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="ml-4 text-xl font-bold text-slate-800 dark:text-white lg:hidden">FinTracker</h1>
                    </div>

                    <div className="ml-auto">
                        <Clock />
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
