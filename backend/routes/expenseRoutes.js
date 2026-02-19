const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').delete(protect, deleteExpense).put(protect, updateExpense);

module.exports = router;
