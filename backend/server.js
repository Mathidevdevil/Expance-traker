const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const scheduleMonthlyReport = require('./cron/monthlyReport');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Cron Job
scheduleMonthlyReport();

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true, // Deprecated in newer mongoose
    // useUnifiedTopology: true, // Deprecated in newer mongoose
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
