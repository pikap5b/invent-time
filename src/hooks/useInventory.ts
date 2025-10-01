import { useState, useEffect } from 'react';
import { InventoryItem } from '../types';

// Default categories
const defaultCategories = [
  'Sound',
  'Light',
  'Vision',
  'Cables',
  'Clamps',
  'Sound console',
  'Light console',
];

// Mock data for demonstration
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Yamaha MG16XU Mixer',
    category: 'Sound console',
    quantity: 2,
    status: 'Available',
    location: 'Warehouse A',
    serialNumber: 'YMG001',
    model: 'MG16XU',
    responsiblePerson: 'John Doe',
    notes: 'Recently serviced',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'LED Par 64 Lights',
    category: 'Light',
    quantity: 12,
    status: 'On site',
    location: 'Event Venue B',
    serialNumber: 'LED64-001',
    model: 'PAR64-RGB',
    responsiblePerson: 'Jane Smith',
    notes: 'At corporate event',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'XLR Cables',
    category: 'Cables',
    quantity: 24,
    status: 'Available',
    location: 'Warehouse A',
    serialNumber: 'XLR-BULK-001',
    model: 'Professional XLR 3m',
    responsiblePerson: 'Mike Johnson',
    notes: 'Various lengths available',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '4',
    name: 'DMX Light Console',
    category: 'Light console',
    quantity: 1,
    status: 'Not available',
    location: 'Repair Shop',
    serialNumber: 'DMX-512-001',
    model: 'Professional DMX 512',
    responsiblePerson: 'Sarah Wilson',
    notes: 'Under repair - expected back next week',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22')
  }
];

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const storedItems = localStorage.getItem('inventory');
      const storedCategories = localStorage.getItem('categories');
      
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems(mockInventory);
        localStorage.setItem('inventory', JSON.stringify(mockInventory));
      }
      
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
      }
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    );
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const updateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem('categories', JSON.stringify(newCategories));
  };

  return {
    items,
    categories,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    updateCategories,
  };
};