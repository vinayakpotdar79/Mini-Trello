import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, reset } from '../features/auth/authSlice';
import { Layout, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-3 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
            <Layout className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
            Mini Trello
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-full border border-gray-100 dark:border-dark-border">
                <UserIcon className="text-gray-500 dark:text-gray-400" size={16} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 dark:shadow-none transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle & Mini Icons */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-xl transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border p-4 space-y-4 animate-in slide-in-from-top duration-200">
          {user ? (
            <>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <UserIcon className="text-gray-500 dark:text-gray-400" size={18} />
                  <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-bold bg-red-50 dark:bg-red-900/10 rounded-xl"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center p-3 text-gray-600 dark:text-gray-300 font-bold bg-gray-50 dark:bg-dark-bg rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center p-3 text-white font-bold bg-blue-600 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
