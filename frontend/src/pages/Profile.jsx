import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Download, Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import ReportPreviewModal from '../components/ReportPreviewModal';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [downloading, setDownloading] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleUpdate = async () => {
        try {
            await updateUserProfile({ name, email });
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error(error || "Failed to update profile");
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // Get the JWT token from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;
            if (!token) {
                toast.error('Not authenticated. Please log in again.');
                setDownloading(false);
                return;
            }

            // Build direct download URL with token as query param.
            // This works in GoNative WebView (and all browsers) because it is a plain
            // URL navigation — WebViews cannot handle blob: URLs so the old fetch+blob
            // approach showed raw binary text on Android.
            const baseURL = import.meta.env.PROD
                ? 'https://expance-traker-backend.vercel.app/api'
                : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

            const downloadUrl =
                `${baseURL}/reports/download?month=${month}&year=${year}&token=${encodeURIComponent(token)}`;

            // On Android / GoNative WebView use window.open so the OS file handler picks it up.
            // On desktop browsers use a hidden anchor click.
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
                window.open(downloadUrl, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `Expense_Report_${year}_${String(month).padStart(2, '0')}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }

            toast.success('Report downloaded successfully!');
            setIsPreviewOpen(false);
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download report');
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
                            onClick={() => setIsPreviewOpen(true)}
                            className="w-full !rounded-xl !py-4 shadow-md bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 border-transparent"
                        >
                            {downloading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                            Download Excel Report
                        </AnimatedButton>
                    </div>
                </GlassCard>
            </div>

            <ReportPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onDownload={handleDownload}
                month={month}
                year={year}
                downloading={downloading}
            />
        </div>
    );
};

export default Profile;
