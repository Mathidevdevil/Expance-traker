import { motion } from 'framer-motion';
import clsx from 'clsx';

const AnimatedButton = ({ children, className, onClick, type = "button", variant = "primary", disabled = false, ...props }) => {

    const baseClasses = "rounded-full font-bold px-6 py-3 tracking-wider flex items-center justify-center transition-all duration-300 shadow-lg relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black";

    const variants = {
        primary: "bg-light-primary dark:bg-dark-primary text-white border border-light-primary/50 dark:border-dark-primary/50 shadow-md hover:shadow-[0_8px_25px_rgba(59,130,246,0.45)] hover:brightness-110",
        danger: "bg-light-expense dark:bg-dark-expense text-white border border-light-expense/50 dark:border-dark-expense/50 shadow-md hover:shadow-[0_8px_25px_rgba(244,63,94,0.45)] hover:brightness-110",
        outline: "bg-transparent border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5 hover:border-light-primary/50 dark:hover:border-dark-primary/50 hover:shadow-md",
        ghost: "bg-transparent text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary hover:bg-black/5 dark:hover:bg-white/5 shadow-none"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.96, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={clsx(
                baseClasses,
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {/* Shimmer overlay */}
            {!disabled && (
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    whileHover={{ translateX: '200%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            )}
            <span className="relative z-10 flex items-center justify-center">
                {children}
            </span>
        </motion.button>
    );
};

export default AnimatedButton;
