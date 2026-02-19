import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Calendar } from 'lucide-react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-300 text-sm font-medium">
            <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <span>{time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-slate-400" />
                <span>{time.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

export default Clock;
