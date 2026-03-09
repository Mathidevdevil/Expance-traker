import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass rounded-2xl p-6 w-full max-w-md pointer-events-auto shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
                        >
                            {/* Decorative Background Blob */}
                            <div className={clsx(
                                "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none",
                                isDestructive ? "bg-red-500" : "bg-blue-500"
                            )}></div>

                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.15, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="absolute top-4 right-4 p-2 text-light-textSecondary hover:text-light-textPrimary dark:text-dark-textSecondary dark:hover:text-dark-textPrimary hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>

                            <div className={clsx(
                                "w-16 h-16 rounded-full flex items-center justify-center mb-4 mt-2",
                                isDestructive ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                            )}>
                                <AlertTriangle className="w-8 h-8" />
                            </div>

                            <h2 className="text-xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
                                {title}
                            </h2>
                            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-8">
                                {message}
                            </p>

                            <div className="flex w-full gap-3">
                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.04, y: -1 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-semibold border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5 hover:border-light-primary/40 dark:hover:border-dark-primary/40 transition-all"
                                >
                                    {cancelText}
                                </motion.button>
                                <motion.button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    whileHover={{ scale: 1.04, y: -1 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className={clsx(
                                        "flex-1 py-2.5 px-4 rounded-xl font-semibold text-white transition-all shadow-md relative overflow-hidden",
                                        isDestructive
                                            ? "bg-red-500 hover:bg-red-600 hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]"
                                            : "bg-blue-500 hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]"
                                    )}
                                >
                                    {confirmText}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
