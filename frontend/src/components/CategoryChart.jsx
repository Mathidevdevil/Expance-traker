import { useMemo, useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md p-4 border border-light-border dark:border-dark-border rounded-xl text-center shadow-lg">
                <p className="font-bold mb-1" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
                <p className="text-sm font-medium text-light-textPrimary dark:text-dark-textPrimary">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const CategoryChart = () => {
    const { expenses } = useGlobalContext();
    const [activeIndex, setActiveIndex] = useState(0);

    const data = useMemo(() => {
        const result = expenses.reduce((acc, curr) => {
            const amount = Number(curr.amount);
            acc[curr.category] = (acc[curr.category] || 0) + amount;
            return acc;
        }, {});

        return Object.keys(result).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: result[key]
        }));
    }, [expenses]);

    // Predefined nice pastel colors
    const COLORS = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#C9CBCF', '#E7E9ED', '#71B37C', '#EC932F'
    ];

    if (!expenses.length) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm">No expense data available</p>
            </div>
        );
    }

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        animationDuration={1500}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;
