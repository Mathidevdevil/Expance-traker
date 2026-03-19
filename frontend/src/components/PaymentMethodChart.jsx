import { useMemo } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useTheme } from '../context/ThemeContext';
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
import { dateFormat } from '../utils/dateFormat';

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

const PaymentMethodChart = () => {
    const { incomes, expenses } = useGlobalContext();
    const { theme } = useTheme();

    const data = useMemo(() => {
        const allTransactions = [
            ...incomes.map(i => ({ ...i, txType: 'income' })),
            ...expenses.map(e => ({ ...e, txType: 'expense' })),
        ]
            .filter(t => t.date && !isNaN(new Date(t.date).getTime()))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const sortedDates = [...new Set(allTransactions.map(t => dateFormat(t.date)))].filter(Boolean);

        return sortedDates.map(date => {
            const dayTxns = allTransactions.filter(t => dateFormat(t.date) === date);

            const hardCash = dayTxns
                .filter(t => t.paymentMethod === 'Cash')
                .reduce((acc, t) => acc + (t.txType === 'income' ? Number(t.amount) : -Number(t.amount)), 0);

            const online = dayTxns
                .filter(t => t.paymentMethod && t.paymentMethod !== 'Cash')
                .reduce((acc, t) => acc + (t.txType === 'income' ? Number(t.amount) : -Number(t.amount)), 0);

            const cashAmount = dayTxns
                .filter(t => t.paymentMethod === 'Cash')
                .reduce((acc, t) => acc + Number(t.amount), 0);

            const onlineAmount = dayTxns
                .filter(t => t.paymentMethod && t.paymentMethod !== 'Cash')
                .reduce((acc, t) => acc + Number(t.amount), 0);

            return {
                name: date,
                'Case': cashAmount,
                'Online Payment': onlineAmount,
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

    // Amber for Hard Cash, Violet for Online
    const cashColor = theme === 'dark' ? '#F59E0B' : '#D97706';
    const onlineColor = theme === 'dark' ? '#A78BFA' : '#7C3AED';

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
                    <Bar dataKey="Case" fill={cashColor} radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
                    <Bar dataKey="Online Payment" fill={onlineColor} radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PaymentMethodChart;
