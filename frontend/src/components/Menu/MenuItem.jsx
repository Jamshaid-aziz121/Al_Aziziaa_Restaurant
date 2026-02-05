import React from 'react';
import { DIETARY_LABELS } from '../../../../shared/constants/dietaryOptions';

const MenuItem = ({ item }) => {
  const { name, description, price, dietaryIndicators, available, imagePath, calories, featured } = item;

  // Function to render dietary icons/labels
  const renderDietaryLabels = () => {
    if (!dietaryIndicators || dietaryIndicators.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
        {dietaryIndicators.map(indicator => (
          <span
            key={indicator}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '10px',
            }}
          >
            {DIETARY_LABELS[indicator] || indicator}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: available ? 'white' : '#f8f9fa',
      opacity: available ? 1 : 0.7,
    }}>
      {featured && (
        <div style={{
          backgroundColor: '#ffc107',
          color: '#212529',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '2px 8px',
          borderRadius: '10px',
          display: 'inline-block',
          marginBottom: '8px',
        }}>
          Featured
        </div>
      )}

      {imagePath && (
        <div style={{ marginBottom: '10px' }}>
          <img
            src={imagePath}
            alt={name}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </div>
      )}

      <h3 style={{ margin: '0 0 8px 0', color: available ? '#212529' : '#6c757d' }}>
        {name} {available ? '' : '(Temporarily Unavailable)'}
      </h3>

      <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>
        {description}
      </p>

      {renderDietaryLabels()}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#28a745' }}>
          ${price.toFixed(2)}
        </span>

        {calories && (
          <span style={{ fontSize: '12px', color: '#6c757d' }}>
            {calories} cal
          </span>
        )}
      </div>

      {!available && (
        <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontSize: '14px' }}>
          Currently unavailable
        </div>
      )}
    </div>
  );
};

export default MenuItem;