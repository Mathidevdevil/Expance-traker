import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign Up</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Create your account</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="John Doe"
                        />
                    </div>

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
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
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
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Create password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 mt-1 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="text-sm text-center text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
