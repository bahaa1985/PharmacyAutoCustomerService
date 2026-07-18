import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharamcyContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { pharmacy } = usePharmacy();
  const { t, dir } = useLanguage();

  const links = [
    { path: '/dashboard', label: t('layout.dashboard') },
    { path: '/messages', label: t('layout.messages') },
    { path: '/inventory', label: t('layout.inventory') },
    { path: '/users', label: t('layout.users') },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col" dir={dir}>
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">{pharmacy?.pharmacy_name}</h1>
      </div>
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {links.map((link) => {
            const showLink = link.path !== '/users' || (user && user.role_id <= 2);
            if (!showLink) return null;

            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
