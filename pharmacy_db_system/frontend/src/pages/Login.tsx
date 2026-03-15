import React from 'react';
import { LoginForm } from '../features/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          PharmacyDB
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome back. Please login to continue.
        </p>
        <LoginForm />
      </div>
    </div>
  );
};
