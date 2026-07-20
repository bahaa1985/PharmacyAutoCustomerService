import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getRoleTheme } from '../../utils/theme';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronRight, ChevronLeft, Menu } from '@mui/icons-material';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
      <Navbar />
      <div className="flex min-h-screen relative">
        {showSidebar && (
          <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Toggle Button for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`lg:hidden fixed top-1/2 -translate-y-1/2 z-[60] flex items-center justify-center w-8 h-12 shadow-lg transition-all duration-300 bg-gradient-to-b ${theme.shell} text-white ${
                isSidebarOpen 
                  ? (dir === 'rtl' ? 'right-64 rounded-l-md' : 'left-64 rounded-r-md') 
                  : (dir === 'rtl' ? 'right-0 rounded-l-md' : 'left-0 rounded-r-md')
              }`}
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? (
                dir === 'rtl' ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />
              ) : (
                <Menu fontSize="small" />
              )}
            </button>
          </>
        )}
        <main className={`flex-1 p-4 sm:p-8 bg-gradient-to-br ${theme.shell} transition-all duration-300`}>
          <div className="rounded-2xl bg-white/95 p-4 sm:p-6 shadow-sm backdrop-blur">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};


