const Expense = require('../models/Expense');

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, month } = req.query;
        let query = { userId: req.user._id };

        if (category) {
            query.category = category;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Filter by specific month (YYYY-MM)
        if (month) {
            const startOfMonth = new Date(`${month}-01`);
            const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));
            query.date = {
                $gte: startOfMonth,
                $lt: endOfMonth
            };
        }

        // In store.js Expense.find returns { results, sort }.
        // We need to call .sort() on it or access results. 
        // Original: await Expense.find(query).sort({ date: -1 });
        // Our mock: Expense.find returns object with sort method.
        // await (await Expense.find(query)).sort(...) 
        // But Expense.find is async, so await Expense.find(query) returns the obj.
        // Then .sort(...) returns the sorted array.

        const expenseQuery = await Expense.find(query);
        const expenses = expenseQuery.sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;

        if (!amount || !category || !description) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const expense = await Expense.create({
            userId: req.user._id,
            amount,
            category,
            description,
            date: date || Date.now()
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check for user
        if (expense.userId.toString() !== req.user._id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check for user
        if (expense.userId.toString() !== req.user._id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await expense.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
};
