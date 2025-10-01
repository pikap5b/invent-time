import React, { useState } from 'react';
import { InventoryTable } from '../components/Inventory/InventoryTable';
import { ItemModal } from '../components/Inventory/ItemModal';
import { CategoryModal } from '../components/Inventory/CategoryModal';
import { useInventory } from '../hooks/useInventory';
import { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const { items, categories, addItem, updateItem, deleteItem, updateCategories } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedItem) {
      updateItem(selectedItem.id, itemData);
    } else {
      addItem(itemData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <InventoryTable
        items={items}
        categories={categories}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageCategories={() => setIsCategoryModalOpen(true)}
      />

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        item={selectedItem}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSave={updateCategories}
      />
    </div>
  );
};