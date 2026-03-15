import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/messages', label: 'Messages' },
    { path: '/inventory', label: 'Inventory' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">PharmacyDB</h1>
      </div>
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {links.map((link) => (
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
          ))}
        </ul>
      </nav>
    </aside>
  );
};
