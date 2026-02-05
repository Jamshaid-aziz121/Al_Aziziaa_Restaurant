import React, { useState, useEffect, useRef } from 'react';
import { trackingApi } from '../../services/trackingApi';

const OrderTracker = ({ trackingId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (trackingId) {
      fetchOrderStatus();
      setupWebSocketConnection();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [trackingId]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const response = await trackingApi.getOrderStatusByTrackingId(trackingId);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Failed to fetch order status');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocketConnection = () => {
    // Construct WebSocket URL
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.REACT_APP_SOCKET_URL || `${wsProtocol}//${window.location.hostname}:3001`;
    const wsUrl = `${wsHost}/socket`;

    // Create WebSocket connection
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      // Join the specific order room
      ws.send(JSON.stringify({ type: 'join-order-room', orderId: trackingId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'order-status-update') {
          // Update order status in real-time
          setOrder(prevOrder => {
            if (!prevOrder) return prevOrder;

            return {
              ...prevOrder,
              status: data.status,
              updatedAt: data.timestamp,
              statusHistory: [
                ...prevOrder.statusHistory,
                {
                  status: data.status,
                  timestamp: data.timestamp,
                  notes: data.notes,
                  updatedBy: data.updatedBy
                }
              ]
            };
          });
        } else if (typeof data === 'string') {
          // Handle string messages (legacy format)
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.type === 'order-status-update') {
              setOrder(prevOrder => {
                if (!prevOrder) return prevOrder;

                return {
                  ...prevOrder,
                  status: parsedData.status,
                  updatedAt: parsedData.timestamp,
                  statusHistory: [
                    ...prevOrder.statusHistory,
                    {
                      status: parsedData.status,
                      timestamp: parsedData.timestamp,
                      notes: parsedData.notes,
                      updatedBy: parsedData.updatedBy
                    }
                  ]
                };
              });
            }
          } catch (parseError) {
            console.error('Error parsing string message as JSON:', parseError);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    socketRef.current = ws;
  };

  const getStatusColor = (status) => {
    const colors = {
      RECEIVED: '#2563EB',
      PREPARING: '#1E40AF',
      READY: '#3B82F6',
      'OUT_FOR_DELIVERY': '#1D4ED8',
      'READY_FOR_PICKUP': '#2563EB',
      COMPLETED: '#10B981',
      CANCELLED: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      RECEIVED: '📦',
      PREPARING: '🍳',
      READY: '✅',
      'OUT_FOR_DELIVERY': '🚚',
      'READY_FOR_PICKUP': '🏪',
      COMPLETED: '🎉',
      CANCELLED: '❌',
    };
    return icons[status] || '❓';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Fetching order status...</p>
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

  if (!order) {
    return (
      <div className="alert alert-info" style={{ padding: '15px', borderRadius: '4px' }}>
        Order not found. Please check your tracking ID.
      </div>
    );
  }

  return (
    <div className="order-tracker">
      <h3>Track Your Order</h3>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4>Order #{order.trackingId}</h4>
          <span style={{
            backgroundColor: `${getStatusColor(order.status)}20`,
            color: getStatusColor(order.status),
            padding: '5px 10px',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '10px' }}>
          <div><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</div>
          <div><strong>Type:</strong> {order.orderType}</div>
          <div><strong>Status:</strong> {order.status.replace('_', ' ')}</div>
          <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Status Timeline */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Status Timeline</h4>
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '15px',
            top: '0',
            bottom: '0',
            width: '2px',
            backgroundColor: '#dee2e6',
            zIndex: '1'
          }}></div>

          {order.statusHistory && order.statusHistory.length > 0 ? (
            order.statusHistory.map((history, index) => (
              <div key={index} style={{
                position: 'relative',
                marginBottom: '20px',
                zIndex: '2'
              }}>
                {/* Status indicator */}
                <div style={{
                  position: 'absolute',
                  left: '-31px',
                  top: '5px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(history.status),
                  border: '3px solid white',
                  zIndex: '3'
                }}></div>

                <div style={{
                  backgroundColor: index === order.statusHistory.length - 1 ? `${getStatusColor(history.status)}20` : '#f8f9fa',
                  padding: '10px',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getStatusColor(history.status)}`
                }}>
                  <div style={{ fontWeight: 'bold', color: getStatusColor(history.status) }}>
                    {getStatusIcon(history.status)} {history.status.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                    {new Date(history.timestamp).toLocaleString()}
                  </div>
                  {history.notes && (
                    <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
                      {history.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No status updates yet.</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4>Order Items</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>{item.quantity}x {item.menuItem?.name || item.menuItemId}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;