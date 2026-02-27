import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ children, className, onClick, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={onClick ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            onClick={onClick}
            className={clsx(
                "glass p-6 w-full",
                onClick && "cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
