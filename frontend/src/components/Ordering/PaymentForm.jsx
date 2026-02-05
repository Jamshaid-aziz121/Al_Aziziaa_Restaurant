import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, onCancel }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate card number (simple validation - in real app, use a more robust solution)
    const cardNum = paymentData.cardNumber.replace(/\s+/g, '');
    if (!cardNum || cardNum.length < 16 || isNaN(cardNum)) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    // Validate expiry date (MM/YY format)
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const expMonth = parseInt(month);
      const expYear = parseInt(year);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (expMonth < 1 || expMonth > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // Validate CVV
    if (!paymentData.cvv || paymentData.cvv.length < 3 || paymentData.cvv.length > 4 || isNaN(paymentData.cvv)) {
      newErrors.cvv = 'Valid CVV is required';
    }

    // Validate cardholder name
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real application, you would tokenize the card details and send to payment processor
      // For demo purposes, we'll just call the onSubmit callback
      onSubmit({
        ...paymentData,
        maskedCardNumber: `****-****-****-${paymentData.cardNumber.slice(-4)}`,
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Payment Information</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="cardNumber" style={{ display: 'block', marginBottom: '5px' }}>Card Number *</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            autoComplete="cc-number"
          />
          {errors.cardNumber && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.cardNumber}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '5px' }}>Expiry Date (MM/YY) *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              autoComplete="cc-exp"
            />
            {errors.expiryDate && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.expiryDate}</div>}
          </div>

          <div>
            <label htmlFor="cvv" style={{ display: 'block', marginBottom: '5px' }}>CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              autoComplete="cc-csc"
            />
            {errors.cvv && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.cvv}</div>}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="cardholderName" style={{ display: 'block', marginBottom: '5px' }}>Cardholder Name *</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={paymentData.cardholderName}
            onChange={handleChange}
            placeholder="John Doe"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            autoComplete="cc-name"
          />
          {errors.cardholderName && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.cardholderName}</div>}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Process Payment
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;