import { useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import clsx from 'clsx';
import Chart from '../components/Chart';
import CategoryChart from '../components/CategoryChart';
import { currencyFormat } from '../utils/formatCurrency';
import { dateFormat } from '../utils/dateFormat';

const Dashboard = () => {
    const {
        totalIncome,
        totalExpense,
        totalBalance,
        getIncomes,
        getExpenses,
        transactionHistory
    } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    const recentTransactions = transactionHistory();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Income"
                    amount={totalIncome}
                    icon={TrendingUp}
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-100 dark:bg-green-900/30"
                />
                <StatCard
                    title="Total Expense"
                    amount={totalExpense}
                    icon={TrendingDown}
                    color="text-red-600 dark:text-red-400"
                    bgColor="bg-red-100 dark:bg-red-900/30"
                />
                <StatCard
                    title="Total Balance"
                    amount={totalBalance}
                    icon={IndianRupee}
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100 dark:bg-blue-900/30"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 h-[400px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white shrink-0">Income vs Expense</h2>
                    <div className="flex-1 min-h-0">
                        <Chart />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 h-[400px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white shrink-0">Expense Categories</h2>
                    <div className="flex-1 min-h-0">
                        <CategoryChart />
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recent History</h2>
                <div className="space-y-4">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((txn) => (
                            <div key={txn._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:shadow-sm transition-shadow">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <div className={clsx(
                                        "p-2 rounded-full shrink-0",
                                        txn.type === 'Income' ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    )}>
                                        {txn.type === 'Income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-800 dark:text-white truncate">{txn.category || 'Income'}</p>
                                        <div className="flex justify-between items-center sm:block">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">{txn.description}</p>
                                            <p className="text-xs text-slate-400 sm:hidden">{dateFormat(txn.date)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right ml-2 shrink-0">
                                    <span className={clsx(
                                        "font-bold text-sm shrink-0 block",
                                        txn.type === 'Income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {txn.type === 'Income' ? '+' : '-'}{currencyFormat(txn.amount)}
                                    </span>
                                    <span className="text-xs text-slate-400 hidden sm:block">{dateFormat(txn.date)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">No recent transactions</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, amount, icon: Icon, color, bgColor }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${bgColor} ${color} shrink-0`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">{title}</h3>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white truncate" title={currencyFormat(amount)}>{currencyFormat(amount)}</h2>
            </div>
        </div>
    );
};

export default Dashboard;
