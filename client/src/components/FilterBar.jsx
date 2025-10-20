// src/components/FilterBar.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../style/FilterBar.css';

const priceOptions = [
  { value: '', label: 'Khoảng giá' },
  { value: 'under500', label: 'Dưới 500.000₫' },
  { value: '500to700', label: '500.000₫ - 700.000₫' },
  { value: '700to1000', label: '700.000₫ - 1.000.000₫' },
  { value: 'above1000', label: 'Trên 1.000.000₫' }
];

// Helper function to convert filters back to price range
const getPriceRangeFromFilters = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return '';
  if (!minPrice && maxPrice === 500000) return 'under500';
  if (minPrice === 500000 && maxPrice === 700000) return '500to700';
  if (minPrice === 700000 && maxPrice === 1000000) return '700to1000';
  if (minPrice === 1000000 && !maxPrice) return 'above1000';
  return '';
};

const FilterBar = ({ onFilterChange, initialSearch = '', initialPrice = '', resetSignal }) => {
  const [searchText, setSearchText] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(initialPrice);
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

  console.log('🎨 FilterBar render:', {
    searchText,
    priceRange,
    resetSignal,
    initialSearch,
    initialPrice
  });

  // Reset khi có resetSignal
  useEffect(() => {
    if (resetSignal) {
      console.log('🔄 Reset signal received');
      setSearchText('');
      setPriceRange('');

      // Clear debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    }
  }, [resetSignal]);

  // Sync với initialSearch khi thay đổi
  useEffect(() => {
    setSearchText(initialSearch);
  }, [initialSearch]);

  // Sync với initialPrice khi thay đổi
  useEffect(() => {
    setPriceRange(initialPrice);
  }, [initialPrice]);

  const triggerFilter = useCallback((search, price) => {
    console.log('📡 triggerFilter called:', { search, price });

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

    console.log('📤 Calling onFilterChange with:', { searchText: search, minPrice, maxPrice });
    onFilterChange({ searchText: search, minPrice, maxPrice });
  }, [onFilterChange]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('⌨️ Search input changed:', value);
    setSearchText(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to trigger filter after 600ms of no typing
    debounceTimer.current = setTimeout(() => {
      console.log('⏰ Debounce timeout - calling triggerFilter');
      triggerFilter(value, priceRange);
    }, 600);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    console.log('💰 Price changed:', value);
    setPriceRange(value);

    // Trigger filter immediately when price changes
    triggerFilter(searchText, value);
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setSearchText('');
    setPriceRange('');

    // Clear debounce timer if any
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    triggerFilter('', '');

    // Focus lại vào input sau khi reset
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="filter-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Tìm sản phẩm..."
        value={searchText}
        onChange={handleSearchChange}
        autoComplete="off"
      />

      <select
        className="price-select"
        value={priceRange}
        onChange={handlePriceChange}
      >
        {priceOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="clear-filter-icon"
        onClick={resetFilter}
        title="Xóa bộ lọc"
      >
        ✕
      </button>

    </div>
  );
};

export default FilterBar;