import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CreditCard as Edit } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSave: (categories: string[]) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onSave 
}) => {
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalCategories([...categories]);
    }
  }, [isOpen, categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
      setLocalCategories([...localCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (index: number) => {
    setLocalCategories(localCategories.filter((_, i) => i !== index));
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditingValue(localCategories[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim() && !localCategories.includes(editingValue.trim())) {
      const updated = [...localCategories];
      updated[editingIndex] = editingValue.trim();
      setLocalCategories(updated);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleSave = () => {
    onSave(localCategories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Add New Category */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || localCategories.includes(newCategory.trim())}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Current Categories:</h3>
            {localCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800 p-1"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-900">{category}</span>
                    <button
                      onClick={() => handleEditCategory(index)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {localCategories.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No categories yet. Add your first category above.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save Categories
          </button>
        </div>
      </div>
    </div>
  );
};