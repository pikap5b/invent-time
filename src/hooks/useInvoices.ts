import { useState, useEffect } from 'react';
import { Invoice, Client, InvoiceItem } from '../types';

const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    address: '123 Business Ave, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    vatNumber: 'VAT123456789'
  },
  {
    id: '2',
    name: 'Creative Events Ltd',
    email: 'info@creativeevents.com',
    address: '456 Event Plaza, Creative District, CD 67890',
    phone: '+1 (555) 987-6543',
    vatNumber: 'VAT987654321'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: new Date('2024-01-15'),
    dueDate: new Date('2024-02-14'),
    status: 'Sent',
    client: mockClients[0],
    items: [
      { id: '1', description: 'Audio Equipment Rental', quantity: 1, price: 500, total: 500 },
      { id: '2', description: 'Setup and Installation', quantity: 1, price: 200, total: 200 }
    ],
    subtotal: 700,
    tax: 140,
    total: 840,
    notes: 'Payment due within 30 days',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedInvoices = localStorage.getItem('invoices');
      const storedClients = localStorage.getItem('clients');
      
      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices).map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date),
          dueDate: new Date(invoice.dueDate),
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt)
        }));
        setInvoices(parsedInvoices);
      } else {
        const processedMockInvoices = mockInvoices.map(invoice => ({
          ...invoice,
          date: new Date(invoice.date),
          dueDate: new Date(invoice.dueDate)
        }));
        setInvoices(processedMockInvoices);
        localStorage.setItem('invoices', JSON.stringify(mockInvoices));
      }

      if (storedClients) {
        setClients(JSON.parse(storedClients));
      } else {
        setClients(mockClients);
        localStorage.setItem('clients', JSON.stringify(mockClients));
      }

      setIsLoading(false);
    }, 500);
  }, []);

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === id
        ? { ...invoice, ...updates, updatedAt: new Date() }
        : invoice
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  return {
    invoices,
    clients,
    isLoading,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addClient,
    updateClient,
    deleteClient,
  };
};