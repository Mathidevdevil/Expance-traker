import { useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import CategoryChart from '../components/CategoryChart';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, History } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';

const Dashboard = () => {
    const { totalExpense, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();
    const { user } = useAuth();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    // Helper for History
    const history = [...incomes, ...expenses]
        .filter(t => t.date && !isNaN(new Date(t.date).getTime()))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2"
                >
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-light-textSecondary dark:text-dark-textSecondary"
                >
                    Here's what's happening with your finances today.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Balance */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                        <Wallet className="w-24 h-24 text-light-primary dark:text-dark-primary" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-light-primary/10 dark:bg-dark-primary/20 flex items-center justify-center text-light-primary dark:text-dark-primary border border-light-primary/20 dark:border-dark-primary/30">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Balance</h2>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-primary dark:text-dark-primary relative z-10">
                        ₹<AnimatedCounter value={totalBalance || 0} />
                    </p>
                </GlassCard>

                {/* Total Income */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-24 h-24 text-light-income dark:text-dark-income" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-light-income/10 dark:bg-dark-income/20 flex items-center justify-center text-light-income dark:text-dark-income border border-light-income/20 dark:border-dark-income/30">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Income</h2>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-income dark:text-dark-income relative z-10">
                        ₹<AnimatedCounter value={totalIncome || 0} />
                    </p>
                </GlassCard>

                {/* Total Expense */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-24 h-24 text-light-expense dark:text-dark-expense" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-light-expense/10 dark:bg-dark-expense/20 flex items-center justify-center text-light-expense dark:text-dark-expense border border-light-expense/20 dark:border-dark-expense/30">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Expense</h2>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-expense dark:text-dark-expense relative z-10">
                        ₹<AnimatedCounter value={totalExpense || 0} />
                    </p>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary mb-6">Income vs Expense</h3>
                    <div className="flex-1 w-full h-[300px]">
                        <Chart />
                    </div>
                </GlassCard>

                <div className="space-y-6">
                    <GlassCard>
                        <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary mb-6">Expense Categories</h3>
                        <div className="w-full h-[250px]">
                            <CategoryChart />
                        </div>
                    </GlassCard>

                    <GlassCard className="flex flex-col h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary flex items-center">
                                <History className="w-5 h-5 mr-2 text-light-primary dark:text-dark-primary" />
                                Recent History
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {history.length > 0 ? (
                                history.map((item, index) => {
                                    const { _id, title, description, amount, type } = item;
                                    const isIncome = type === 'income';
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            key={_id}
                                            className={`p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-4 gap-2 ${isIncome ? 'border-l-light-income dark:border-l-dark-income' : 'border-l-light-expense dark:border-l-dark-expense'
                                                }`}
                                        >
                                            <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary truncate mr-0 sm:mr-4">
                                                {title || description}
                                            </p>
                                            <p className={`font-bold shrink-0 self-end sm:self-auto ${isIncome ? 'text-light-income dark:text-dark-income' : 'text-light-expense dark:text-dark-expense'}`}>
                                                {isIncome ? '+' : '-'}{currencyFormat(amount)}
                                            </p>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm text-center py-4">No recent history.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
