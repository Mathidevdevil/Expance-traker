import { motion } from 'framer-motion';
import clsx from 'clsx';

const AnimatedButton = ({ children, className, onClick, type = "button", variant = "primary", disabled = false, ...props }) => {

    const baseClasses = "rounded-full font-bold px-6 py-3 tracking-wider flex items-center justify-center transition-colors shadow-lg";

    const variants = {
        primary: "bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 border border-light-primary/50 dark:border-dark-primary/50 shadow-md",
        danger: "bg-light-expense dark:bg-dark-expense text-white hover:opacity-90 border border-light-expense/50 dark:border-dark-expense/50 shadow-md",
        outline: "bg-transparent border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5",
        ghost: "bg-transparent text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5 shadow-none"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.03 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={clsx(
                baseClasses,
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
