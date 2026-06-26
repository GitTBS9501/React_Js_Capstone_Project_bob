import React from 'react';
import { CATEGORIES } from '../data/books';

interface Props {
  active: string;
  onChange: (cat: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<Props> = ({ active, onChange, isOpen, onClose }) => {
  const handleChange = (cat: string) => {
    onChange(cat);
    onClose?.();
  };

  return (
    <>
      {/* Overlay backdrop — visible only on mobile when sidebar is open */}
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`sidebar-item${active === cat ? ' active' : ''}`}
            onClick={() => handleChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
