import { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../context/GlobalContext';
import { Trash2, Calendar, IndianRupee, Tag, Plus, Pencil, CreditCard } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCounter from '../components/AnimatedCounter';
import TransactionModal from '../components/TransactionModal';
import ConfirmationModal from '../components/ConfirmationModal';

const Expenses = () => {
    const { addExpense, expenses, getExpenses, deleteExpense, updateExpense, totalExpense, error, setError } = useGlobalContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [inputState, setInputState] = useState({
        amount: '',
        date: '',
        category: '',
        description: '',
        customCategory: '',
        paymentMethod: '',
    });

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError(null);
    };

    const handleEditClick = (expense) => {
        setEditingId(expense._id);

        let categoryValue = expense.category || '';
        let customCategoryValue = '';

        const standardCategories = ['groceries', 'food', 'clothing', 'traveling', 'emergency', 'other'];
        if (categoryValue && !standardCategories.includes(categoryValue.toLowerCase())) {
            customCategoryValue = categoryValue;
            categoryValue = 'other';
        }

        setInputState({
            amount: expense.amount,
            date: expense.date ? moment(expense.date).format('YYYY-MM-DD') : '',
            category: categoryValue.toLowerCase(),
            description: expense.description,
            customCategory: customCategoryValue,
            paymentMethod: expense.paymentMethod || '',
        });
        setIsModalOpen(true);
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
                paymentMethod: inputState.paymentMethod,
            };

            if (editingId) {
                await updateExpense(editingId, payload);
                toast.success('Expense updated successfully');
            } else {
                await addExpense(payload);
                toast.success('Expense added successfully');
            }

            setInputState({
                amount: '',
                date: '',
                category: '',
                description: '',
                customCategory: '',
                paymentMethod: '',
            });
            setIsModalOpen(false);
            setEditingId(null);
        } catch (err) {
            // Error is handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const requestDelete = (id, title) => {
        setItemToDelete({ id, title });
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        await deleteExpense(itemToDelete.id);
        toast.success("Expense deleted successfully");
        setIsConfirmOpen(false);
        setItemToDelete(null);
    }

    useEffect(() => {
        getExpenses();
    }, []);

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredExpenses = sortedExpenses.filter(expense =>
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.amount?.toString().includes(searchQuery)
    );

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
                        onClick={() => {
                            setEditingId(null);
                            setInputState({ amount: '', date: '', category: '', description: '', customCategory: '', paymentMethod: '' });
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-6 py-4 shadow-[0_4px_12px_rgba(220,38,38,0.2)] bg-light-expense dark:bg-dark-expense text-white hover:opacity-90 border-transparent"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Expense
                    </AnimatedButton>
                </div>
            </header>

            <div className="w-full">
                <GlassCard className="min-h-[400px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">Expense History</h3>
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-4 pr-10 bg-white/50 dark:bg-black/50 border border-light-border dark:border-dark-border rounded-xl text-sm text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-expense focus:border-transparent transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary">
                                    <Trash2 className="w-4 h-4 opacity-50 hover:opacity-100" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredExpenses.map((expense, index) => {
                                const isIncome = false; // Always false for Expenses component
                                const amount = expense.amount;
                                return (
                                    <motion.div
                                        key={expense._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.01, x: 5, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-light-expense/50 dark:hover:border-dark-expense/50 transition-all gap-4`}
                                    >
                                        <div className="flex items-start sm:items-center gap-4 flex-1 w-full sm:w-auto min-w-0 mr-0 sm:mr-4">
                                            <div className="w-12 h-12 rounded-full bg-light-expense/10 dark:bg-dark-expense/20 text-light-expense dark:text-dark-expense flex items-center justify-center shrink-0 border border-light-expense/30 dark:border-dark-expense/30">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-light-textPrimary dark:text-dark-textPrimary truncate text-lg">
                                                    {expense.description}
                                                </h4>
                                                <div className="flex flex-wrap items-center text-sm text-light-textSecondary dark:text-dark-textSecondary gap-3 sm:gap-5 mt-1">
                                                    <span className="flex items-center whitespace-nowrap"><IndianRupee className="w-4 h-4 mr-1" /> {expense.amount}</span>
                                                    <span className="flex items-center whitespace-nowrap"><Calendar className="w-4 h-4 mr-1" /> {moment(expense.date).format('DD MMM YYYY')}</span>
                                                    <span className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-xs text-light-textPrimary dark:text-dark-textSecondary capitalize whitespace-nowrap">{expense.category || 'Other'}</span>
                                                    {expense.paymentMethod && (
                                                        <span className={`flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-xs font-semibold ${expense.paymentMethod === 'Cash' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'}`}>
                                                            <CreditCard className="w-3 h-3 mr-1" />
                                                            {expense.paymentMethod === 'Cash' ? 'Case' : 'Online Payment'}
                                                        </span>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                            <p className={`font-bold shrink-0 ${isIncome ? 'text-light-income dark:text-dark-income' : 'text-light-expense dark:text-dark-expense'}`}>
                                                {isIncome ? '+' : '-'}{currencyFormat(amount)}
                                            </p>
                                            <div className="flex items-center sm:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                <button
                                                    onClick={() => handleEditClick(expense)}
                                                    className="p-2 sm:p-2.5 text-light-textSecondary dark:text-dark-textSecondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all transform active:scale-95"
                                                    title="Edit Expense"
                                                >
                                                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(expense._id, expense.description)}
                                                    className="p-2 sm:p-2.5 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all transform active:scale-95"
                                                    title="Delete Expense"
                                                >
                                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {filteredExpenses.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20 bg-white/30 dark:bg-black/30 border border-dashed border-light-border dark:border-dark-border rounded-2xl flex flex-col items-center justify-center"
                            >
                                <div className="w-16 h-16 bg-light-expense/10 dark:bg-dark-expense/10 rounded-full flex flex-col items-center justify-center mb-4 text-light-expense dark:text-dark-expense shadow-inner">
                                    <Tag className="w-8 h-8 opacity-50" />
                                </div>
                                <h4 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary mb-1">No expenses found</h4>
                                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary max-w-[250px]">
                                    {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "You haven't tracked any expenses yet. Add one to start!"}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </GlassCard>
            </div >

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setError(null);
                }}
                onSubmit={handleSubmit}
                type="expense"
                inputState={inputState}
                handleInput={handleInput}
                isLoading={isLoading}
                error={error}
                isEditing={!!editingId}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Expense"
                message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete Expense"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div >
    );
};

export default Expenses;
