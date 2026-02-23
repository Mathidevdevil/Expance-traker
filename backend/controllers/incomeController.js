const Income = require('../models/Income');

// @desc    Get incomes
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res) => {
    try {
        const { source, startDate, endDate, month } = req.query;
        let query = { userId: req.user._id };

        if (source) {
            query.source = source;
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

        const incomeQuery = await Income.find(query);
        const incomes = incomeQuery.sort({ date: -1 });

        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add income
// @route   POST /api/incomes
// @access  Private
const addIncome = async (req, res) => {
    try {
        const { amount, source, description, date } = req.body;

        if (!amount || !source || !description) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const income = await Income.create({
            userId: req.user._id,
            amount,
            source,
            description,
            date: date || Date.now()
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
const updateIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Check for user
        if (income.userId.toString() !== req.user._id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedIncome = await Income.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedIncome);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Check for user
        if (income.userId.toString() !== req.user._id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await income.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getIncomes,
    addIncome,
    updateIncome,
    deleteIncome
};
