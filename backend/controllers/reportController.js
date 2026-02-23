const ExcelJS = require('exceljs');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Helper to generate Excel Buffer
const generateExcelBuffer = async (userId, month, year) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Fetch previous balance (all transactions before this month)
    const prevExpenses = await Expense.find({ userId, date: { $lt: startOfMonth } });
    const prevIncomes = await Income.find({ userId, date: { $lt: startOfMonth } });

    const totalPrevExpense = prevExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPrevIncome = prevIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    let currentBalance = totalPrevIncome - totalPrevExpense;

    // Fetch current month transactions
    const expenses = await Expense.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const incomes = await Income.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Merge and Sort
    const transactions = [
        ...expenses.map(e => ({ ...e, type: 'Expense' })),
        ...incomes.map(i => ({ ...i, type: 'Income' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Monthly Report');

    // Columns
    worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Category/Source', key: 'category', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Balance', key: 'balance', width: 15 }
    ];

    // Add Opening Balance Row
    worksheet.addRow({
        date: startOfMonth.toISOString().split('T')[0],
        type: 'Opening',
        category: '-',
        description: 'Opening Balance',
        amount: '-',
        balance: currentBalance
    });

    // Add Transactions
    transactions.forEach(txn => {
        if (txn.type === 'Income') {
            currentBalance += txn.amount;
        } else {
            currentBalance -= txn.amount;
        }

        worksheet.addRow({
            date: txn.date.toISOString().split('T')[0],
            type: txn.type,
            category: txn.category || txn.source,
            description: txn.description,
            amount: txn.amount,
            balance: currentBalance
        });
    });

    return await workbook.xlsx.writeBuffer();
};

// @desc    Download monthly report
// @route   GET /api/reports/download
// @access  Private
const downloadReport = async (req, res) => {
    try {
        const { month, year } = req.query; // month 1-12
        if (!month || !year) {
            return res.status(400).json({ message: 'Please provide month and year' });
        }

        const buffer = await generateExcelBuffer(req.user._id, month, year);

        const fileName = `Expense_Report_${year}_${month}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating report' });
    }
};

module.exports = {
    downloadReport,
    generateExcelBuffer
};
