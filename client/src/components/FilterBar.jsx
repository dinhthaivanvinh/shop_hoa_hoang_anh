// src/components/FilterBar.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../style/FilterBar.css';

const priceOptions = [
  { value: '', label: '-- Khoảng giá --' },
  { value: 'under500', label: 'Dưới 500.000₫' },
  { value: '500to700', label: '500.000₫ - 700.000₫' },
  { value: '700to1000', label: '700.000₫ - 1.000.000₫' },
  { value: 'above1000', label: 'Trên 1.000.000₫' }
];

const FilterBar = ({ onFilterChange, initialSearch = '', initialPrice = '', resetSignal }) => {
  const [searchText, setSearchText] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(initialPrice);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (resetSignal) {
      setSearchText('');
      setPriceRange('');
      onFilterChange({ searchText: '', minPrice: '', maxPrice: '' });
    }
  }, [resetSignal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerFilter = (search, price) => {
    let minPrice = null;
    let maxPrice = null;

    switch (price) {
      case 'under500':
        maxPrice = 500000;
        break;
      case '500to700':
        minPrice = 500000;
        maxPrice = 700000;
        break;
      case '700to1000':
        minPrice = 700000;
        maxPrice = 1000000;
        break;
      case 'above1000':
        minPrice = 1000000;
        break;
      default:
        break;
    }

    onFilterChange({ searchText: search, minPrice, maxPrice });
  };

  const handleSelect = (value) => {
    setPriceRange(value);
    setDropdownOpen(false);
    triggerFilter(searchText, value);
  };

  const resetFilter = () => {
    setSearchText('');
    setPriceRange('');
    triggerFilter('', '');
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="🔍 Tìm sản phẩm..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          triggerFilter(e.target.value, priceRange);
        }}
      />

      {/* Custom dropdown */}
      <div className="custom-select" ref={dropdownRef}>
        <button className="select-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {priceOptions.find(opt => opt.value === priceRange)?.label || '-- Khoảng giá --'}
        </button>
        {dropdownOpen && (
          <ul className="select-options">
            {priceOptions.map(opt => (
              <li key={opt.value} onClick={() => handleSelect(opt.value)}>
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="clear-filter-icon" onClick={resetFilter} title="Xóa bộ lọc">
        ❌
      </button>
    </div>
  );
};

export default FilterBar;
