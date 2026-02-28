import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Incomes from './pages/Incomes';
import Profile from './pages/Profile';
import Layout from './components/Layout';

import { ThemeProvider } from './context/ThemeContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/incomes"
          element={
            <ProtectedRoute>
              <Layout>
                <Incomes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalProvider>
          <ThemeProvider>
            <div className="font-sans min-h-screen transition-colors duration-300">
              <Toaster position="top-right" toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--tw-colors-light-card)',
                  color: 'var(--tw-colors-light-textPrimary)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }
              }} />
              <AnimatedRoutes />
            </div>
          </ThemeProvider>
        </GlobalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
