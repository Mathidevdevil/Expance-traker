import { useMemo } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useTheme } from '../context/ThemeContext';
import { dateFormat } from '../utils/dateFormat';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md p-4 border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                <p className="text-light-textPrimary dark:text-dark-textPrimary font-bold mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                        {entry.name}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Chart = () => {
    const { incomes, expenses } = useGlobalContext();
    const { theme } = useTheme();

    const data = useMemo(() => {
        const allTransactions = [
            ...incomes.map(i => ({ ...i, type: 'income' })),
            ...expenses.map(e => ({ ...e, type: 'expense' }))
        ]
            .filter(t => t.date && !isNaN(new Date(t.date).getTime()))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const sortedDates = [...new Set(allTransactions.map(t => dateFormat(t.date)))].filter(Boolean);

        return sortedDates.map(date => {
            const dayIncomes = incomes.filter(i => dateFormat(i.date) === date);
            const incomeTotal = dayIncomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

            const dayExpenses = expenses.filter(e => dateFormat(e.date) === date);
            const expenseTotal = dayExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

            return {
                name: date,
                Income: incomeTotal,
                Expense: expenseTotal
            };
        });
    }, [incomes, expenses]);

    if (!incomes.length && !expenses.length) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm">No chart data available</p>
            </div>
        );
    }

    const axisColor = theme === 'dark' ? '#CBD5E1' : '#64748B';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const cursorColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    // Using predefined theme colors dynamically
    const incomeColor = theme === 'dark' ? '#22C55E' : '#16A34A';
    const expenseColor = theme === 'dark' ? '#EF4444' : '#DC2626';

    return (
        <div className="w-full h-full min-h-[300px] text-sm">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke={axisColor}
                        tick={{ fill: axisColor }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke={axisColor}
                        tick={{ fill: axisColor }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Income" fill={incomeColor} radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
                    <Bar dataKey="Expense" fill={expenseColor} radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
