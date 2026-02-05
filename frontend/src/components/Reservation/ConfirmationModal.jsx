import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, confirmationDetails }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Reservation Confirmed!</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p>Thank you for your reservation. Here are the details:</p>

          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
            <p><strong>Date:</strong> {confirmationDetails?.reservationDate || 'N/A'}</p>
            <p><strong>Time:</strong> {confirmationDetails?.reservationTime || 'N/A'}</p>
            <p><strong>Party Size:</strong> {confirmationDetails?.partySize || 'N/A'} {confirmationDetails?.partySize === 1 ? 'person' : 'people'}</p>
            <p><strong>Confirmation Code:</strong> {confirmationDetails?.confirmationCode || 'N/A'}</p>
            {confirmationDetails?.specialRequests && (
              <p><strong>Special Requests:</strong> {confirmationDetails.specialRequests}</p>
            )}
          </div>

          <p>Please save your confirmation code for reference. You will also receive an email confirmation shortly.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;