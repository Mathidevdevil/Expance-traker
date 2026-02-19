import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useGlobalContext } from '../context/GlobalContext';
import { useMemo } from 'react';
import { dateFormat } from '../utils/dateFormat';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Chart = () => {
    const { incomes, expenses } = useGlobalContext();
    const { theme } = useTheme();

    const data = useMemo(() => {
        const inc = incomes.map((inc) => {
            const { date, amount } = inc;
            return { date: dateFormat(date), amount };
        });

        const exp = expenses.map((exp) => {
            const { date, amount } = exp;
            return { date: dateFormat(date), amount };
        });

        const allTransactions = [
            ...incomes.map(i => ({ ...i, type: 'income' })),
            ...expenses.map(e => ({ ...e, type: 'expense' }))
        ]
            .filter(t => t.date && !isNaN(new Date(t.date).getTime())) // Filter invalid dates
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const sortedDates = [...new Set(allTransactions.map(t => dateFormat(t.date)))].filter(date => date);

        const incomeData = sortedDates.map(date => {
            const dayIncomes = incomes.filter(i => dateFormat(i.date) === date);
            return dayIncomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
        });

        const expenseData = sortedDates.map(date => {
            const dayExpenses = expenses.filter(e => dateFormat(e.date) === date);
            return dayExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        });

        return {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'green',
                    borderRadius: 5,
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'red',
                    borderRadius: 5,
                },
            ],
        };
    }, [incomes, expenses]);

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b', // slate-300 : slate-500
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b', // slate-300 : slate-500
                    callback: function (value) {
                        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(value);
                    }
                },
                grid: {
                    color: theme === 'dark' ? '#334155' : '#e2e8f0' // slate-700 : slate-200
                }
            },
            x: {
                ticks: {
                    color: theme === 'dark' ? '#cbd5e1' : '#64748b'
                },
                grid: {
                    display: false
                }
            }
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8
    };

    if (!incomes.length && !expenses.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-slate-400 dark:text-slate-500">No chart data available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg transition-colors duration-300">
            <Bar data={data} options={options} key={theme} />
            {/* Key ensures chart destroys and recreates on theme change to apply options */}
        </div>
    );
};

export default Chart;
