import React from 'react';
import { Package, CheckCircle, MapPin, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  totalItems: number;
  availableItems: number;
  onSiteItems: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalItems,
  availableItems,
  onSiteItems,
}) => {
  const stats = [
    {
      name: 'Total Items',
      value: totalItems.toString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Available',
      value: availableItems.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'On Site',
      value: onSiteItems.toString(),
      icon: MapPin,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};