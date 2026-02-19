import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Trash2, Calendar, IndianRupee, Tag, Plus } from 'lucide-react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { currencyFormat } from '../utils/formatCurrency';

import Loader from '../components/Loader';

const Expenses = () => {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpense, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        amount: '',
        date: '',
        category: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { amount, date, category, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addExpense(inputState);
            setInputState({
                amount: '',
                date: '',
                category: '',
                description: '',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Expenses</h1>
                    <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Manage your spending</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-xl border border-red-100 dark:border-red-900/30 transition-colors duration-300 w-full sm:w-auto">
                    <h2 className="text-sm font-medium text-red-500 dark:text-red-400 uppercase tracking-wider">Total Expense</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{currencyFormat(totalExpense)}</p>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 lg:w-1/3 h-fit sticky top-8 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">Add New Expense</h3>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Tag className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                                type="text"
                                value={description}
                                name={'description'}
                                placeholder="Description / Title"
                                onChange={handleInput('description')}
                                className="w-full pl-10 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 transition-colors duration-300"
                                required
                            />
                        </div>
                        <div className="relative">
                            <IndianRupee className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                                type="number"
                                value={amount}
                                name={'amount'}
                                placeholder="Amount"
                                onChange={handleInput('amount')}
                                className="w-full pl-10 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 transition-colors duration-300"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <input
                                type="date"
                                value={date}
                                name={'date'}
                                onChange={handleInput('date')}
                                className="w-full pl-10 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-300 custom-date-input"
                                required
                            />
                        </div>
                        <div className="relative">
                            <select
                                required
                                value={category}
                                name="category"
                                onChange={handleInput('category')}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 transition-colors duration-300"
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="groceries">Groceries</option>
                                <option value="food">Food</option>
                                <option value="clothing">Clothing</option>
                                <option value="traveling">Travel</option>
                                <option value="emergency">Emergency</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="pt-2">
                            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium shadow-md">
                                {isLoading ? <Loader className="w-5 h-5 rounded-full" /> : <><Plus className="w-5 h-5 mr-2" /> Add Expense</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-2 transition-colors duration-300">Recent Expenses</h3>
                    {expenses.map((expense) => (
                        <div key={expense._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-blue-500 transition-colors duration-300">
                            <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center text-xl transition-colors duration-300 shrink-0">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 dark:text-white transition-colors duration-300 truncate">{expense.description}</h4>
                                    <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 gap-3 mt-1">
                                        <span className="flex items-center whitespace-nowrap"><IndianRupee className="w-3 h-3 mr-1" /> {expense.amount}</span>
                                        <span className="flex items-center whitespace-nowrap"><Calendar className="w-3 h-3 mr-1" /> {new Date(expense.date).toLocaleDateString()}</span>
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 capitalize transition-colors duration-300 whitespace-nowrap">{expense.category}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteExpense(expense._id)}
                                className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-300"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-300">
                            <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No expenses found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
