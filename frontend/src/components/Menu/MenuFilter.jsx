import React, { useState } from 'react';
import { DIETARY_OPTIONS, DIETARY_LABELS } from '../../../../shared/constants/dietaryOptions';

const MenuFilter = ({ onFilterChange }) => {
  const [selectedDiets, setSelectedDiets] = useState([]);

  const handleDietToggle = (dietKey) => {
    const newSelected = selectedDiets.includes(dietKey)
      ? selectedDiets.filter(d => d !== dietKey)
      : [...selectedDiets, dietKey];

    setSelectedDiets(newSelected);

    // Notify parent component of filter change
    if (onFilterChange) {
      onFilterChange({
        dietary: newSelected,
      });
    }
  };

  const resetFilters = () => {
    setSelectedDiets([]);
    if (onFilterChange) {
      onFilterChange({
        dietary: [],
      });
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Filter Menu</h3>

      <div style={{ marginBottom: '15px' }}>
        <h4>Dietary Restrictions:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Object.entries(DIETARY_OPTIONS).map(([key, value]) => (
            <label key={value} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedDiets.includes(value)}
                onChange={() => handleDietToggle(value)}
                style={{ marginRight: '5px' }}
              />
              {DIETARY_LABELS[value] || value}
            </label>
          ))}
        </div>
      </div>

      {selectedDiets.length > 0 && (
        <button
          onClick={resetFilters}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default MenuFilter;