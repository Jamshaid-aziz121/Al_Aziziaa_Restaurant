import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import '../styles/order-page.css'; // Import the enhanced styles

function OrderPage() {
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('pickup');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const menuItems = [
    { id: 1, name: 'Grilled Salmon Special', description: 'Fresh Atlantic salmon grilled to perfection with aromatic herbs, lemon butter sauce, and seasonal vegetables. A healthy and flavorful dish that\'s rich in omega-3 fatty acids.', price: 28.99, category: 'main', image: '/images/menu/grilled-salmon.jpg' },
    { id: 2, name: 'Classic Caesar Salad', description: 'Crisp romaine lettuce tossed in our signature homemade Caesar dressing, topped with freshly grated parmesan cheese, garlic croutons, and a touch of truffle oil.', price: 14.99, category: 'appetizer', image: '/images/menu/caesar-salad.jpg' },
    { id: 3, name: 'Premium Beef Tenderloin', description: 'Tender 8oz beef tenderloin cooked to perfection, served with roasted seasonal vegetables, mashed potatoes, and our signature red wine reduction sauce.', price: 36.99, category: 'main', image: '/images/menu/beef-tenderloin.jpg' },
    { id: 4, name: 'Decadent Chocolate Soufflé', description: 'Rich, warm chocolate soufflé with a molten center, served alongside premium vanilla bean ice cream and fresh berries. A perfect ending to your meal.', price: 12.99, category: 'dessert', image: '/images/menu/chocolate-souffle.jpg' },
    { id: 5, name: 'Sparkling Mineral Water', description: 'Premium imported natural mineral water with a delicate hint of fresh lime. Refreshing and naturally carbonated with pure, crisp taste.', price: 5.99, category: 'drink', image: '/images/menu/sparkling-water.jpg' },
    { id: 6, name: 'Truffle Mushroom Risotto', description: 'Creamy arborio rice cooked with wild mushrooms, white truffle oil, parmesan cheese, and fresh herbs. A luxurious vegetarian option.', price: 22.99, category: 'main', image: '/images/menu/mushroom-risotto.jpg' },
    { id: 7, name: 'Bruschetta Trio', description: 'Three varieties of bruschetta: classic tomato basil, goat cheese with honey, and mushroom & thyme. Served on toasted artisan bread.', price: 13.99, category: 'appetizer', image: '/images/menu/bruschetta.jpg' },
    { id: 8, name: 'Tiramisu Classico', description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers, mascarpone cream, and cocoa powder. Made with premium ingredients.', price: 11.99, category: 'dessert', image: '/images/menu/tiramisu.jpg' },
    { id: 9, name: 'House Red Wine Selection', description: 'Glass of our finest house red blend, a full-bodied wine with notes of dark fruit and subtle oak. Perfectly paired with our main courses.', price: 10.99, category: 'drink', image: '/images/menu/red-wine.jpg' },
    { id: 10, name: 'Artisan Cheese Board', description: 'Selection of 5 premium cheeses, served with fresh fruits, nuts, and artisan crackers. Perfect for sharing.', price: 18.99, category: 'appetizer', image: '/images/menu/cheese-board.jpg' },
  ];

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.08;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  return (
    <Layout title="Place Order" description="Order food from Aziz Restaurant">
      <div className="order-page-container">
        <div className="restaurant-container">
          <div className="order-page-header">
            <img src="/images/restaurant-logo.svg" alt="Aziz Restaurant Logo" className="restaurant-logo" />
            <h1 className="order-page-title">Experience Culinary Excellence</h1>
            <p className="order-page-subtitle">Crafted with passion, served with love - discover our finest selections</p>
          </div>

          <div className="row">
            {/* Menu Items */}
            <div className="col col--8">
              <div className="menu-section">
                <div className="menu-filters">
                  <h2>Our Signature Menu</h2>
                  <div className="category-filters">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="menu-grid">
                  {filteredMenuItems.map(item => (
                    <div key={item.id} className={`menu-item-card ${item.category}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-item-image-placeholder"
                        onError={(e) => {
                          e.target.style.background = 'linear-gradient(45deg, #8e44ad 0%, #3498db 100%)';
                          e.target.style.display = 'flex';
                          e.target.style.alignItems = 'center';
                          e.target.style.justifyContent = 'center';
                          e.target.textContent = item.name;
                        }}
                      />
                      <div className="menu-item-body">
                        <span className={`menu-category-badge ${item.category}`}>{item.category}</span>
                        <h3 className="menu-item-name">{item.name}</h3>
                        <p className="menu-item-description">{item.description}</p>
                        <p className="menu-item-price">${item.price.toFixed(2)}</p>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="col col--4">
              <div className="cart-section">
                <h2>Your Culinary Journey</h2>
                {cart.length === 0 ? (
                  <div className="empty-cart-message">
                    <p>Your cart is empty</p>
                    <p>Discover our exquisite dishes and begin your culinary adventure!</p>
                  </div>
                ) : (
                  <div>
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <div className="cart-item-controls">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="quantity-input"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ×
                          </button>
                        </div>
                        <small>${item.price.toFixed(2)} × {item.quantity}</small>
                      </div>
                    ))}
                    <div className="cart-breakdown">
                      <div className="cart-subtotal">
                        Subtotal: <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="cart-tax">
                        Tax (8%): <span>${calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="cart-total">
                        Grand Total: <span>${calculateGrandTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="order-type-selector">
                      <div className="form-group">
                        <label className="order-type-label">
                          <input
                            type="radio"
                            name="orderType"
                            className="order-type-input"
                            checked={orderType === 'pickup'}
                            onChange={() => setOrderType('pickup')}
                          />
                          <span>Pickup - Collect from our kitchen</span>
                        </label>
                        <label className="order-type-label">
                          <input
                            type="radio"
                            name="orderType"
                            className="order-type-input"
                            checked={orderType === 'delivery'}
                            onChange={() => setOrderType('delivery')}
                          />
                          <span>Delivery - We bring it to you</span>
                        </label>
                      </div>
                    </div>

                    <button className="place-order-btn">
                      Complete Your Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderPage;