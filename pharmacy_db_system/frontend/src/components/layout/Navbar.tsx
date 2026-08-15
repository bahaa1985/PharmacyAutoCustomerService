import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getRoleTheme } from '../../utils/theme';
import medispondLogo from "../../../public/medispond_logo.png";
import { DarkMode, LightMode } from '@mui/icons-material';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, dir } = useLanguage();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const theme = getRoleTheme(user?.role_id);
  const handleLogout = async () => {
    await logout();
  };

    return (
        <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-2">
        <Link to="/dashboard" className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${theme.shell} bg-clip-text text-transparent`}>
          <img src={medispondLogo} width={200} className='h-16 dark:brightness-110' />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <DarkMode className="text-gray-600" /> : <LightMode className="text-yellow-400" />}
          </button>
          <Link to={`/users/${user?.id}`} className="flex items-center">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full transition-colors">
              {user?.username}
            </span>
          </Link>

          <img src={user?.avatar} className='rounded-full w-10 h-10 m-auto' />
          <button
            onClick={handleLogout}
            className={`px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${theme.accent} text-white font-semibold shadow-sm hover:shadow-md active:scale-95`}
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};


