import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('all'); // 'week', 'month', 'all'

    // Calculate totals
    const totalIncome = incomes.reduce((acc, income) => acc + Number(income.amount), 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalBalance = totalIncome - totalExpense;

    // Payment method breakdowns
    const hardCashIncome = incomes
        .filter(i => i.paymentMethod === 'Cash')
        .reduce((acc, i) => acc + Number(i.amount), 0);
    const onlineIncome = incomes
        .filter(i => i.paymentMethod && i.paymentMethod !== 'Cash')
        .reduce((acc, i) => acc + Number(i.amount), 0);
    const hardCashExpense = expenses
        .filter(e => e.paymentMethod === 'Cash')
        .reduce((acc, e) => acc + Number(e.amount), 0);
    const onlineExpense = expenses
        .filter(e => e.paymentMethod && e.paymentMethod !== 'Cash')
        .reduce((acc, e) => acc + Number(e.amount), 0);
    const hardCashBalance = hardCashIncome - hardCashExpense;
    const onlineBalance = onlineIncome - onlineExpense;

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return history.slice(0, 5); // Return recent 5
    };

    const getDateRangeParams = () => {
        if (timeFilter === 'all') return {};

        const end = new Date();
        const start = new Date();

        if (timeFilter === 'week') {
            start.setDate(start.getDate() - 7);
        } else if (timeFilter === 'month') {
            start.setMonth(start.getMonth() - 1);
        }

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString()
        };
    };

    const getIncomes = async () => {
        try {
            const params = getDateRangeParams();
            const response = await api.get('/incomes', { params });
            setIncomes(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching incomes");
            setIncomes([]);
        }
    };

    const addIncome = async (income) => {
        try {
            await api.post('/incomes', income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding income");
        }
    };

    const deleteIncome = async (id) => {
        try {
            await api.delete(`/incomes/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting income");
        }
    };

    const updateIncome = async (id, income) => {
        try {
            await api.put(`/incomes/${id}`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating income");
            throw err;
        }
    };

    const getExpenses = async () => {
        try {
            const params = getDateRangeParams();
            const response = await api.get('/expenses', { params });
            setExpenses(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching expenses");
            setExpenses([]);
        }
    };

    const addExpense = async (expense) => {
        try {
            await api.post('/expenses', expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error adding expense");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting expense");
        }
    };

    const updateExpense = async (id, expense) => {
        try {
            await api.put(`/expenses/${id}`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating expense");
            throw err;
        }
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            updateIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            updateExpense,
            expenses,
            totalIncome,
            totalExpense,
            totalBalance,
            hardCashBalance,
            onlineBalance,
            hardCashIncome,
            onlineIncome,
            hardCashExpense,
            onlineExpense,
            transactionHistory,
            error,
            setError,
            timeFilter,
            setTimeFilter
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
