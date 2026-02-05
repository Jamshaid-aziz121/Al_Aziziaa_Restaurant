import React, { useState } from 'react';
import Layout from '@theme/Layout';

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState([]);

  const mockOrders = [
    {
      id: 'ORD-001',
      status: 'delivered',
      items: ['Grilled Salmon', 'Caesar Salad'],
      total: 37.98,
      estimatedDelivery: '2023-05-15 18:30',
      deliveredAt: '2023-05-15 18:25',
      progress: 100
    },
    {
      id: 'ORD-002',
      status: 'preparing',
      items: ['Beef Tenderloin', 'Chocolate Soufflé'],
      total: 42.98,
      estimatedDelivery: '2023-05-16 19:15',
      deliveredAt: null,
      progress: 40
    },
    {
      id: 'ORD-003',
      status: 'on-the-way',
      items: ['Sparkling Water', 'Chocolate Soufflé'],
      total: 13.98,
      estimatedDelivery: '2023-05-16 20:00',
      deliveredAt: null,
      progress: 75
    }
  ];

  const handleTrack = (e) => {
    e.preventDefault();
    const foundOrder = mockOrders.find(order => order.id === orderId);
    if (foundOrder) {
      setOrderStatus(foundOrder);
      // Set up mock tracking timeline
      setTrackingInfo([
        { id: 1, status: 'Order Placed', time: '18:00', completed: true },
        { id: 2, status: 'Confirmed', time: '18:05', completed: true },
        { id: 3, status: 'Preparing', time: '18:15', completed: foundOrder.progress >= 40 },
        { id: 4, status: 'Ready for Pickup/Delivery', time: '18:45', completed: foundOrder.progress >= 75 },
        { id: 5, status: foundOrder.status === 'delivered' ? 'Delivered' : 'Out for Delivery', time: '19:00', completed: foundOrder.progress >= 100 }
      ]);
    } else {
      setOrderStatus({ error: 'Order not found' });
    }
  };

  return (
    <Layout title="Track Order" description="Track your order status in real-time">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Track Your Order</h1>
            <p>Enter your order ID to track the status of your delivery.</p>

            <form onSubmit={handleTrack} className="margin-vert--lg">
              <div className="row">
                <div className="col col--8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Order ID (e.g., ORD-001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                <div className="col col--4">
                  <button type="submit" className="button button--primary button--block">
                    Track Order
                  </button>
                </div>
              </div>
            </form>

            {orderStatus && !orderStatus.error && (
              <div className="margin-vert--lg">
                <div className="card">
                  <div className="card__header">
                    <h3>Order #{orderStatus.id}</h3>
                    <span className={`badge ${
                      orderStatus.status === 'delivered' ? 'badge--success' :
                      orderStatus.status === 'preparing' ? 'badge--info' :
                      orderStatus.status === 'on-the-way' ? 'badge--warning' : 'badge--secondary'
                    }`}>
                      {orderStatus.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="card__body">
                    <div className="margin-vert--md">
                      <h4>Items Ordered:</h4>
                      <ul>
                        {orderStatus.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <p><strong>Total: ${orderStatus.total}</strong></p>
                    </div>

                    <div className="margin-vert--md">
                      <h4>Progress:</h4>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${orderStatus.progress}%` }}
                          aria-valuenow={orderStatus.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>

                    <div className="margin-vert--md">
                      <h4>Tracking Timeline:</h4>
                      <div className="timeline">
                        {trackingInfo.map(step => (
                          <div key={step.id} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
                            <div className="timeline-marker">
                              <div className={`marker ${step.completed ? 'completed' : ''}`}></div>
                            </div>
                            <div className="timeline-content">
                              <h5>{step.status}</h5>
                              <small>{step.time}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {orderStatus.estimatedDelivery && (
                      <div className="alert alert--info">
                        Estimated {orderStatus.status === 'delivered' ? 'Delivered' : 'Delivery'}: {orderStatus.estimatedDelivery}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {orderStatus && orderStatus.error && (
              <div className="alert alert--danger">
                {orderStatus.error}
              </div>
            )}

            {!orderStatus && (
              <div className="margin-vert--lg">
                <h4>Quick Track</h4>
                <div className="row">
                  {mockOrders.map(order => (
                    <div key={order.id} className="col col--4 margin-vert--sm">
                      <div className="card">
                        <div className="card__body">
                          <h5>#{order.id}</h5>
                          <p className={`badge ${
                            order.status === 'delivered' ? 'badge--success' :
                            order.status === 'preparing' ? 'badge--info' :
                            order.status === 'on-the-way' ? 'badge--warning' : 'badge--secondary'
                          }`}>
                            {order.status.replace('-', ' ').toUpperCase()}
                          </p>
                          <button
                            className="button button--sm button--outline-primary"
                            onClick={() => {
                              setOrderId(order.id);
                              setOrderStatus(order);
                              setTrackingInfo([
                                { id: 1, status: 'Order Placed', time: '18:00', completed: true },
                                { id: 2, status: 'Confirmed', time: '18:05', completed: true },
                                { id: 3, status: 'Preparing', time: '18:15', completed: order.progress >= 40 },
                                { id: 4, status: 'Ready for Pickup/Delivery', time: '18:45', completed: order.progress >= 75 },
                                { id: 5, status: order.status === 'delivered' ? 'Delivered' : 'Out for Delivery', time: '19:00', completed: order.progress >= 100 }
                              ]);
                            }}
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TrackOrderPage;