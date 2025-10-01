import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Download, Users } from 'lucide-react';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceModal } from '../components/Invoices/InvoiceModal';
import { InvoicePreview } from '../components/Invoices/InvoicePreview';
import { ClientModal } from '../components/Invoices/ClientModal';
import { Invoice } from '../types';
import { format } from 'date-fns';

export const Invoices: React.FC = () => {
  const { invoices, clients, addInvoice, updateInvoice, deleteInvoice, addClient } = useInvoices();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    // Open preview modal which has download functionality
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    updateInvoice(invoiceId, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsClientModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Users className="w-4 h-4" />
                <span>Add Client</span>
              </button>
              <button
                onClick={handleCreateInvoice}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'Draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {invoices.filter(i => i.status === 'Sent').length}
              </div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'Paid').length}
              </div>
              <div className="text-sm text-gray-600">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'Overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(invoice.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(invoice.dueDate, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(invoice.status)}`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit Invoice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No invoices created yet.</p>
            <button
              onClick={handleCreateInvoice}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first invoice
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        clients={clients}
        invoice={selectedInvoice}
      />

      <InvoicePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        invoice={selectedInvoice}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={addClient}
      />
    </div>
  );
};