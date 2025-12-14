import React, { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { saveCategories } from '../utils/storage';
import '../styles/CategoryManager.css';

interface CategoryManagerProps {
  categories: any[];
  onCategoryAdded: () => void;
}

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
  '#A8E6CF', '#FF8C94', '#A0E7E5', '#FFB7B2'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onCategoryAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const newCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: categoryName.trim(),
      color: selectedColor,
    };

    const updated = [...(categories || []), newCategory];
    saveCategories(updated);
    onCategoryAdded();

    setCategoryName('');
    setSelectedColor(DEFAULT_COLORS[0]);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      saveCategories(updated);
      onCategoryAdded();
    }
  };

  return (
    <div className="category-manager">
      <button
        className="category-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Manage categories"
      >
        <Settings size={28} />
      </button>

      {isOpen && (
        <div className="category-modal">
          <div className="category-modal-header">
            <h3>📂 Manage Categories</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X size={24} />
            </button>
          </div>

          <form className="category-form" onSubmit={handleAddCategory}>
            <div className="form-group">
              <label htmlFor="category-name">Category Name</label>
              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div className="color-picker-group">
              <label>Choose Color</label>
              <div className="color-picker">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="add-category-btn">
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </form>

          <div className="categories-list">
            <h4>Existing Categories</h4>
            {categories && categories.length > 0 ? (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="category-name">{category.name}</span>
                    <button
                      className="delete-category-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete category"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-categories">No categories yet. Create one!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
