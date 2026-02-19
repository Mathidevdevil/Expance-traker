import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useGlobalContext } from '../context/GlobalContext';
import { useTheme } from '../context/ThemeContext';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
    const { expenses } = useGlobalContext();
    const { theme } = useTheme();

    const data = useMemo(() => {
        const result = expenses.reduce((acc, curr) => {
            const amount = Number(curr.amount); // Ensure amount is number
            acc[curr.category] = (acc[curr.category] || 0) + amount;
            return acc;
        }, {});

        const categories = Object.keys(result);
        const amounts = Object.values(result);

        // Predefined nice pastel colors
        const bgColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#C9CBCF', '#E7E9ED', '#71B37C', '#EC932F'
        ];

        return {
            labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [
                {
                    data: amounts,
                    backgroundColor: bgColors,
                    hoverOffset: 4,
                    borderColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    borderWidth: 2
                }
            ]
        };
    }, [expenses, theme]);

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: theme === 'dark' ? '#fff' : '#1e293b',
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        }
    };

    if (!expenses.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-slate-400 dark:text-slate-500 text-sm">No expense data available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Doughnut data={data} options={options} key={theme} />
        </div>
    );
};

export default CategoryChart;
