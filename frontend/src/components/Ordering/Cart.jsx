import React, { useState, useContext, createContext } from 'react';

// Create a context for cart functionality
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (menuItem, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === menuItem.id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...menuItem, quantity }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Component
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Your Cart is Empty</h3>
        <p>Add some delicious items to your cart!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Shopping Cart</h3>

      <div style={{ marginBottom: '20px' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            borderBottom: '1px solid #eee',
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
              <p style={{ margin: '0', color: '#666' }}>${item.price.toFixed(2)} each</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                -
              </button>

              <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                +
              </button>

              <span style={{ minWidth: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '2px solid #ddd',
        paddingTop: '15px',
        textAlign: 'right'
      }}>
        <h4>Total: ${cartTotal.toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default Cart;