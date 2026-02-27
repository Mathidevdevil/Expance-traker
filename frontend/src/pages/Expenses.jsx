import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Trash2, Calendar, IndianRupee, Tag, Plus } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCounter from '../components/AnimatedCounter';
import TransactionModal from '../components/TransactionModal';

const Expenses = () => {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpense, error, setError } = useGlobalContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [inputState, setInputState] = useState({
        amount: '',
        date: '',
        category: '',
        description: '',
        customCategory: '',
    });

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                amount: inputState.amount,
                date: inputState.date,
                category: inputState.category === 'other' ? inputState.customCategory : inputState.category,
                description: inputState.description,
            };
            await addExpense(payload);
            setInputState({
                amount: '',
                date: '',
                category: '',
                description: '',
                customCategory: '',
            });
            setIsModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getExpenses();
    }, []);

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-6 relative h-full">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2"
                    >
                        Expenses
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-light-textSecondary dark:text-dark-textSecondary"
                    >
                        Track your spending
                    </motion.p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                    <GlassCard className="!p-4 !w-auto !rounded-xl text-center min-w-[200px]">
                        <h2 className="text-sm font-medium text-light-expense dark:text-dark-expense uppercase tracking-wider mb-1">Total Expense</h2>
                        <p className="text-2xl font-black text-light-textPrimary dark:text-dark-textPrimary">
                            ₹<AnimatedCounter value={totalExpense || 0} />
                        </p>
                    </GlassCard>

                    <AnimatedButton
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-4 shadow-[0_4px_12px_rgba(220,38,38,0.2)] bg-light-expense dark:bg-dark-expense text-white hover:opacity-90 border-transparent"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Expense
                    </AnimatedButton>
                </div>
            </header>

            <div className="w-full">
                <GlassCard className="min-h-[400px]">
                    <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary mb-6">Expense History</h3>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {sortedExpenses.map((expense, index) => {
                                const isIncome = false; // Always false for Expenses component
                                const amount = expense.amount;
                                return (
                                    <motion.div
                                        key={expense._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`p-4 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-light-expense/50 dark:hover:border-dark-expense/50 transition-colors gap-4 border-l-4 ${isIncome ? 'border-l-light-income dark:border-l-dark-income' : 'border-l-light-expense dark:border-l-dark-expense'
                                            }`}
                                    >
                                        <div className="flex items-start sm:items-center gap-4 flex-1 w-full sm:w-auto min-w-0 mr-0 sm:mr-4">
                                            <div className="w-12 h-12 rounded-full bg-light-expense/10 dark:bg-dark-expense/20 text-light-expense dark:text-dark-expense flex items-center justify-center shrink-0 border border-light-expense/30 dark:border-dark-expense/30">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-light-textPrimary dark:text-dark-textPrimary truncate text-lg">
                                                    {expense.description}
                                                </h4>
                                                <div className="flex flex-wrap items-center text-xs text-light-textSecondary dark:text-dark-textSecondary gap-2 sm:gap-4 mt-1">
                                                    <span className="flex items-center whitespace-nowrap"><IndianRupee className="w-3.5 h-3.5 mr-1" /> {expense.amount}</span>
                                                    <span className="flex items-center whitespace-nowrap"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(expense.date).toLocaleDateString()}</span>
                                                    <span className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-light-textPrimary dark:text-dark-textSecondary capitalize whitespace-nowrap">{expense.category || 'Other'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                            <p className={`font-bold shrink-0 ${isIncome ? 'text-light-income dark:text-dark-income' : 'text-light-expense dark:text-dark-expense'}`}>
                                                {isIncome ? '+' : '-'}{currencyFormat(amount)}
                                            </p>
                                            <button
                                                onClick={() => deleteExpense(expense._id)}
                                                className="p-2 sm:p-3 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transform active:scale-95"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {expenses.length === 0 && (
                            <div className="text-center py-16 text-light-textSecondary dark:text-dark-textSecondary border border-dashed border-light-border dark:border-dark-border rounded-xl">
                                <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No expenses found. Add one to get started.</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError(null);
                }}
                onSubmit={handleSubmit}
                type="expense"
                inputState={inputState}
                handleInput={handleInput}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};

export default Expenses;
