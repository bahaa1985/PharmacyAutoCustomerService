import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      {icon && <span className="text-4xl">{icon}</span>}
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  // TODO: Fetch real data from API
  const stats = [
    { label: 'Total Inventory Items', value: 1250, icon: '📦' },
    { label: 'Messages', value: 42, icon: '💬' },
    { label: 'Total Users', value: 8, icon: '👥' },
    { label: 'This Month Orders', value: 156, icon: '📈' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};
