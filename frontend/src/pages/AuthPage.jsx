import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const AuthPage = ({ initialMode = 'login' }) => {
    const [isSignUp, setIsSignUp] = useState(initialMode === 'register');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        setIsSignUp(initialMode === 'register');
        setError(null);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }, [initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            await register({ name, email, password });
            navigate('/');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-transparent flex justify-center items-center flex-col font-sans transition-colors duration-300 p-4">

            <div className={clsx(
                "bg-white dark:bg-[#1F1B3A] rounded-2xl shadow-2xl relative overflow-hidden w-full max-w-md md:max-w-[768px] min-h-[600px] md:min-h-[550px] transition-colors duration-300",
                isSignUp && "right-panel-active" // detailed logic handled via conditional classes below instead of a single parent class for better tailwind integration
            )}>

                {/* Sign Up Container */}
                <div className={clsx(
                    "absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2",
                    isSignUp ? "md:translate-x-full opacity-100 z-50 rounded-none md:rounded-r-2xl" : "opacity-0 z-10 pointer-events-none"
                )}>
                    <form onSubmit={handleRegister} className="bg-white dark:bg-[#1F1B3A] flex flex-col items-center justify-center h-full px-8 md:px-10 text-center transition-colors duration-300">
                        <h1 className="font-bold text-3xl mb-4 text-slate-800 dark:text-white">Create Account</h1>

                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-4">or use your email for registration</span>

                        {error && isSignUp && <div className="text-[#F43F5E] text-sm mb-3">{error}</div>}

                        <input type="text" name="name" placeholder="Name" value={name} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                        <button disabled={isLoading} className="mt-4 rounded-full border border-blue-600 bg-[#7C3AED] text-white font-bold text-xs py-3 px-11 uppercase tracking-wider hover:bg-[#6D28D9] transition-transform active:scale-95 shadow-md flex items-center justify-center">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
                        </button>

                        <div className="mt-4 md:hidden">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-[#7C3AED] font-bold hover:underline">Sign In</button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className={clsx(
                    "absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 z-20",
                    isSignUp ? "md:translate-x-full opacity-0 pointer-events-none" : "opacity-100"
                )}>
                    <form onSubmit={handleLogin} className="bg-white dark:bg-[#1F1B3A] flex flex-col items-center justify-center h-full px-10 text-center transition-colors duration-300">
                        <h1 className="font-bold text-3xl mb-4 text-slate-800 dark:text-white">Sign in</h1>

                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-4">or use your account</span>

                        {error && !isSignUp && <div className="text-[#F43F5E] text-sm mb-3">{error}</div>}

                        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                        <a href="#" className="text-slate-500 dark:text-slate-400 text-sm my-4 hover:text-slate-800 dark:hover:text-white transition-colors">Forgot your password?</a>

                        <button disabled={isLoading} className="rounded-full border border-blue-600 bg-[#7C3AED] text-white font-bold text-xs py-3 px-11 uppercase tracking-wider hover:bg-[#6D28D9] transition-transform active:scale-95 shadow-md flex items-center justify-center">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </button>

                        <div className="mt-4 md:hidden">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-[#7C3AED] font-bold hover:underline">Sign Up</button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className={clsx(
                    "hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-[100]",
                    isSignUp ? "-translate-x-full" : ""
                )}>
                    <div className={clsx(
                        "bg-gradient-to-r from-blue-500 to-blue-700 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out",
                        isSignUp ? "translate-x-1/2" : "translate-x-0"
                    )}>
                        {/* Overlay Panels */}
                        <div className={clsx(
                            "absolute flex items-center justify-center flex-col p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out",
                            isSignUp ? "translate-x-0" : "-translate-x-[20%]"
                        )}>
                            <h1 className="font-bold text-3xl mb-4">Welcome Back!</h1>
                            <p className="text-sm px-8 mb-8">To keep connected with us please login with your personal info</p>
                            <button onClick={() => setIsSignUp(false)} className="bg-transparent border border-white text-white rounded-full font-bold text-xs py-3 px-10 uppercase tracking-wider transition-transform active:scale-95 hover:bg-white/10">
                                Sign In
                            </button>
                        </div>
                        <div className={clsx(
                            "absolute right-0 flex items-center justify-center flex-col p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out",
                            isSignUp ? "translate-x-[20%]" : "translate-x-0"
                        )}>
                            <h1 className="font-bold text-3xl mb-4">Hello, Friend!</h1>
                            <p className="text-sm px-8 mb-8">Enter your personal details and start journey with us</p>
                            <button onClick={() => setIsSignUp(true)} className="bg-transparent border border-white text-white rounded-full font-bold text-xs py-3 px-10 uppercase tracking-wider transition-transform active:scale-95 hover:bg-white/10">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
