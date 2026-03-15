import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  ...props
}) => {
  const widthStyle = fullWidth ? 'w-full' : '';
  const borderStyle = error ? 'border-red-500' : 'border-gray-300';

  return (
    <div className={widthStyle}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`${widthStyle} px-3 py-2 border ${borderStyle} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
