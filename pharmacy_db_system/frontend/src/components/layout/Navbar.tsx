import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          PharmacyDB
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
