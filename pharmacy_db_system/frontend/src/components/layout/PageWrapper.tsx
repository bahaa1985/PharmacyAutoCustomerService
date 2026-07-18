import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getRoleTheme } from '../../utils/theme';
import { useLanguage } from '../../context/LanguageContext';

interface PageWrapperProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  showSidebar = true,
}) => {
  const { user } = useAuth();
  const { dir } = useLanguage();
  const theme = getRoleTheme(user?.role_id);

  return (
    <div className={`min-h-screen bg-gray-50 ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 p-8 bg-gradient-to-br ${theme.shell}`}>
          <div className="rounded-2xl bg-white/95 p-6 shadow-sm backdrop-blur">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
