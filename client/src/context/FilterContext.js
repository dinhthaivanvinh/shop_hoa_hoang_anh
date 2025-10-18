// src/context/FilterContext.js
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({ searchText: '', minPrice: '', maxPrice: '' });
  const [resetSignal, setResetSignal] = useState(false);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetSignal, setResetSignal }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
