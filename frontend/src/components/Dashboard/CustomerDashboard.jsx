import React, { useState, useEffect } from 'react';
import { customerApi } from '../../services/customerApi';

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Using mock customer ID for demo purposes
      const response = await customerApi.getCustomerDashboard('mock-customer-id');

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ padding: '15px', borderRadius: '4px' }}>
        Error: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="alert alert-info" style={{ padding: '15px', borderRadius: '4px' }}>
        No dashboard data available.
      </div>
    );
  }

  const { reservations, orders, stats } = dashboardData;

  return (
    <div className="customer-dashboard" style={{ padding: '20px' }}>
      <h2>My Account Dashboard</h2>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{stats.totalReservations}</h4>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#6c757d' }}>Total Reservations</p>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#28a745' }}>{stats.totalOrders}</h4>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#6c757d' }}>Total Orders</p>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#ffc107' }}>{stats.upcomingReservations}</h4>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#6c757d' }}>Upcoming Reservations</p>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#17a2b8' }}>{stats.pendingOrders}</h4>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#6c757d' }}>Pending Orders</p>
        </div>
      </div>

      {/* Recent Reservations */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Recent Reservations</h3>
          <a href="/reservations" style={{ color: '#007bff', textDecoration: 'none' }}>View All</a>
        </div>

        {reservations && reservations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {reservations.slice(0, 3).map((reservation) => (
              <div key={reservation.id} style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: new Date(reservation.reservationDate) >= new Date() ? '#fff3cd' : '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0', fontSize: '1.1em' }}>
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </h4>
                  <span style={{
                    backgroundColor: reservation.status === 'CONFIRMED' ? '#d4edda' :
                                    reservation.status === 'PENDING' ? '#fff3cd' :
                                    reservation.status === 'CANCELLED' ? '#f8d7da' : '#d1ecf1',
                    color: reservation.status === 'CONFIRMED' ? '#155724' :
                          reservation.status === 'PENDING' ? '#856404' :
                          reservation.status === 'CANCELLED' ? '#721c24' : '#0c5460',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8em'
                  }}>
                    {reservation.status.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ margin: '5px 0' }}><strong>Time:</strong> {reservation.reservationTime}</p>
                <p style={{ margin: '5px 0' }}><strong>Party Size:</strong> {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</p>
                <p style={{ margin: '5px 0' }}><strong>Code:</strong> {reservation.confirmationCode}</p>

                {reservation.specialRequests && (
                  <p style={{ margin: '5px 0', fontStyle: 'italic' }}><strong>Notes:</strong> {reservation.specialRequests}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No recent reservations.</p>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Recent Orders</h3>
          <a href="/orders" style={{ color: '#007bff', textDecoration: 'none' }}>View All</a>
        </div>

        {orders && orders.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: ['RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'].includes(order.status) ? '#fff3cd' : '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0', fontSize: '1.1em' }}>
                    {order.trackingId}
                  </h4>
                  <span style={{
                    backgroundColor: order.status === 'COMPLETED' ? '#d4edda' :
                                    ['RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'].includes(order.status) ? '#fff3cd' :
                                    order.status === 'CANCELLED' ? '#f8d7da' : '#d1ecf1',
                    color: order.status === 'COMPLETED' ? '#155724' :
                          ['RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'].includes(order.status) ? '#856404' :
                          order.status === 'CANCELLED' ? '#721c24' : '#0c5460',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8em'
                  }}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <p style={{ margin: '5px 0' }}><strong>Type:</strong> {order.orderType}</p>
                <p style={{ margin: '5px 0' }}><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

                {order.specialInstructions && (
                  <p style={{ margin: '5px 0', fontStyle: 'italic' }}><strong>Notes:</strong> {order.specialInstructions}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No recent orders.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;