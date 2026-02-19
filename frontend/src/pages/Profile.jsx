import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Download, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [downloading, setDownloading] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleUpdate = async () => {
        try {
            await updateUserProfile({ name, email });
            setIsEditing(false);
            // Optional: Show success message/toast
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await api.get('/reports/download', {
                params: { month, year },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Expense_Report_${year}_${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download report');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Manage your account and reports</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Info */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">User Information</h2>
                        <button
                            onClick={() => {
                                if (isEditing) handleUpdate();
                                else setIsEditing(true);
                            }}
                            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors duration-300">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Full Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-800 dark:text-white text-lg transition-colors duration-300">{user?.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors duration-300">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Email Address</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <p className="font-semibold text-slate-800 dark:text-white text-lg transition-colors duration-300">{user?.email}</p>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || '');
                                        setEmail(user?.email || '');
                                    }}
                                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-4 py-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Generation */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit transition-colors duration-300">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">Monthly Report</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm transition-colors duration-300">Download your monthly expense report as an Excel file.</p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-300"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Year</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-300"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full bg-slate-800 dark:bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors flex items-center justify-center font-medium disabled:opacity-70 shadow-lg dark:shadow-blue-900/20"
                        >
                            {downloading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                            Download Excel Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
