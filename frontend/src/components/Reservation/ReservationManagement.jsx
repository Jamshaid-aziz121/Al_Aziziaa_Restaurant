import React, { useState, useEffect } from 'react';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch customer's reservations
    const fetchReservations = async () => {
      try {
        // Mock API call - in real implementation, this would be an actual API call
        // const response = await fetch('/api/reservations/my-reservations', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        //   }
        // });

        // For demo purposes, return mock data
        const mockReservations = [
          {
            id: '1',
            reservationDate: '2023-12-25',
            reservationTime: '19:30',
            partySize: 4,
            status: 'CONFIRMED',
            confirmationCode: 'RES-123456',
            specialRequests: 'Window seat preferred',
            createdAt: '2023-12-20T10:30:00Z'
          },
          {
            id: '2',
            reservationDate: '2023-12-30',
            reservationTime: '20:00',
            partySize: 2,
            status: 'PENDING',
            confirmationCode: 'RES-789012',
            specialRequests: '',
            createdAt: '2023-12-28T15:45:00Z'
          },
          {
            id: '3',
            reservationDate: '2023-12-15',
            reservationTime: '18:00',
            partySize: 6,
            status: 'COMPLETED',
            confirmationCode: 'RES-345678',
            specialRequests: 'Anniversary celebration',
            createdAt: '2023-12-10T09:15:00Z'
          }
        ];

        setReservations(mockReservations);
      } catch (err) {
        setError('Failed to load reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      // Mock API call to cancel reservation
      // const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });

      // For demo purposes, update the reservation status locally
      setReservations(prev => prev.map(res =>
        res.id === reservationId ? { ...res, status: 'CANCELLED' } : res
      ));
    } catch (err) {
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Reservations</h2>

      {reservations.length === 0 ? (
        <p>You don't have any upcoming reservations.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {reservations.map(reservation => (
            <div key={reservation.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{formatDate(reservation.reservationDate)}</h3>
                  <p style={{ margin: '0', color: '#666' }}><strong>Time:</strong> {reservation.reservationTime}</p>
                  <p style={{ margin: '0', color: '#666' }}><strong>Party Size:</strong> {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</p>
                </div>

                <div style={{
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  ...(reservation.status === 'CONFIRMED' && { backgroundColor: '#d4edda', color: '#155724' }),
                  ...(reservation.status === 'PENDING' && { backgroundColor: '#fff3cd', color: '#856404' }),
                  ...(reservation.status === 'CANCELLED' && { backgroundColor: '#f8d7da', color: '#721c24' }),
                  ...(reservation.status === 'COMPLETED' && { backgroundColor: '#cce7ff', color: '#004085' }),
                }}>
                  {reservation.status.replace('_', ' ')}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0' }}><strong>Confirmation Code:</strong> {reservation.confirmationCode}</p>
                {reservation.specialRequests && (
                  <p style={{ margin: '5px 0' }}><strong>Special Requests:</strong> {reservation.specialRequests}</p>
                )}
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  Booked on: {new Date(reservation.createdAt).toLocaleDateString()}
                </p>
              </div>

              {reservation.status === 'CONFIRMED' || reservation.status === 'PENDING' ? (
                <button
                  onClick={() => cancelReservation(reservation.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Reservation
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;