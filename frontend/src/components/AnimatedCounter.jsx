import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const AnimatedCounter = ({ value, formatter }) => {
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 1
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    const displayValue = useTransform(springValue, (current) => {
        if (formatter) return formatter(current);
        return Math.floor(current);
    });

    return <motion.span>{displayValue}</motion.span>;
};

export default AnimatedCounter;
