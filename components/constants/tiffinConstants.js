export const MOCK_SERVICE_DATA = {
  id: '1',
  name: 'Bakingo & Tiffins',
  description: 'Best cakes, tiffins and homestyle meals delivered to your doorstep',
  rating: 4.3,
  reviewCount: 6500,
  deliveryTime: '26 mins',
  distance: '1.4 km',
  location: 'Raj Nagar',
  isVerified: true,
  isPopular: true,
  category: 'Bakery & Tiffin',
  tags: ['Meal', 'Tiffin', 'North Indian', 'South Indian', 'Homestyle', 'Bestseller'],
  menu: [
    {
      id: '1',
      name: 'Premium Veg Thali',
      description: 'A complete meal with 3 rotis, dal, rice, 2 sabzi, raita, salad, and sweet',
      price: 149,
      isVeg: true,
      image: require('../../assets/images/food.jpg'),
      category: 'Tiffin',
      bestSeller: true
    },
    {
      id: '2',
      name: 'South Indian Tiffin',
      description: 'Fresh idli, vada, sambar, coconut chutney, and upma',
      price: 129,
      isVeg: true,
      image: require('../../assets/images/food1.jpg'),
      category: 'Tiffin',
      bestSeller: true
    },
    {
      id: '3',
      name: 'Executive Lunch Box',
      description: '4 rotis, jeera rice, dal makhani, paneer butter masala, and gulab jamun',
      price: 199,
      isVeg: true,
      image: require('../../assets/images/food2.jpg'),
      category: 'Tiffin',
      customizable: true
    },
    {
      id: '4',
      name: 'Home Tiffin',
      description: 'A rich cocoa sponge cake layered with dark chocolate ganache',
      price: 519,
      isVeg: true,
      image: require('../../assets/images/food3.jpg'),
      category: 'South Indian',
      weight: '500g'
    },
    {
      id: '5',
      name: 'Mini Meals Box',
      description: 'Perfect mini meal with rice, dal, 2 rotis, and seasonal veggie',
      price: 99,
      isVeg: true,
      image: require('../../assets/images/food4.jpg'),
      category: 'Tiffin'
    },
    {
      id: '6',
      name: 'Protein Power Box',
      description: 'High protein meal with paneer tikka, sprouts, quinoa, and grilled veggies',
      price: 249,
      isVeg: true,
      image: require('../../assets/images/food.jpg'),
      category: 'Tiffin',
      customizable: true
    },
    {
      id: '7',
      name: 'Meal Box',
      description: 'Fresh cream pineapple cake with real fruit toppings',
      price: 469,
      isVeg: true,
      image: require('../../assets/images/dish.jpg'),
      category: 'Meal',
      weight: '500g'
    },
    {
      id: '8',
      name: 'Keto Lunch Box',
      description: 'Low-carb meal with cauliflower rice, paneer steak, and avocado salad',
      price: 299,
      isVeg: true,
      image: require('../../assets/images/dish1.jpg'),
      category: 'Tiffin',
      customizable: true
    }
  ],
  subscriptionPlans: [
    {
      id: 'weekly',
      name: 'Weekly Plan',
      description: '7 days tiffin service with daily meal options',
      price: 899,
      savings: '15%',
      features: [
        'Daily fresh meals',
        'Flexible delivery time',
        'Customizable portions',
        'Free delivery',
        'Priority support'
      ],
      mealsPerDay: 2,
      cancellationPolicy: 'Free cancellation within 24 hours'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: '30 days tiffin service with premium benefits',
      price: 3499,
      savings: '25%',
      features: [
        'Daily fresh meals',
        'Flexible delivery time',
        'Customizable portions',
        'Free delivery',
        'Priority support',
        'Weekly menu preview',
        'Special occasion meals',
        'Dietary preferences'
      ],
      mealsPerDay: 2,
      cancellationPolicy: 'Free cancellation within 48 hours'
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      description: '365 days tiffin service with exclusive benefits',
      price: 8099,
      savings: '35%',
      features: [
        'Daily fresh meals',
        'Flexible delivery time',
        'Customizable portions',
        'Free delivery',
        'Priority support',
        'Weekly menu preview',
        'Special occasion meals',
        'Dietary preferences',
        'Monthly health checkup',
        'Exclusive member events',
        'Referral rewards'
      ],
      mealsPerDay: 2,
      cancellationPolicy: 'Free cancellation within 72 hours'
    }
  ],
  reviews: [
    {
      id: '1',
      userName: 'John Doe',
      userImage: require('../../assets/images/dish1.jpg'),
      rating: 5,
      text: 'Excellent food quality and service',
      date: '2024-03-15',
      isVerifiedPurchase: true,
      reply: 'Thank you for your kind words! We strive to provide the best service to our customers.'
    }
  ]
};

