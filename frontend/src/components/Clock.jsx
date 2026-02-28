import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Calendar } from 'lucide-react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs font-medium whitespace-nowrap">
            <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="leading-none pt-[2px]">{time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="leading-none pt-[2px]">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};

export default Clock;
