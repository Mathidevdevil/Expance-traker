import { motion, AnimatePresence } from 'framer-motion';
import { X, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import GlassCard from './GlassCard';

const ReportPreviewModal = ({ isOpen, onClose, onDownload, month, year, downloading }) => {
    const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-sm"
                    >
                        <GlassCard className="p-8 text-center flex flex-col items-center">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                                <FileSpreadsheet className="w-8 h-8" />
                            </div>

                            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                                Ready to Download
                            </h2>
                            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-[250px] mx-auto">
                                Your expense report for <strong>{monthName} {year}</strong> has been generated and is ready to save.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onDownload}
                                disabled={downloading}
                                className="w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                {downloading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-2" />
                                        Save Excel File
                                    </>
                                )}
                            </motion.button>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReportPreviewModal;
