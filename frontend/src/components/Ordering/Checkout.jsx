import React, { useState } from 'react';
import { useCart } from './Cart'; // Cart context is in the same directory
import { orderApi } from '../../services/orderApi';
import '../../styles/checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState('pickup'); // pickup or delivery
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryStreet: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryInstructions: '',
    specialRequests: '',
    paymentMethod: 'credit-card'
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // Store order info including tracking ID
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h3>Your Cart is Empty</h3>
          <p>Please add items to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (orderType === 'delivery') {
      if (!formData.deliveryStreet.trim()) newErrors.deliveryStreet = 'Street address is required';
      if (!formData.deliveryCity.trim()) newErrors.deliveryCity = 'City is required';
      if (!formData.deliveryState.trim()) newErrors.deliveryState = 'State is required';
      if (!formData.deliveryZip.trim()) newErrors.deliveryZip = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerId: 'mock-customer-id', // In real app, this would come from auth
        orderType: orderType.toUpperCase(),
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod.toUpperCase(),
        specialInstructions: formData.specialRequests,
        deliveryAddress: orderType === 'delivery' ? {
          street: formData.deliveryStreet,
          city: formData.deliveryCity,
          state: formData.deliveryState,
          zipCode: formData.deliveryZip,
          country: 'USA', // Default for demo
        } : null,
        items: cartItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          specialInstructions: ''
        }))
      };

      // Call API to create order
      const response = await orderApi.createOrder(orderData);

      if (response.success) {
        setOrderInfo(response.data); // Store order info including tracking ID
        setOrderPlaced(true);
        clearCart(); // Clear the cart after successful order
      } else {
        setErrors({ general: response.message || 'Failed to place order' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success-message">
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-text">Thank you for your order. You will receive a confirmation email shortly.</p>

          {orderInfo && orderInfo.trackingId && (
            <div className="tracking-info">
              <div className="tracking-id-container">
                <p className="tracking-label">Your Order Tracking ID:</p>
                <code className="tracking-id">{orderInfo.trackingId}</code>
              </div>
              <p className="tracking-help">You can use this ID to track your order status in real-time.</p>
            </div>
          )}

          <div className="order-actions">
            <a
              href={`/track-order?trackingId=${orderInfo?.trackingId || ''}`}
              className="track-order-button"
            >
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-title">Complete Your Order</h2>
        <p className="checkout-subtitle">Please provide your details to finalize your order</p>
      </div>

      {errors.general && (
        <div className="error-message">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Order Type Selection */}
        <div className="section">
          <h4 className="section-title">Order Preference</h4>
          <div className="order-type-options">
            <label className={`order-type-option ${orderType === 'pickup' ? 'active' : ''}`}>
              <input
                type="radio"
                name="orderType"
                value="pickup"
                checked={orderType === 'pickup'}
                onChange={(e) => setOrderType(e.target.value)}
                className="order-type-radio"
              />
              <span className="order-type-label">Pickup</span>
              <span className="order-type-description">Collect from our kitchen</span>
            </label>
            <label className={`order-type-option ${orderType === 'delivery' ? 'active' : ''}`}>
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={orderType === 'delivery'}
                onChange={(e) => setOrderType(e.target.value)}
                className="order-type-radio"
              />
              <span className="order-type-label">Delivery</span>
              <span className="order-type-description">We bring it to you</span>
            </label>
          </div>
        </div>

        {/* Customer Details */}
        <div className="section">
          <h4 className="section-title">Personal Information</h4>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your first name"
              />
              {errors.firstName && <div className="error-text">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your last name"
              />
              {errors.lastName && <div className="error-text">{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email address"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Delivery Address (only if delivery is selected) */}
        {orderType === 'delivery' && (
          <div className="section">
            <h4 className="section-title">Delivery Details</h4>

            <div className="form-group">
              <label htmlFor="deliveryStreet" className="form-label">Street Address *</label>
              <input
                type="text"
                id="deliveryStreet"
                name="deliveryStreet"
                value={formData.deliveryStreet}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your street address"
              />
              {errors.deliveryStreet && <div className="error-text">{errors.deliveryStreet}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryCity" className="form-label">City *</label>
                <input
                  type="text"
                  id="deliveryCity"
                  name="deliveryCity"
                  value={formData.deliveryCity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your city"
                />
                {errors.deliveryCity && <div className="error-text">{errors.deliveryCity}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="deliveryState" className="form-label">State *</label>
                <input
                  type="text"
                  id="deliveryState"
                  name="deliveryState"
                  value={formData.deliveryState}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your state"
                />
                {errors.deliveryState && <div className="error-text">{errors.deliveryState}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="deliveryZip" className="form-label">ZIP Code *</label>
                <input
                  type="text"
                  id="deliveryZip"
                  name="deliveryZip"
                  value={formData.deliveryZip}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter ZIP code"
                />
                {errors.deliveryZip && <div className="error-text">{errors.deliveryZip}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="deliveryInstructions" className="form-label">Delivery Instructions</label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
                placeholder="Any special delivery instructions?"
              ></textarea>
            </div>
          </div>
        )}

        {/* Special Requests */}
        <div className="section">
          <h4 className="section-title">Additional Details</h4>
          <div className="form-group">
            <label htmlFor="specialRequests" className="form-label">Special Requests</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
              className="form-textarea"
              placeholder="Any special dietary requirements or requests?"
            ></textarea>
          </div>
        </div>

        {/* Payment Method */}
        <div className="section">
          <h4 className="section-title">Payment Method</h4>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="credit-card">💳 Credit Card</option>
            <option value="debit-card">💳 Debit Card</option>
            <option value="cash-on-delivery">💵 Cash on Delivery</option>
            <option value="digital-wallet">📱 Digital Wallet</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="section">
          <h4 className="section-title">Order Summary</h4>
          <div className="order-summary">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <span className="item-name">{item.quantity}x {item.name}</span>
                </div>
                <div className="order-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="order-total">
              <div className="total-label">Subtotal:</div>
              <div className="total-amount">${cartTotal.toFixed(2)}</div>
            </div>
            <div className="order-tax">
              <div className="tax-label">Tax (8%):</div>
              <div className="tax-amount">${(cartTotal * 0.08).toFixed(2)}</div>
            </div>
            <div className="order-grand-total">
              <div className="grand-total-label">Grand Total:</div>
              <div className="grand-total-amount">${(cartTotal * 1.08).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="place-order-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing Order...
            </>
          ) : (
            `Place ${orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order - $${(cartTotal * 1.08).toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;