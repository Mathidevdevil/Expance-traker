const ExcelJS = require('exceljs');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Helper to generate Excel Buffer
const generateExcelBuffer = async (userId, month, year) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Fetch previous balance (all transactions before this month)
    const prevExpenses = await Expense.find({ userId, date: { $lt: startOfMonth } }).lean();
    const prevIncomes = await Income.find({ userId, date: { $lt: startOfMonth } }).lean();

    const totalPrevExpense = prevExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPrevIncome = prevIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    let currentBalance = totalPrevIncome - totalPrevExpense;

    // Fetch current month transactions
    const expenses = await Expense.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).lean();

    const incomes = await Income.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).lean();

    // Merge and Sort
    const transactions = [
        ...expenses.map(e => ({ ...e, type: 'Expense' })),
        ...incomes.map(i => ({ ...i, type: 'Income' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ExpenseTracker';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Monthly Report');

    // Columns with explicit widths
    worksheet.columns = [
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Category/Source', key: 'category', width: 22 },
        { header: 'Description', key: 'description', width: 32 },
        { header: 'Payment Method', key: 'payMethod', width: 22 },
        { header: 'Amount (INR)', key: 'amount', width: 16 },
        { header: 'Balance (INR)', key: 'balance', width: 16 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3B82F6' }, // blue
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 22;

    // Add Opening Balance Row
    const openingRow = worksheet.addRow({
        date: startOfMonth.toISOString().split('T')[0],
        type: 'Opening',
        category: '-',
        description: 'Opening Balance',
        payMethod: '-',
        amount: '-',
        balance: currentBalance,
    });
    openingRow.font = { italic: true, color: { argb: 'FF6B7280' } };
    openingRow.getCell('balance').numFmt = '₹#,##0.00';

    // Add Transactions
    transactions.forEach(txn => {
        if (txn.type === 'Income') {
            currentBalance += txn.amount;
        } else {
            currentBalance -= txn.amount;
        }

        const row = worksheet.addRow({
            date: new Date(txn.date).toISOString().split('T')[0],
            type: txn.type,
            category: txn.category || txn.source || '-',
            description: txn.description || '-',
            payMethod: txn.paymentMethod || '-',
            amount: txn.amount,
            balance: currentBalance,
        });

        // Color-code income vs expense
        const isIncome = txn.type === 'Income';
        row.getCell('type').font = {
            bold: true,
            color: { argb: isIncome ? 'FF16A34A' : 'FFDC2626' },
        };
        row.getCell('amount').font = {
            color: { argb: isIncome ? 'FF16A34A' : 'FFDC2626' },
        };
        row.getCell('amount').numFmt = '₹#,##0.00';
        row.getCell('balance').numFmt = '₹#,##0.00';

        // Alternate row background  
        if (row.number % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF9FAFB' },
            };
        }
    });

    // Add Summary section at the bottom
    worksheet.addRow([]);
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);

    const summaryRows = [
        ['Total Income', totalIncome],
        ['Total Expense', totalExpense],
        ['Net Savings', totalIncome - totalExpense],
    ];

    summaryRows.forEach(([label, value]) => {
        const sRow = worksheet.addRow({ description: label, balance: value });
        sRow.getCell('description').font = { bold: true };
        sRow.getCell('balance').font = { bold: true, color: { argb: value >= 0 ? 'FF16A34A' : 'FFDC2626' } };
        sRow.getCell('balance').numFmt = '₹#,##0.00';
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

        const fileName = `Expense_Report_${year}_${String(month).padStart(2, '0')}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', buffer.length);
        // Allow Android/mobile apps to download across origins
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

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
