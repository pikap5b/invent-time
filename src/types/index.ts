export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'Not available' | 'On site';
  location: string;
  serialNumber: string;
  model: string;
  responsiblePerson: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  vatNumber?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface CompanySettings {
  id: string;
  name: string;
  vatNumber: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    iban: string;
    swift: string;
  };
  closingMessage: string;
}

export interface DashboardStats {
  totalItems: number;
  availableItems: number;
  onSiteItems: number;
  totalValue: number;
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}