export const MEAL_PLANS = [
  {
    id: '1',
    name: 'Weekly Plan',
    duration: '7 days',
    price: 999,
    savings: '15%',
    description: 'Perfect for trying out our service'
  },
  {
    id: '2',
    name: 'Monthly Plan',
    duration: '30 days',
    price: 3499,
    savings: '25%',
    description: 'Most popular choice'
  },
  {
    id: '3',
    name: 'Quarterly Plan',
    duration: '90 days',
    price: 8999,
    savings: '35%',
    description: 'Best value for money'
  }
];

export const TIME_SLOTS = [
  { id: '1', time: '8:00 AM - 9:00 AM', available: true },
  { id: '2', time: '9:00 AM - 10:00 AM', available: true },
  { id: '3', time: '10:00 AM - 11:00 AM', available: true },
  { id: '4', time: '11:00 AM - 12:00 PM', available: true },
  { id: '5', time: '12:00 PM - 1:00 PM', available: true }
];

export const DIETARY_PREFERENCES = [
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'low-carb', label: 'Low Carb' }
];

export const CUISINE_TYPES = [
  { id: 'north-indian', label: 'North Indian' },
  { id: 'south-indian', label: 'South Indian' },
  { id: 'continental', label: 'Continental' },
  { id: 'fusion', label: 'Fusion' }
];

export const SORT_OPTIONS = [
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
  { id: 'delivery-time', label: 'Delivery Time' }
];

export const MEAL_PREFERENCES = [
  { id: 'spice_level', name: 'Spice Level', options: ['Mild', 'Medium', 'Spicy'] },
  { id: 'portion', name: 'Portion Size', options: ['Regular', 'Large', 'Extra Large'] },
  { id: 'rice_type', name: 'Rice Type', options: ['White Rice', 'Brown Rice', 'Jeera Rice'] },
  { id: 'roti_type', name: 'Roti Type', options: ['Plain Roti', 'Butter Roti', 'Tandoori Roti'] }
];

export const PORTION_SIZES = [
  { id: 'small', name: 'Small', description: 'Ideal for light eaters' },
  { id: 'regular', name: 'Regular', description: 'Standard portion' },
  { id: 'large', name: 'Large', description: 'Extra serving size' }
]; 
export const MENU_CATEGORIES = ['All', 'Tiffin', 'Meal', 'South Indian', 'North Indian'];

// export const CUISINE_TYPES = ['North Indian', 'South Indian', 'Chinese', 'Continental'];

export const DIET_PREFERENCES = ['Veg', 'Non-Veg', 'Jain', 'Keto', 'Low Calorie'];

// export const MEAL_PLANS = [
//   { id: 'daily', name: 'Daily', days: 1, discount: '0%' },
//   { id: 'weekly', name: 'Weekly', days: 7, discount: '10%' },
//   { id: 'monthly', name: 'Monthly', days: 30, discount: '20%' },
//   { id: 'quarterly', name: 'Quarterly', days: 90, discount: '25%' }
// ];

export const DELIVERY_SLOTS = [
  { id: 'breakfast', time: '7:00 AM - 9:00 AM' },
  { id: 'lunch', time: '12:00 PM - 2:00 PM' },
  { id: 'dinner', time: '7:00 PM - 9:00 PM' }
];

// export const PORTION_SIZES = [
//   { id: 'small', name: 'Small', description: 'Ideal for light eaters' },
//   { id: 'regular', name: 'Regular', description: 'Standard portion' },
//   { id: 'large', name: 'Large', description: 'Extra serving size' }
// ];

// export const MEAL_PREFERENCES = [
//   { id: 'spice_level', name: 'Spice Level', options: ['Mild', 'Medium', 'Spicy'] },
//   { id: 'portion', name: 'Portion Size', options: ['Regular', 'Large', 'Extra Large'] },
//   { id: 'rice_type', name: 'Rice Type', options: ['White Rice', 'Brown Rice', 'Jeera Rice'] },
//   { id: 'roti_type', name: 'Roti Type', options: ['Plain Roti', 'Butter Roti', 'Tandoori Roti'] }
// ];