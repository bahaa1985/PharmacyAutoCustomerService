import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getRoleTheme } from '../../utils/theme';
import medispondLogo from "../../../public/medispond_logo.png";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, dir } = useLanguage();
  const theme = getRoleTheme(user?.role_id);
  const handleLogout = async () => {
    await logout();
  };

    return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-2">
        <Link to="/dashboard" className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${theme.shell} bg-clip-text text-transparent`}>
          {/* {t('layout.appName')} */}
          <img src={medispondLogo} width={200} className='h-16' />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to={`/users/${user?.id}`} className="flex items-center">
            <span className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-full transition-colors">
              {user?.username}
            </span>
          </Link>
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

