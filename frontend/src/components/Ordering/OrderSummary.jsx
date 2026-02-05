import React from 'react';
import '../../styles/order-summary.css';

const OrderSummary = ({ order }) => {
  if (!order) {
    return (
      <div className="order-summary-container">
        <div className="no-data-message">
          <p>No order data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <h3 className="order-summary-title">Order Summary</h3>

      <div className="order-overview">
        <div className="overview-item">
          <span className="overview-label">Order ID:</span>
          <span className="overview-value">{order.trackingId || order.id}</span>
        </div>

        <div className="overview-item">
          <span className="overview-label">Order Type:</span>
          <span className="overview-value">{order.orderType}</span>
        </div>

        <div className="overview-item">
          <span className="overview-label">Status:</span>
          <span className={`status-badge status-${order.status.toLowerCase().replace('_', '-')}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        <div className="overview-item">
          <span className="overview-label">Total:</span>
          <span className="overview-value overview-total">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-details">
        <h4 className="details-title">Items Ordered:</h4>
        <div className="items-list">
          {order.orderItems && order.orderItems.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-quantity">{item.quantity}x </span>
                <span className="item-name">{item.menuItem?.name || item.name}</span>
              </div>
              <div className="item-price">${(item.unitPrice * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {order.specialInstructions && (
        <div className="special-instructions">
          <h4 className="instructions-title">Special Instructions:</h4>
          <p className="instructions-content">{order.specialInstructions}</p>
        </div>
      )}

      {order.deliveryAddress && (
        <div className="delivery-address">
          <h4 className="address-title">Delivery Address:</h4>
          <div className="address-content">
            <p className="address-line">{order.deliveryAddress.street}</p>
            <p className="address-line">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
            </p>
            <p className="address-line">{order.deliveryAddress.country}</p>
          </div>
        </div>
      )}

      <div className="order-footer">
        <div className="footer-item">
          <span className="footer-label">Order Date:</span>
          <span className="footer-value">{new Date(order.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;