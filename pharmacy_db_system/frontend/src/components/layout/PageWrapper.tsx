import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  showSidebar = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
