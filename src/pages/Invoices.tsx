import React, { useState } from 'react';
import { Plus, Eye, CreditCard as Edit, Trash2, Download, Users, Search, Filter } from 'lucide-react';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceModal } from '../components/Invoices/InvoiceModal';
import { InvoicePreview } from '../components/Invoices/InvoicePreview';
import { ClientModal } from '../components/Invoices/ClientModal';
import { Invoice, Client } from '../types';
import { format } from 'date-fns';

export const Invoices: React.FC = () => {
  const { invoices, clients, addInvoice, updateInvoice, deleteInvoice, addClient, updateClient, deleteClient } = useInvoices();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isClientEditModalOpen, setIsClientEditModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    const matchesClient = clientFilter === 'All' || invoice.client.id === clientFilter;
    
    const matchesDateFrom = !dateFromFilter || invoice.date >= new Date(dateFromFilter);
    const matchesDateTo = !dateToFilter || invoice.date <= new Date(dateToFilter);

    return matchesSearch && matchesStatus && matchesClient && matchesDateFrom && matchesDateTo;
  });

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
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredInvoices.filter(i => i.status === 'Draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredInvoices.filter(i => i.status === 'Sent').length}
              </div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredInvoices.filter(i => i.status === 'Paid').length}
              </div>
              <div className="text-sm text-gray-600">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredInvoices.filter(i => i.status === 'Overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            
            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            
            {/* Date Range Filters */}
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="From Date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                placeholder="To Date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'All' || clientFilter !== 'All' || dateFromFilter || dateToFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setClientFilter('All');
                  setDateFromFilter('');
                  setDateToFilter('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden lg:block overflow-x-auto">
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
              {filteredInvoices.map((invoice) => (
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

        {/* Mobile Card View - Visible on Mobile Only */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{invoice.number}</h3>
                  <p className="text-xs text-gray-500">{invoice.client.name}</p>
                  <p className="text-xs text-gray-400">{invoice.client.email}</p>
                </div>
                <div className="flex space-x-1 ml-2">
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
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <div className="mt-1 font-medium text-gray-900">{format(invoice.date, 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <div className="mt-1 font-medium text-gray-900">{format(invoice.dueDate, 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <div className="mt-1 font-bold text-gray-900">${invoice.total.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className="mt-1">
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && searchTerm === '' && statusFilter === 'All' && clientFilter === 'All' && !dateFromFilter && !dateToFilter && (
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
        
        {filteredInvoices.length === 0 && (searchTerm !== '' || statusFilter !== 'All' || clientFilter !== 'All' || dateFromFilter || dateToFilter) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No invoices found matching your filters.</p>
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