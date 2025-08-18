export const collections = [
  {
    id: '1',
    type: 'tiffin',
    title: 'Homestyle Tiffin',
    description: 'Discover authentic homemade meals from local chefs',
    image: require('../assets/images/food.jpg'),
    dishes: 25,
    restaurants: 8,
    featured: true
  },
  {
    id: '2',
    type: 'tiffin',
    title: 'Premium Tiffin',
    description: 'Gourmet meals prepared by professional chefs',
    image: require('../assets/images/dish1.jpg'),
    dishes: 30,
    restaurants: 5,
    featured: true
  },
  {
    id: '3',
    type: 'dining',
    title: 'Fine Dining',
    description: 'Exclusive restaurants for special occasions',
    image: require('../assets/images/food1.jpg'),
    dishes: 100,
    restaurants: 15,
    featured: true
  },
  {
    id: '4',
    type: 'dining',
    title: 'Casual Dining',
    description: 'Relaxed atmosphere with great food',
    image: require('../assets/images/food2.jpg'),
    dishes: 150,
    restaurants: 25,
    featured: false
  },
  {
    id: '5',
    type: 'events',
    title: 'Food Festival',
    description: 'Annual food celebration with multiple cuisines',
    image: require('../assets/images/food3.jpg'),
    date: 'March 25-27, 2025',
    location: 'City Center',
    featured: true
  },
  {
    id: '6',
    type: 'events',
    title: 'Chef\'s Table',
    description: 'Exclusive dining experience with top chefs',
    image: require('../assets/images/dish.jpg'),
    date: 'April 5, 2025',
    location: 'Grand Hotel',
    featured: true
  },
  {
    id: '7',
    type: 'tiffin',
    title: 'Diet Tiffin',
    description: 'Healthy and nutritious meal plans',
    image: require('../assets/images/food2.jpg'),
    dishes: 20,
    restaurants: 6,
    featured: false
  },
  {
    id: '8',
    type: 'dining',
    title: 'Family Restaurants',
    description: 'Perfect spots for family gatherings',
    image: require('../assets/images/food1.jpg'),
    dishes: 120,
    restaurants: 18,
    featured: false
  },
  {
    id: '9',
    type: 'events',
    title: 'Cooking Workshop',
    description: 'Learn from professional chefs',
    image: require('../assets/images/food.jpg'),
    date: 'April 15, 2025',
    location: 'Culinary Institute',
    featured: false
  }
];