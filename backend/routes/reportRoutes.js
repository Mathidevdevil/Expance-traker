const express = require('express');
const router = express.Router();
const { downloadReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/download', protect, downloadReport);

module.exports = router;
