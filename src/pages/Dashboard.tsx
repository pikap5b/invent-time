import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { CategoryChart } from '../components/Dashboard/CategoryChart';
import { useInventory } from '../hooks/useInventory';
import { useInvoices } from '../hooks/useInvoices';

export const Dashboard: React.FC = () => {
  const { items } = useInventory();
  const { invoices } = useInvoices();
  const navigate = useNavigate();

  // Calculate dashboard statistics
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const availableItems = items
    .filter(item => item.status === 'Available')
    .reduce((sum, item) => sum + item.quantity, 0);
  const onSiteItems = items
    .filter(item => item.status === 'On site')
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate category distribution
  const categoryDistribution = items.reduce((acc, item) => {
    const existing = acc.find(c => c.name === item.category);
    if (existing) {
      existing.value += item.quantity;
    } else {
      acc.push({
        name: item.category,
        value: item.quantity,
        color: getCategoryColor(item.category),
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  function getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Sound': '#3B82F6',
      'Light': '#F59E0B',
      'Vision': '#10B981',
      'Cables': '#8B5CF6',
      'Clamps': '#EF4444',
      'Sound console': '#06B6D4',
      'Light console': '#F97316',
    };
    return colors[category] || '#6B7280';
  }

  return (
    <div className="space-y-6">
      <DashboardStats
        totalItems={totalItems}
        availableItems={availableItems}
        onSiteItems={onSiteItems}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={categoryDistribution} />
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  LED Par 64 Lights marked as "On site"
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New invoice INV-2024-001 created
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  DMX Light Console sent for repair
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/inventory')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Add New Item</h4>
            <p className="text-sm text-gray-600 mt-1">
              Quickly add equipment to inventory
            </p>
          </button>
          <button 
            onClick={() => navigate('/invoices')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Create Invoice</h4>
            <p className="text-sm text-gray-600 mt-1">
              Generate a new client invoice
            </p>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Backup Data</h4>
            <p className="text-sm text-gray-600 mt-1">
              Export and backup your data
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};