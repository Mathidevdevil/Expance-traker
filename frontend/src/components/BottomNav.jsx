import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, TrendingDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import clsx from 'clsx';

const navItems = [
    {
        path: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        activeColor: '#6366F1',       // indigo
        activeBg: 'rgba(99,102,241,0.12)',
    },
    {
        path: '/incomes',
        label: 'Incomes',
        icon: TrendingUp,
        activeColor: '#10B981',       // emerald
        activeBg: 'rgba(16,185,129,0.12)',
    },
    {
        path: '/expenses',
        label: 'Expenses',
        icon: TrendingDown,
        activeColor: '#F43F5E',       // rose
        activeBg: 'rgba(244,63,94,0.12)',
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: User,
        activeColor: '#3B82F6',       // blue
        activeBg: 'rgba(59,130,246,0.12)',
    },
];

/* ---------- Ripple effect ---------- */
const Ripple = ({ x, y }) => (
    <motion.span
        className="absolute rounded-full bg-current pointer-events-none"
        style={{ left: x - 20, top: y - 20, width: 40, height: 40, opacity: 0.18 }}
        initial={{ scale: 0, opacity: 0.25 }}
        animate={{ scale: 3.5, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
    />
);

/* ---------- Single nav item ---------- */
const NavItem = ({ item, isActive }) => {
    const Icon = item.icon;
    const [ripples, setRipples] = useState([]);

    const addRipple = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    }, []);

    return (
        <Link
            to={item.path}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className="relative flex flex-col items-center justify-center flex-1 h-full overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            onClick={addRipple}
        >
            {/* Ripple layer */}
            <AnimatePresence>
                {ripples.map((r) => (
                    <Ripple key={r.id} x={r.x} y={r.y} />
                ))}
            </AnimatePresence>

            {/* Active pill background */}
            <AnimatePresence>
                {isActive && (
                    <motion.span
                        layoutId="active-pill"
                        className="absolute inset-x-2 inset-y-1.5 rounded-2xl"
                        style={{ background: item.activeBg }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                )}
            </AnimatePresence>

            {/* Icon */}
            <motion.div
                animate={isActive
                    ? { y: -3, scale: 1.15 }
                    : { y: 0, scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="relative z-10"
            >
                <Icon
                    className="w-5 h-5 transition-colors duration-200"
                    style={{ color: isActive ? item.activeColor : undefined }}
                    strokeWidth={isActive ? 2.5 : 1.8}
                />
            </motion.div>

            {/* Label */}
            <motion.span
                animate={isActive
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0.55, y: 1 }
                }
                transition={{ duration: 0.2 }}
                className="relative z-10 text-[10px] font-semibold mt-0.5 leading-none transition-colors duration-200"
                style={{ color: isActive ? item.activeColor : undefined }}
            >
                {item.label}
            </motion.span>

            {/* Active dot */}
            <AnimatePresence>
                {isActive && (
                    <motion.span
                        className="absolute bottom-1.5 w-1 h-1 rounded-full"
                        style={{ background: item.activeColor }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    />
                )}
            </AnimatePresence>
        </Link>
    );
};

/* ---------- Bottom Navigation Bar ---------- */
const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav
            role="navigation"
            aria-label="Main mobile navigation"
            className={clsx(
                // Show only on mobile (< lg = 1024px), hide on desktop
                'lg:hidden fixed bottom-0 left-0 right-0 z-50',
                'h-[62px]',
                // Glass morphism
                'bg-white/80 dark:bg-black/80 backdrop-blur-xl',
                'border-t border-white/60 dark:border-white/10',
                'shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)]',
                // Safe area for iOS home indicator
                'pb-safe',
            )}
        >
            {/* Subtle top highlight line */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent pointer-events-none" />

            <div className="flex items-stretch h-full text-light-textSecondary dark:text-dark-textSecondary">
                {navItems.map((item) => (
                    <NavItem key={item.path} item={item} isActive={isActive(item.path)} />
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
