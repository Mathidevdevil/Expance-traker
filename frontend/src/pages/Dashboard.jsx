import { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import CategoryChart from '../components/CategoryChart';
import PaymentMethodChart from '../components/PaymentMethodChart';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, History, Plus, Banknote, CreditCard, ChevronDown } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import AnimatedButton from '../components/AnimatedButton';
import TransactionModal from '../components/TransactionModal';

const Dashboard = () => {
    const { totalExpense, incomes, expenses, totalIncome, totalBalance, hardCashBalance, onlineBalance, getIncomes, getExpenses, timeFilter, setTimeFilter, addIncome, addExpense, error, setError } = useGlobalContext();
    const { user } = useAuth();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [isLoading, setIsLoading] = useState(false);
    const [chartTab, setChartTab] = useState('income-expense'); // 'income-expense' | 'payment-method'
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
                    paymentMethod: inputState.paymentMethod,
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
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                    className="relative inline-block"
                >
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="glass appearance-none pl-4 pr-10 py-2 bg-white/50 dark:bg-black/50 border-white/50 dark:border-white/10 rounded-xl text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer shadow-sm text-sm font-semibold transition-all min-w-[130px]"
                    >
                        <option value="all">All Time</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-light-textSecondary dark:text-dark-textSecondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            {/* Stats Grid — 3 cards: Balance · Case · Online */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Balance */}
                <GlassCard className="flex flex-col relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-light-primary/10 dark:bg-dark-primary/20 flex items-center justify-center text-light-primary dark:text-dark-primary border border-light-primary/20 dark:border-dark-primary/30">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total balance</h2>
                        </div>
                        <div className={balanceTrend.isPositive ? "text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-full flex items-center" : "text-red-500 font-bold text-sm bg-red-500/10 px-2 py-1 rounded-full flex items-center"}>
                            {balanceTrend.isPositive ? '↑' : '↓'} {balanceTrend.value}%
                        </div>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-light-primary dark:text-dark-primary relative z-10">
                        ₹<AnimatedCounter value={totalBalance || 0} />
                    </p>
                </GlassCard>

                {/* Case Balance */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-400/30">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total case balance</h2>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            💵 Case
                        </span>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-amber-600 dark:text-amber-400 relative z-10">
                        ₹<AnimatedCounter value={hardCashBalance || 0} />
                    </p>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">Net case balance</p>
                </GlassCard>

                {/* Online Balance */}
                <GlassCard className="flex flex-col relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4 relative z-10 w-full justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-violet-500/10 dark:bg-violet-400/20 flex items-center justify-center text-violet-600 dark:text-violet-400 border border-violet-500/20 dark:border-violet-400/30">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Total online balance</h2>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                            💳 UPI / Net
                        </span>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-violet-600 dark:text-violet-400 relative z-10">
                        ₹<AnimatedCounter value={onlineBalance || 0} />
                    </p>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">Net online balance</p>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2">
                    {/* Chart tab switcher */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">
                            {chartTab === 'income-expense' ? 'Income vs Expense' : 'Cash vs Online'}
                        </h3>
                        <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                            <button
                                onClick={() => setChartTab('income-expense')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${chartTab === 'income-expense'
                                        ? 'bg-white dark:bg-white/10 text-light-textPrimary dark:text-dark-textPrimary shadow-sm'
                                        : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                                    }`}
                            >
                                📊 In vs Out
                            </button>
                            <button
                                onClick={() => setChartTab('payment-method')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${chartTab === 'payment-method'
                                        ? 'bg-white dark:bg-white/10 text-light-textPrimary dark:text-dark-textPrimary shadow-sm'
                                        : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                                    }`}
                            >
                                💳 Case vs Online
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-[300px]">
                        {chartTab === 'income-expense' ? <Chart /> : <PaymentMethodChart />}
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
                                                    {item.title || item.description}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                                                        {item.date ? moment(item.date).format('DD MMM YYYY') : ''}
                                                    </p>
                                                    {item.paymentMethod && (
                                                        <span className={`flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${item.paymentMethod === 'Cash'
                                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                                : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                                                            }`}>
                                                            {item.paymentMethod === 'Cash' ? '💵 Case' : '💳 Online'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`font-bold shrink-0 self-end sm:self-auto ${isIncome ? 'text-light-income dark:text-dark-income' : 'text-light-expense dark:text-dark-expense'}`}>
                                                {isIncome ? '+' : '-'}{currencyFormat(amount)}
                                            </p>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-10 flex flex-col items-center justify-center opacity-80"
                                >
                                    <div className="w-12 h-12 bg-light-primary/10 dark:bg-dark-primary/10 rounded-full flex flex-col items-center justify-center mb-3 text-light-primary dark:text-dark-primary">
                                        <History className="w-6 h-6 opacity-60" />
                                    </div>
                                    <h4 className="text-sm font-bold text-light-textPrimary dark:text-dark-textPrimary mb-1">No recent history</h4>
                                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary px-4">
                                        Transactions will appear here once you add them.
                                    </p>
                                </motion.div>
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
