import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Download, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';

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
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
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
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2"
                >
                    Profile
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-light-textSecondary dark:text-dark-textSecondary"
                >
                    Manage your account and reports
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Info */}
                <GlassCard className="h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary">User Information</h2>
                        <AnimatedButton
                            variant="primary"
                            onClick={() => {
                                if (isEditing) handleUpdate();
                                else setIsEditing(true);
                            }}
                            className="text-sm px-4 py-2"
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </AnimatedButton>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-light-primary dark:text-dark-primary shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-visible">
                                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">Full Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                    />
                                ) : (
                                    <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary text-sm sm:text-base whitespace-nowrap">{user?.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-light-textSecondary dark:text-dark-textSecondary shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-visible">
                                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">Email Address</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                    />
                                ) : (
                                    <p className="font-semibold text-light-textPrimary dark:text-dark-textPrimary text-sm sm:text-base whitespace-nowrap">{user?.email}</p>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end mt-6">
                                <AnimatedButton
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user?.name || '');
                                        setEmail(user?.email || '');
                                    }}
                                    className="text-sm px-4 py-2 border border-light-border dark:border-dark-border"
                                >
                                    Cancel
                                </AnimatedButton>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Report Generation */}
                <GlassCard className="h-fit">
                    <h2 className="text-lg font-bold text-light-textPrimary dark:text-dark-textPrimary mb-6">Monthly Report</h2>
                    <p className="text-light-textSecondary dark:text-dark-textSecondary mb-8 text-sm">Download your monthly expense report as an Excel file.</p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full h-[50px] px-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">Year</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full h-[50px] px-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                />
                            </div>
                        </div>

                        <AnimatedButton
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full !rounded-xl !py-4 shadow-md bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 border-transparent"
                        >
                            {downloading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                            Download Excel Report
                        </AnimatedButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Profile;
