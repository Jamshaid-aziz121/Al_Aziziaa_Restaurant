import React from 'react';
import Layout from '@theme/Layout';
import { useState, useEffect } from 'react';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Simulate loading menu items
    setTimeout(() => {
      setMenuItems([
        { id: 1, name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with herbs, lemon butter sauce, and seasonal vegetables', price: 24.99, category: 'Main Course', popular: true, spicy: false, vegetarian: false },
        { id: 2, name: 'Caesar Salad', description: 'Crisp romaine lettuce with parmesan, croutons, and our signature caesar dressing', price: 12.99, category: 'Appetizer', popular: true, spicy: false, vegetarian: true },
        { id: 3, name: 'Beef Tenderloin', description: 'Premium aged beef tenderloin with garlic mashed potatoes and seasonal vegetables', price: 32.99, category: 'Main Course', popular: false, spicy: false, vegetarian: false },
        { id: 4, name: 'Chocolate Soufflé', description: 'Warm chocolate soufflé with vanilla bean ice cream and raspberry coulis', price: 9.99, category: 'Dessert', popular: true, spicy: false, vegetarian: true },
        { id: 5, name: 'Sparkling Water', description: 'Natural mineral water with fresh lime', price: 3.99, category: 'Beverage', popular: false, spicy: false, vegetarian: true },
        { id: 6, name: 'Truffle Risotto', description: 'Creamy arborio rice with wild mushrooms and black truffle', price: 18.99, category: 'Main Course', popular: false, spicy: false, vegetarian: true },
        { id: 7, name: 'Garlic Bread', description: 'Artisan bread with garlic butter and fresh herbs', price: 6.99, category: 'Appetizer', popular: true, spicy: false, vegetarian: true },
        { id: 8, name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', price: 8.99, category: 'Dessert', popular: false, spicy: false, vegetarian: true },
        { id: 9, name: 'House Wine', description: 'Selection of red and white wines by the glass', price: 8.99, category: 'Beverage', popular: false, spicy: false, vegetarian: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <Layout title="Menu" description="Browse our delicious menu items">
      <div className="container margin-vert--lg" style={{ backgroundColor: '#fffaf0' }}>
        <div className="row">
          <div className="col col--10 col--offset-1">
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem',
              padding: '2rem',
              backgroundColor: '#8b4513',
              borderRadius: '10px',
              color: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: "'Georgia', serif"
              }}>Our Exquisite Menu</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Discover our carefully crafted dishes made with the finest ingredients
              </p>
            </div>

            {/* Category Filters */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #8b4513',
                    backgroundColor: selectedCategory === category ? '#8b4513' : 'white',
                    color: selectedCategory === category ? 'white' : '#8b4513',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== category) {
                      e.target.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== category) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text--center" style={{ padding: '3rem' }}>
                <div className="loading-spinner" style={{
                  fontSize: '1.5rem',
                  color: '#8b4513'
                }}>Loading menu items...</div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        borderLeft: item.popular ? '4px solid #ff6b35' : '4px solid transparent',
                        overflow: 'hidden',
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {/* Food Image Placeholder */}
                      <div style={{
                        height: '140px',
                        background: `linear-gradient(135deg, ${
                          item.category === 'Main Course' ? '#8B4513' :
                          item.category === 'Appetizer' ? '#228B22' :
                          item.category === 'Dessert' ? '#FF69B4' :
                          item.category === 'Beverage' ? '#4682B4' : '#8B4513'
                        } 0%, ${
                          item.category === 'Main Course' ? '#A0522D' :
                          item.category === 'Appetizer' ? '#32CD32' :
                          item.category === 'Dessert' ? '#FFB6C1' :
                          item.category === 'Beverage' ? '#87CEEB' : '#A0522D'
                        } 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          fontSize: '3rem',
                          opacity: 0.3,
                          transform: 'rotate(-15deg)'
                        }}>
                          {item.category === 'Main Course' ? '🍽️' :
                           item.category === 'Appetizer' ? '🥗' :
                           item.category === 'Dessert' ? '🍰' :
                           '🥤'}
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          fontSize: '1.5rem'
                        }}>
                          {item.category === 'Main Course' ? '🍖' :
                           item.category === 'Appetizer' ? '🥬' :
                           item.category === 'Dessert' ? '🍦' :
                           '💧'}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div style={{
                        padding: '1rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{
                              margin: 0,
                              fontSize: '1.2rem',
                              color: '#333',
                              fontFamily: "'Georgia', serif",
                              lineHeight: '1.3'
                            }}>
                              {item.name}
                              {item.popular && <span style={{
                                marginLeft: '0.5rem',
                                fontSize: '0.7rem',
                                backgroundColor: '#ff6b35',
                                color: 'white',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '10px',
                                verticalAlign: 'top'
                              }}>Popular</span>}
                            </h3>
                            <span style={{
                              fontSize: '1.1rem',
                              fontWeight: 'bold',
                              color: '#8b4513',
                              minWidth: '50px',
                              textAlign: 'right'
                            }}>
                              ${item.price.toFixed(2)}
                            </span>
                          </div>

                          <p style={{
                            color: '#666',
                            lineHeight: '1.4',
                            marginBottom: '0.75rem',
                            fontStyle: 'italic',
                            fontSize: '0.9rem',
                            maxHeight: '60px',
                            overflow: 'hidden'
                          }}>
                            {item.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {!item.vegetarian && (
                            <span style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '10px'
                            }}>
                              Non-Veg
                            </span>
                          )}
                          {item.vegetarian && (
                            <span style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '10px'
                            }}>
                              Veg
                            </span>
                          )}
                          {item.spicy && (
                            <span style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#ffc107',
                              color: '#212529',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '10px'
                            }}>
                              Spicy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#666',
                    fontSize: '1.1rem'
                  }}>
                    No items found in this category. Please select another category.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px !important;
        }
      `}</style>
    </Layout>
  );
}

export default MenuPage;