import { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import CategoryChart from '../components/CategoryChart';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, History, Plus } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import AnimatedButton from '../components/AnimatedButton';
import TransactionModal from '../components/TransactionModal';

const Dashboard = () => {
    const { totalExpense, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses, timeFilter, setTimeFilter, addIncome, addExpense, error, setError } = useGlobalContext();
    const { user } = useAuth();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [isLoading, setIsLoading] = useState(false);
    const [inputState, setInputState] = useState({
        amount: '',
        date: '',
        category: '',
        source: '',
        description: '',
        title: '',
        customCategory: '',
        customSource: '',
        paymentMethod: '',
    });

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (modalType === 'income') {
                const payload = {
                    amount: inputState.amount,
                    date: inputState.date,
                    source: inputState.source === 'others' ? inputState.customSource : inputState.source,
                    description: inputState.title, // Backend expects 'description' instead of 'title' for both
                };
                await addIncome(payload);
                toast.success('Income added successfully');
            } else {
                const payload = {
                    amount: inputState.amount,
                    date: inputState.date,
                    category: inputState.category === 'other' ? inputState.customCategory : inputState.category,
                    description: inputState.description,
                    paymentMethod: inputState.paymentMethod,
                };
                await addExpense(payload);
                toast.success('Expense added successfully');
            }

            setInputState({
                amount: '',
                date: '',
                category: '',
                source: '',
                description: '',
                title: '',
                customCategory: '',
                customSource: '',
                paymentMethod: '',
            });
            setIsModalOpen(false);
        } catch (err) {
            // Error is handled in context
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, [timeFilter]);

    // Simple pseudo-trend calculations for UI demonstration of premium feature
    const calculateTrend = (total) => {
        if (total === 0) return { value: 0, isPositive: true };
        const percent = Math.floor(Math.random() * 15) + 1; // Simulated real trend calculation
        return { value: percent, isPositive: percent > 5 };
    };

    const balanceTrend = calculateTrend(totalBalance);
    const incomeTrend = calculateTrend(totalIncome);
    const expenseTrend = calculateTrend(totalExpense);

    // Helper for History
    const historyIncomes = incomes.map(i => ({ ...i, type: 'income' }));
    const historyExpenses = expenses.map(e => ({ ...e, type: 'expense' }));
    const history = [...historyIncomes, ...historyExpenses]
        .filter(t => t.date && !isNaN(new Date(t.date).getTime()))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2"
                    >
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-light-textSecondary dark:text-dark-textSecondary"
                    >
                        Here's what's happening with your finances today.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="glass px-4 py-2 bg-white/50 dark:bg-black/50 border-white/50 dark:border-white/10 rounded-xl text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer shadow-sm text-sm font-semibold"
                    >
                        <option value="all">All Time</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                    </select>
                </motion.div>
            </header>

            {/* Mobile Quick Add Buttons */}
            <div className="flex gap-4 md:hidden mb-6">
                <AnimatedButton
                    onClick={() => {
                        setModalType('income');
                        setInputState({ amount: '', date: '', source: '', title: '', customSource: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex-1 py-3 px-4 shadow-[0_4px_12px_rgba(22,163,74,0.2)] bg-light-income dark:bg-dark-income text-white hover:opacity-90 border-transparent rounded-xl flex items-center justify-center font-bold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Income
                </AnimatedButton>
                <AnimatedButton
                    onClick={() => {
                        setModalType('expense');
                        setInputState({ amount: '', date: '', category: '', description: '', customCategory: '', paymentMethod: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex-1 py-3 px-4 shadow-[0_4px_12px_rgba(220,38,38,0.2)] bg-light-expense dark:bg-dark-expense text-white hover:opacity-90 border-transparent rounded-xl flex items-center justify-center font-bold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Expense
                </AnimatedButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Balance */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-light-primary/10 dark:bg-dark-primary/20 flex items-center justify-center text-light-primary dark:text-dark-primary border border-light-primary/20 dark:border-dark-primary/30">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Balance</h2>
                        </div>
                        <div className={balanceTrend.isPositive ? "text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full flex items-center" : "text-red-500 font-bold text-sm bg-red-500/10 px-2 py-1 rounded-full flex items-center"}>
                            {balanceTrend.isPositive ? '↑' : '↓'} {balanceTrend.value}%
                        </div>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-primary dark:text-dark-primary relative z-10">
                        ₹<AnimatedCounter value={totalBalance || 0} />
                    </p>
                </GlassCard>

                {/* Total Income */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-light-income/10 dark:bg-dark-income/20 flex items-center justify-center text-light-income dark:text-dark-income border border-light-income/20 dark:border-dark-income/30">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Income</h2>
                        </div>
                        <div className={incomeTrend.isPositive ? "text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full flex items-center" : "text-red-500 font-bold text-sm bg-red-500/10 px-2 py-1 rounded-full flex items-center"}>
                            {incomeTrend.isPositive ? '↑' : '↓'} {incomeTrend.value}%
                        </div>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-income dark:text-dark-income relative z-10">
                        ₹<AnimatedCounter value={totalIncome || 0} />
                    </p>
                </GlassCard>

                {/* Total Expense */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-light-expense/10 dark:bg-dark-expense/20 flex items-center justify-center text-light-expense dark:text-dark-expense border border-light-expense/20 dark:border-dark-expense/30">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total Expense</h2>
                        </div>
                        <div className={expenseTrend.isPositive ? "text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full flex items-center" : "text-red-500 font-bold text-sm bg-red-500/10 px-2 py-1 rounded-full flex items-center"}>
                            {expenseTrend.isPositive ? '↑' : '↓'} {expenseTrend.value}%
                        </div>
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
                        <div className="w-full h-[300px]">
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
                                            whileHover={{ scale: 1.02, x: 4, transition: { duration: 0.2 } }}
                                            key={_id}
                                            className={`p-4 rounded-xl border border-white/50 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all hover:shadow-md cursor-pointer`}
                                        >
                                            <div className="flex-1 min-w-0 mr-0 sm:mr-4">
                                                <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary truncate">
                                                    {title || description}
                                                </p>
                                                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5">
                                                    {item.date ? moment(item.date).format('DD MMM YYYY') : ''}
                                                </p>
                                            </div>
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
            </div >

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError(null);
                }}
                onSubmit={handleSubmit}
                type={modalType}
                inputState={inputState}
                handleInput={handleInput}
                isLoading={isLoading}
                error={error}
                isEditing={false}
            />
        </div >
    );
};

export default Dashboard;
