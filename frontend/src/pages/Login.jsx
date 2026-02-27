import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        console.log('Login attempt with:', formData);
        try {
            const data = await login(formData);
            console.log('Login successful:', data);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-transparent transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#1F1B3A] rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign In</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Access your expense tracker</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-[#F43F5E] bg-[#F43F5E]/20 dark:bg-[#F43F5E]/20 rounded-md">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-[#302B63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:border-transparent bg-white dark:bg-[#24243E] text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-[#302B63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:border-transparent bg-white dark:bg-[#24243E] text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-white bg-[#7C3AED] rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                    </button>
                </form>

                <div className="text-sm text-center text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-[#7C3AED] hover:text-blue-500">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
