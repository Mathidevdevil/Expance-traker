import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Calculate totals
    const totalIncome = incomes.reduce((acc, income) => acc + Number(income.amount), 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalBalance = totalIncome - totalExpense;

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return history.slice(0, 5); // Return recent 5
    };

    const getIncomes = async () => {
        try {
            const response = await api.get('/incomes');
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

    const getExpenses = async () => {
        try {
            const response = await api.get('/expenses');
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

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            expenses,
            totalIncome,
            totalExpense,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
