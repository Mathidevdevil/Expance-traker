import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useGlobalContext } from '../context/GlobalContext';
import { currencyFormat } from '../utils/formatCurrency';

/* ---------- Bottom Navigation Bar (Floating Pill Design) ---------- */
const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { totalBalance, hardCashBalance, onlineBalance } = useGlobalContext();

    return (
        <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none gap-3 px-4 pb-safe">
            
            {/* Financial Totals Strip */}
            <div className="pointer-events-auto w-full bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-3xl px-5 py-3.5 flex justify-between items-center shadow-xl">
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] uppercase text-light-textSecondary dark:text-[#8E8E93] font-bold tracking-wider mb-0.5">Total</span>
                    <span className="text-sm text-light-primary dark:text-dark-primary font-black flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{currencyFormat(totalBalance || 0)}
                    </span>
                </div>
                <div className="w-px h-7 bg-black/10 dark:bg-white/10" />
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] uppercase text-amber-600 dark:text-amber-500 font-bold tracking-wider mb-0.5">Case</span>
                    <span className="text-sm text-amber-600 dark:text-amber-400 font-black flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{currencyFormat(hardCashBalance || 0)}
                    </span>
                </div>
                <div className="w-px h-7 bg-black/10 dark:bg-white/10" />
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] uppercase text-violet-600 dark:text-violet-500 font-bold tracking-wider mb-0.5">Online</span>
                    <span className="text-sm text-violet-600 dark:text-violet-400 font-black flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{currencyFormat(onlineBalance || 0)}
                    </span>
                </div>
            </div>

            {/* Segmented Floating Nav */}
            <div className="pointer-events-auto w-full flex justify-between items-center gap-3 h-[60px]">
                {/* Left Circle: Dashboard */}
                <Link
                    to="/"
                    className={clsx(
                        "w-[60px] h-[60px] rounded-full flex items-center justify-center backdrop-blur-3xl shadow-xl transition-all border border-black/5 dark:border-white/10",
                        isActive('/') 
                            ? "bg-light-primary dark:bg-dark-primary text-white dark:text-black" 
                            : "bg-white/90 dark:bg-[#1C1C1E]/90 text-light-textSecondary dark:text-[#8E8E93] hover:text-light-textPrimary dark:hover:text-white"
                    )}
                >
                    <LayoutDashboard className="w-6 h-6" />
                </Link>

                {/* Middle Pill: Incomes & Expenses */}
                <div className="flex-1 h-full bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-3xl rounded-full shadow-xl p-1.5 flex items-center relative border border-black/5 dark:border-white/10">
                     <Link to="/incomes" className="flex-1 h-full relative flex items-center justify-center z-10 w-full rounded-full">
                        {isActive('/incomes') && (
                            <motion.div 
                                layoutId="nav-pill" 
                                className="absolute inset-0 bg-black/5 dark:bg-[#3A3A3C] rounded-full shadow-sm border border-black/5 dark:border-white/5" 
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }} 
                            />
                        )}
                        <span className={clsx("relative z-20 text-[15px] font-bold transition-colors", isActive('/incomes') ? "text-light-textPrimary dark:text-white" : "text-light-textSecondary dark:text-[#8E8E93]")}>
                            Incomes
                        </span>
                     </Link>
                     <Link to="/expenses" className="flex-1 h-full relative flex items-center justify-center z-10 w-full rounded-full">
                        {isActive('/expenses') && (
                            <motion.div 
                                layoutId="nav-pill" 
                                className="absolute inset-0 bg-black/5 dark:bg-[#3A3A3C] rounded-full shadow-sm border border-black/5 dark:border-white/5" 
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }} 
                            />
                        )}
                        <span className={clsx("relative z-20 text-[15px] font-bold transition-colors", isActive('/expenses') ? "text-light-textPrimary dark:text-white" : "text-light-textSecondary dark:text-[#8E8E93]")}>
                            Expenses
                        </span>
                     </Link>
                </div>

                {/* Right Circle: Profile */}
                <Link
                    to="/profile"
                    className={clsx(
                         "w-[60px] h-[60px] rounded-full flex items-center justify-center backdrop-blur-3xl shadow-xl transition-all border border-black/5 dark:border-white/10",
                        isActive('/profile') 
                            ? "bg-light-primary dark:bg-dark-primary text-white dark:text-black" 
                            : "bg-white/90 dark:bg-[#1C1C1E]/90 text-light-textSecondary dark:text-[#8E8E93] hover:text-light-textPrimary dark:hover:text-white"
                    )}
                >
                    <User className="w-6 h-6" />
                </Link>
            </div>
            
        </div>
    );
};

export default BottomNav;
