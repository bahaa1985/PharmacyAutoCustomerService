import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getRoleTheme } from '../../utils/theme';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, dir } = useLanguage();
  const theme = getRoleTheme(user?.role_id);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={`bg-gradient-to-r ${theme.shell} text-white shadow-md`} dir={dir}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
        <Link to="/dashboard" className="text-2xl font-bold">
          {t('layout.appName')}
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium">
            {t('layout.language')}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'en' | 'ar')}
              className="ml-2 mr-2 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm text-white"
            >
              <option value="en" className="text-gray-900">English</option>
              <option value="ar" className="text-gray-900">العربية</option>
            </select>
          </label>
          <Link to={`/users/${user?.id}`}>
            <span className="text-sm">{user?.username}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md transition-colors bg-white/20 hover:bg-white/30"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};
