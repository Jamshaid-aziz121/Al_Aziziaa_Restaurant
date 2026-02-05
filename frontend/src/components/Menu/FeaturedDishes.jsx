import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';

const FeaturedDishes = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch featured menu items
    const fetchFeaturedItems = async () => {
      try {
        // Mock API call - in real implementation, this would be an actual API call
        // const response = await fetch('/api/menu/featured');
        // const data = await response.json();

        // For demo purposes, return mock data
        const mockFeaturedItems = [
          {
            id: '1',
            name: 'Chef\'s Special Pasta',
            description: 'House-made pasta with seasonal ingredients and signature sauce',
            price: 18.99,
            category: 'Main Courses',
            dietaryIndicators: ['vegetarian'],
            available: true,
            featured: true,
            imagePath: '/img/chef-pasta.jpg',
            calories: 700,
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

        setFeaturedItems(mockFeaturedItems);
      } catch (err) {
        setError('Failed to load featured dishes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (loading) return <div>Loading featured dishes...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Featured Dishes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {featuredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedDishes;