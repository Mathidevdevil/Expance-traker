const cron = require('node-cron');
const User = require('../models/User');
const { generateExcelBuffer } = require('../controllers/reportController');
const sendEmail = require('../utils/emailService');

const scheduleMonthlyReport = () => {
    // Run on 1st day of every month at 00:00
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running monthly report job...');

        try {
            const users = await User.find();
            const date = new Date();
            // We want report for the *previous* month
            // If today is Feb 1st, we want report for Jan.
            // date.getMonth() returns 1 (Feb). Previous month is 0 (Jan).
            // Year needs adjustment if current month is Jan (0), then prev month is Dec (11) of previous year.

            let year = date.getFullYear();
            let month = date.getMonth(); // 0-11, representing previous month relative to 1st of month?
            // Wait, new Date() is today. 
            // If today is Feb 1st 2026. getMonth() is 1 (Feb).
            // We want report for Jan 2026.
            // So month should be 1 (Jan) if using 1-based index for generateExcelBuffer?
            // generateExcelBuffer expects month 1-12.
            // So if today is Feb (1), previous month is Jan (0). In 1-based, Jan is 1.
            // So month variable for report should be `date.getMonth()`. 
            // If today is Jan 1st. getMonth() is 0. Prev month is Dec.
            // We need to handle year wrap.

            if (month === 0) {
                month = 12;
                year -= 1;
            }
            // If today is Feb (1). Prev month is Jan (1).
            // Logic: `date.getMonth()` returns current month index. 
            // Simply using `date.getMonth()` gives the *previous* month number in 1-12 scale?
            // Jan (0), Feb (1).
            // On Feb 1st, we want Jan report. Jan is 1. `date.getMonth()` is 1. Correct.
            // On Jan 1st, we want Dec report. Dec is 12. `date.getMonth()` is 0. 
            // If 0, set to 12. Correct.

            const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });

            for (const user of users) {
                try {
                    console.log(`Generating report for ${user.email}`);
                    const buffer = await generateExcelBuffer(user._id, month, year);

                    const fileName = `Expense_Report_${monthName}_${year}.xlsx`;

                    await sendEmail({
                        email: user.email,
                        subject: 'Your Monthly Expense Report',
                        message: `Hello ${user.name},\n\nPlease find attached your monthly expense report for ${monthName} ${year}.\n\nThank you.`,
                        attachments: [
                            {
                                filename: fileName,
                                content: buffer
                            }
                        ]
                    });
                    console.log(`Email sent to ${user.email}`);

                } catch (err) {
                    console.error(`Failed to send report to ${user.email}:`, err.message);
                }
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
};

module.exports = scheduleMonthlyReport;
