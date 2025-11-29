"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaUndo } from 'react-icons/fa';

const SearchBar = ({ 
  fields = [], 
  onFilter = () => {},
  className = "", 
  ...props 
}) => {
  // Inicializar filtros basado en fields usando useMemo
  const initialFilters = useMemo(() => {
    const filters = {};
    fields.forEach(field => {
      filters[field.name] = '';
    });
    return filters;
  }, [fields]);

  const [filters, setFilters] = useState(initialFilters);

  // Ejecutar callback cuando cambien los filtros
  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleInputChange = (fieldName, value) => {
    setFilters(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleClear = () => {
    const clearedFilters = {};
    fields.forEach(field => {
      clearedFilters[field.name] = '';
    });
    setFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={`search-bar ${className}`} {...props}>
      <div className="search-bar-content">
        {fields.map((field) => (
          <div key={field.name} className="search-field">
            <label className="search-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="search-select"
                value={filters[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              >
                <option value="">Todos</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                className="search-input"
                placeholder={field.placeholder || ''}
                value={filters[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
        
        <button 
          className={`clear-filters-btn ${hasActiveFilters ? 'active' : ''}`}
          onClick={handleClear}
          title="Limpiar filtros"
        >
          <FaUndo className="clear-icon" />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default SearchBar;