import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, IndianRupee, Calendar, CreditCard } from 'lucide-react';
import GlassCard from './GlassCard';

const TransactionModal = ({ isOpen, onClose, onSubmit, type, inputState, handleInput, isLoading, error, isEditing = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-md"
                    >
                        <GlassCard className="p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-6">
                                {isEditing ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 text-sm text-light-expense dark:text-dark-expense bg-red-100 dark:bg-red-900/30 rounded-md border border-light-expense/30 dark:border-dark-expense/30">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="relative">
                                    <Tag className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary absolute left-3 top-2.5 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={inputState.description || inputState.title || ''}
                                        onChange={handleInput(type === 'income' ? 'title' : 'description')}
                                        className="w-full pl-10 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textSecondary dark:placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <IndianRupee className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary absolute left-3 top-2.5 pointer-events-none" />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={inputState.amount}
                                        onChange={handleInput('amount')}
                                        className="w-full pl-10 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textSecondary dark:placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Calendar className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary absolute left-3 top-2.5 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={inputState.date}
                                        onChange={handleInput('date')}
                                        className="w-full pl-10 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all custom-date-input"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <select
                                        value={type === 'income' ? inputState.source : inputState.category}
                                        onChange={handleInput(type === 'income' ? 'source' : 'category')}
                                        className="w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                        required
                                    >
                                        <option value="" disabled>Select {type === 'income' ? 'Source' : 'Category'}</option>
                                        {type === 'income' ? (
                                            <>
                                                <option value="salary">Salary</option>
                                                <option value="part time">Part Time</option>
                                                <option value="others">Others</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="groceries">Groceries</option>
                                                <option value="food">Food</option>
                                                <option value="clothing">Clothing</option>
                                                <option value="traveling">Travel</option>
                                                <option value="emergency">Emergency</option>
                                                <option value="other">Other</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                {type === 'expense' && (
                                    <div className="relative">
                                        <CreditCard className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary absolute left-3 top-2.5 pointer-events-none" />
                                        <select
                                            value={inputState.paymentMethod || ''}
                                            onChange={handleInput('paymentMethod')}
                                            className="w-full pl-10 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                            required={type === 'expense'}
                                        >
                                            <option value="" disabled>Select Payment Method</option>
                                            <option value="UPI (GPay, PhonePay)">UPI (GPay, PhonePay)</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Netbanking">Netbanking</option>
                                        </select>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {((type === 'income' && inputState.source === 'others') ||
                                        (type === 'expense' && inputState.category === 'other')) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="relative overflow-hidden"
                                            >
                                                <Tag className="w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary absolute left-3 top-2.5 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    placeholder={`Specific ${type === 'income' ? 'Source' : 'Category'}`}
                                                    value={type === 'income' ? (inputState.customSource || '') : (inputState.customCategory || '')}
                                                    onChange={handleInput(type === 'income' ? 'customSource' : 'customCategory')}
                                                    className="w-full pl-10 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textSecondary dark:placeholder-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                                    required
                                                />
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center transition-opacity hover:opacity-90 ${type === 'income' ? 'bg-light-income dark:bg-dark-income' : 'bg-light-expense dark:bg-dark-expense'
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        `${isEditing ? 'Update' : 'Add'} ${type === 'income' ? 'Income' : 'Expense'}`
                                    )}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TransactionModal;
