import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const AuthPage = ({ initialMode = 'login' }) => {
    const [isSignUp, setIsSignUp] = useState(initialMode === 'register');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }, [initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await register({ name, email, password });
            toast.success("Account created successfully!");
            navigate('/');
        } catch (err) {
            toast.error(err || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await login({ email, password });
            toast.success("Welcome back!");
            navigate('/');
        } catch (err) {
            toast.error(err || "Invalid credentials");
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
                    <form onSubmit={handleRegister} className="bg-white dark:bg-[#1F1B3A] flex flex-col items-center justify-center h-full px-8 md:px-10 text-center transition-colors duration-300 relative">
                        <h1 className="font-bold text-3xl mb-4 text-slate-800 dark:text-white">Create Account</h1>

                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-4">or use your email for registration</span>

                        <input type="text" name="name" placeholder="Name" value={name} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all" />
                        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all" />

                        <div className="relative w-full my-2">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={password} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all pr-10" />
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                        </div>

                        <div className="relative w-full my-2">
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all pr-10" />
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                        </div>

                        <motion.button
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.06, y: -3 } : {}}
                            whileTap={!isLoading ? { scale: 0.96 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="mt-4 rounded-full border border-blue-600 bg-[#7C3AED] text-white font-bold text-xs py-3 px-11 uppercase tracking-wider hover:bg-[#6D28D9] hover:shadow-[0_8px_25px_rgba(124,58,237,0.5)] transition-all shadow-md flex items-center justify-center relative overflow-hidden"
                        >
                            <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" whileHover={{ translateX: '200%' }} transition={{ duration: 0.5 }} />
                            <span className="relative z-10">{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}</span>
                        </motion.button>

                        <div className="mt-4 md:hidden">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account? <motion.button type="button" onClick={() => setIsSignUp(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[#7C3AED] font-bold hover:underline transition-all">Sign In</motion.button>
                            </p>
                        </div>

                        <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                                Built by Mathi
                            </p>
                        </div>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className={clsx(
                    "absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 z-20",
                    isSignUp ? "md:translate-x-full opacity-0 pointer-events-none" : "opacity-100"
                )}>
                    <form onSubmit={handleLogin} className="bg-white dark:bg-[#1F1B3A] flex flex-col items-center justify-center h-full px-10 text-center transition-colors duration-300 relative">
                        <h1 className="font-bold text-3xl mb-4 text-slate-800 dark:text-white">Sign in</h1>

                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-4">or use your account</span>

                        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 my-2 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all" />

                        <div className="relative w-full my-2">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={password} onChange={handleChange} required className="bg-slate-100 dark:bg-[#24243E] border-none px-4 py-3 w-full rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all pr-10" />
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                        </div>

                        <a href="#" className="text-slate-500 dark:text-slate-400 text-sm my-4 hover:text-slate-800 dark:hover:text-white transition-colors">Forgot your password?</a>

                        <motion.button
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.06, y: -3 } : {}}
                            whileTap={!isLoading ? { scale: 0.96 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="rounded-full border border-blue-600 bg-[#7C3AED] text-white font-bold text-xs py-3 px-11 uppercase tracking-wider hover:bg-[#6D28D9] hover:shadow-[0_8px_25px_rgba(124,58,237,0.5)] transition-all shadow-md flex items-center justify-center relative overflow-hidden"
                        >
                            <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" whileHover={{ translateX: '200%' }} transition={{ duration: 0.5 }} />
                            <span className="relative z-10">{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}</span>
                        </motion.button>

                        <div className="mt-4 md:hidden">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Don't have an account? <motion.button type="button" onClick={() => setIsSignUp(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-[#7C3AED] font-bold hover:underline transition-all">Sign Up</motion.button>
                            </p>
                        </div>

                        <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                                Built by Mathi
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
                            <motion.button whileHover={{ scale: 1.06, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => setIsSignUp(false)} className="bg-transparent border border-white text-white rounded-full font-bold text-xs py-3 px-10 uppercase tracking-wider transition-all hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
                                Sign In
                            </motion.button>
                        </div>
                        <div className={clsx(
                            "absolute right-0 flex items-center justify-center flex-col p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out",
                            isSignUp ? "translate-x-[20%]" : "translate-x-0"
                        )}>
                            <h1 className="font-bold text-3xl mb-4">Hello, Friend!</h1>
                            <p className="text-sm px-8 mb-8">Enter your personal details and start journey with us</p>
                            <motion.button whileHover={{ scale: 1.06, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => setIsSignUp(true)} className="bg-transparent border border-white text-white rounded-full font-bold text-xs py-3 px-10 uppercase tracking-wider transition-all hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
                                Sign Up
                            </motion.button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
