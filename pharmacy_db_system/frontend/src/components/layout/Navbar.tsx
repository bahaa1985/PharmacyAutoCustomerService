import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getRoleTheme } from '../../utils/theme';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, dir } = useLanguage();
  const theme = getRoleTheme(user?.role_id);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={`sticky top-0 z-40 bg-gradient-to-r ${theme.shell} text-white shadow-md`} dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-2">
        <Link to="/dashboard" className="text-lg sm:text-2xl font-bold truncate">
          {t('layout.appName')}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to={`/users/${user?.id}`} className="flex items-center">
            <span className="text-xs sm:text-sm font-medium bg-white/10 px-2 py-1 rounded-md hover:bg-white/20 transition-colors truncate max-w-[80px] sm:max-w-none">
              {user?.username}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors bg-white/20 hover:bg-white/30 font-medium"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

