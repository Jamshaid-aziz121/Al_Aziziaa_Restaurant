import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';

const MenuGrid = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        // Mock API call - in real implementation, this would be an actual API call
        // const response = await fetch('/api/menu');
        // const data = await response.json();

        // For demo purposes, return mock data
        const mockMenuItems = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            category: 'Appetizers',
            dietaryIndicators: ['vegetarian'],
            available: true,
            featured: true,
            imagePath: '/img/margherita.jpg',
            calories: 800,
          },
          {
            id: '2',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
            price: 9.99,
            category: 'Salads',
            dietaryIndicators: ['vegetarian'],
            available: true,
            featured: false,
            imagePath: '/img/caesar.jpg',
            calories: 450,
          },
          {
            id: '3',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with herbs and lemon butter sauce',
            price: 22.99,
            category: 'Main Courses',
            dietaryIndicators: ['gluten-free', 'dairy-free'],
            available: true,
            featured: true,
            imagePath: '/img/salmon.jpg',
            calories: 650,
          },
          {
            id: '4',
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with ganache frosting',
            price: 7.99,
            category: 'Desserts',
            dietaryIndicators: ['vegetarian'],
            available: true,
            featured: false,
            imagePath: '/img/chocolate-cake.jpg',
            calories: 550,
          },
          {
            id: '5',
            name: 'Chicken Burger',
            description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
            price: 14.99,
            category: 'Main Courses',
            dietaryIndicators: [],
            available: true,
            featured: false,
            imagePath: '/img/burger.jpg',
            calories: 750,
          },
          {
            id: '6',
            name: 'Vegetable Stir Fry',
            description: 'Seasonal vegetables stir-fried in a light soy sauce',
            price: 13.99,
            category: 'Main Courses',
            dietaryIndicators: ['vegan', 'gluten-free'],
            available: true,
            featured: true,
            imagePath: '/img/stir-fry.jpg',
            calories: 400,
          },
        ];

        setMenuItems(mockMenuItems);

        // Get unique categories
        const uniqueCategories = [...new Set(mockMenuItems.map(item => item.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Our Menu</h2>

      {/* Category filter */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Filter by Category:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#007bff' : '#f8f9fa',
                color: selectedCategory === category ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;