export const images = {
  // Food images
  food: require('../assets/images/food.jpg'),
  food1: require('../assets/images/food1.jpg'),
  food2: require('../assets/images/food2.jpg'),
  food3: require('../assets/images/food3.jpg'),
  food4: require('../assets/images/food4.jpg'),
  food5: require('../assets/images/food5.jpg'),
  
  // Dish images
  dish: require('../assets/images/dish.jpg'),
  dish1: require('../assets/images/dish1.jpg'),
  
  // Food item images
  burger: require('../assets/images/burger.png'),
  biryani: require('../assets/images/biryani.png'),
  paneer: require('../assets/images/paneer.png'),
  barger: require('../assets/images/barger.jpg'),
  
  // App icons and logos
  logo: require('../assets/images/logo.jpg'),

  placeholder: require('../assets/images/placeholder.png')
};

// Enhanced categories with icons
export const categories = [
{ id: 1, name: 'All', icon: 'restaurant-outline' , size:'16'},
{ id: 2, name: 'North Indian', icon: 'restaurant',size:'16' },
{ id: 3, name: 'South Indian', icon: 'fast-food-outline' ,size:'16'},
{ id: 4, name: 'Home Style', icon: 'home-outline' ,size:'16'},
{ id: 5, name: 'Veg', icon: 'leaf', iconType: 'material-community',size:'16' },
{ id: 6, name: 'Non-Veg', icon: 'food-drumstick', iconType: 'material-community',size:'16' },
{ id: 7, name: 'Chinese', icon: 'noodles', iconType: 'material-community',size:'16' },
];

// Enhanced filters with more options
export const filters = [
{ id: 1, name: 'Sort', icon: 'sort' },
{ id: 2, name: 'Rating 4.0+', icon: 'star' },
{ id: 3, name: 'Pure Veg', icon: 'leaf', iconType: 'material-community' },
{ id: 4, name: 'Offers', icon: 'local-offer' },
{ id: 5, name: 'Subscription', icon: 'calendar-month' },
{ id: 6, name: 'Free Delivery', icon: 'delivery-dining' },
{ id: 7, name: 'Low Price', icon: 'attach-money' },
];

// Enhanced meal plans with details
export const mealPlans = [
{ 
  id: 1, 
  title: 'Weekly', 
  image: images.food,
  description: 'Save 10% on weekly plans',
  days: 7,
  price: 799
},
{ 
  id: 2, 
  title: 'Monthly', 
  image: images.food1,
  description: 'Save 20% on monthly plans',
  days: 30,
  price: 2899
},
{ 
  id: 3, 
  title: 'Daily', 
  image: images.food2,
  description: 'Flexible daily options',
  days: 1,
  price: 129
},
{ 
  id: 4, 
  title: 'Lunch Only', 
  image: images.food3,
  description: 'Perfect for office workers',
  meal: 'lunch',
  price: 99
},
{ 
  id: 5, 
  title: 'Dinner Only', 
  image: images.food4,
  description: 'Evening meals delivered fresh',
  meal: 'dinner',
  price: 99
},
{ 
  id: 6, 
  title: 'Both Meals', 
  image: images.food5,
  description: 'Complete day meal solution',
  meal: 'both',
  price: 179
},
{ 
  id: 7, 
  title: 'Diet Plan', 
  image: images.food,
  description: 'Calorie-controlled meals',
  type: 'diet',
  price: 149
},
{ 
  id: 8, 
  title: 'Family Pack', 
  image: images.food1,
  description: 'Meals for 3-4 people',
  type: 'family',
  price: 349
},
];

// Promotional banners
export const promotionalBanners = [
{
  id: 1,
  title: 'Fresh Homemade Tiffin',
  subtitle: 'Subscribe & Get 20% OFF',
  image: images.food3,
  buttonText: 'Subscribe Now',
  actionType: 'subscribe'
},
{
  id: 2,
  title: 'Healthy Diet Plan',
  subtitle: 'Customized meals for your fitness goals',
  image: images.food4,
  buttonText: 'View Plans',
  actionType: 'dietPlan',
  planId: 7
},
{
  id: 3,
  title: 'Special Weekend Offer',
  subtitle: 'Free dessert with all weekend meals',
  image: images.food5,
  buttonText: 'Order Now',
  actionType: 'weekendOffer'
}
];

// Dietary preferences options
export const dietaryPreferencesOptions = [
{ id: 1, name: 'Vegetarian', icon: 'leaf', selected: false },
{ id: 2, name: 'Vegan', icon: 'sprout', selected: false },
{ id: 3, name: 'Gluten Free', icon: 'barley-off', selected: false },
{ id: 4, name: 'Low Carb', icon: 'food-apple-outline', selected: false },
{ id: 5, name: 'High Protein', icon: 'arm-flex', selected: false },
{ id: 6, name: 'Dairy Free', icon: 'cow-off', selected: false },
];

// Cuisine options
export const cuisineOptions = [
{ id: 1, name: 'North Indian', selected: false },
{ id: 2, name: 'South Indian', selected: false },
{ id: 3, name: 'Chinese', selected: false },
{ id: 4, name: 'Continental', selected: false },
{ id: 5, name: 'Italian', selected: false },
{ id: 6, name: 'Thai', selected: false },
{ id: 7, name: 'Japanese', selected: false },
{ id: 8, name: 'Mexican', selected: false },
];

// Featured services data
export const featuredServices = [
{
  id: '1',
  name: 'Mom\'s Kitchen',
  rating: 4.8,
  deliveryTime: '30-40',
  distance: '1.2 km',
  speciality: 'Home Style',
  pricePerDay: 129,
  image: images.dish,
  offer: '20% OFF ',
  isFavorite: true,
  cuisine: 'North Indian',
  dietaryTags: ['Pure Veg'],
  subscription: true,
  reviews: 128,
  deliveryFee: 'Free',
  packagingFee: 10,
  address: 'Near KIIT University Gate, Patia',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
},
{
  id: '2',
  name: 'Taste of Punjab',
  rating: 4.5,
  deliveryTime: '25-35',
  distance: '1.5 km',
  speciality: 'North Indian',
  pricePerDay: 149,
  image: images.dish1,
  offer: 'Free delivery',
  isFavorite: false,
  cuisine: 'North Indian',
  dietaryTags: ['Non-Veg Available'],
  subscription: true,
  reviews: 96,
  deliveryFee: 20,
  packagingFee: 5,
  address: 'Damana Square, Chandrasekharpur',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
},
{
  id: '3',
  name: 'South Spice',
  rating: 4.2,
  deliveryTime: '30-45',
  distance: '2.1 km',
  speciality: 'South Indian',
  pricePerDay: 139,
  image: images.food,
  offer: '10% OFF on first order',
  isFavorite: false,
  cuisine: 'South Indian',
  dietaryTags: ['Pure Veg'],
  subscription: true,
  reviews: 75,
  deliveryFee: 25,
  packagingFee: 0,
  address: 'Infocity, Patia',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  }
},
{
  id: '10',
  name: 'Beijing Express',
  rating: 4.4,
  deliveryTime: '35-50',
  distance: '2.5 km',
  speciality: 'Chinese',
  pricePerDay: 159,
  image: images.dish,
  offer: 'Buy 1 Get 1 on first order',
  isFavorite: false,
  cuisine: 'Chinese',
  dietaryTags: ['Non-Veg Available'],
  subscription: true,
  reviews: 64,
  deliveryFee: 30,
  packagingFee: 15,
  address: 'Nandankanan Road, Patia',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
},
];

// Popular services data
export const popularServices = [
{
  id: '4',
  name: 'Health Box',
  rating: 4.6,
  deliveryTime: '20-30',
  distance: '1.0 km',
  speciality: 'Diet Meals',
  pricePerDay: 169,
  image: images.food1,
  offer: 'Healthy options available',
  isFavorite: true,
  cuisine: 'Continental',
  dietaryTags: ['Low Carb', 'High Protein'],
  subscription: true,
  reviews: 112,
  deliveryFee: 'Free',
  packagingFee: 20,
  address: 'Campus 6, KIIT University',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
},
{
  id: '5',
  name: 'Ghar Ka Khana',
  rating: 4.7,
  deliveryTime: '25-35',
  distance: '1.8 km',
  speciality: 'Home Style',
  pricePerDay: 119,
  image: images.food,
  offer: 'Special weekend menu',
  isFavorite: false,
  cuisine: 'North Indian',
  dietaryTags: ['Pure Veg'],
  subscription: true,
  reviews: 89,
  deliveryFee: 15,
  packagingFee: 5,
  address: 'Sailashree Vihar, Chandrasekharpur',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
},
{
  id: '11',
  name: 'Italian Delights',
  rating: 4.3,
  deliveryTime: '40-55',
  distance: '3.2 km',
  speciality: 'Italian',
  pricePerDay: 179,
  image: images.dish1,
  offer: '15% OFF on first order',
  isFavorite: false,
  cuisine: 'Continental',
  dietaryTags: ['Veg Options Available'],
  subscription: false,
  reviews: 52,
  deliveryFee: 40,
  packagingFee: 10,
  address: 'Patia Station Road',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
},
];

// Nearby services data
export const nearbyServices = [
{
  id: '6',
  name: 'Local Delights',
  rating: 4.3,
  deliveryTime: '15-25',
  distance: '0.5 km',
  speciality: 'Multi-Cuisine',
  pricePerDay: 109,
  image: images.food3,
  offer: 'Quick delivery guaranteed',
  isFavorite: false,
  cuisine: 'Multi-Cuisine',
  dietaryTags: ['Veg Options Available'],
  subscription: true,
  reviews: 41,
  deliveryFee: 'Free',
  packagingFee: 5,
  address: 'KIIT Campus Road, Patia',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  }
},
{
  id: '7',
  name: 'The Meal Box',
  rating: 4.1,
  deliveryTime: '20-30',
  distance: '0.8 km',
  speciality: 'Home Style',
  pricePerDay: 99,
  image: images.food2,
  offer: 'Student discount available',
  isFavorite: true,
  cuisine: 'North Indian',
  dietaryTags: ['Pure Veg'],
  subscription: true,
  reviews: 67,
  deliveryFee: 10,
  packagingFee: 0,
  address: 'Campus 3, KIIT University',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
},
{
  id: '12',
  name: 'Thai Corner',
  rating: 4.0,
  deliveryTime: '35-50',
  distance: '1.1 km',
  speciality: 'Thai',
  pricePerDay: 149,
  image: images.dish,
  offer: 'Free soup with meal',
  isFavorite: false,
  cuisine: 'Thai',
  dietaryTags: ['Non-Veg Available'],
  subscription: false,
  reviews: 38,
  deliveryFee: 25,
  packagingFee: 10,
  address: 'Infocity Square, Patia',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
},
];

// Recommended services data
export const recommendedForYou = [
{
  id: '8',
  name: 'Fitness Meals',
  rating: 4.5,
  deliveryTime: '30-45',
  distance: '1.7 km',
  speciality: 'Diet Food',
  pricePerDay: 189,
  image: images.burger,
  offer: 'Customizable meal plans',
  isFavorite: false,
  cuisine: 'Diet',
  dietaryTags: ['Low Carb', 'High Protein'],
  subscription: true,
  reviews: 79,
  deliveryFee: 20,
  packagingFee: 15,
  address: 'Damana Square, Chandrasekharpur',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  }
},
{
  id: '9',
  name: 'Desi Rasoi',
  rating: 4.4,
  deliveryTime: '25-40',
  distance: '2.0 km',
  speciality: 'Home Style',
  pricePerDay: 129,
  image: images.paneer,
  offer: 'First delivery free',
  isFavorite: true,
  cuisine: 'North Indian',
  dietaryTags: ['Pure Veg'],
  subscription: true,
  reviews: 92,
  deliveryFee: 15,
  packagingFee: 5,
  address: 'Patia Market, Bhubaneswar',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  }
}
];

// Active promos
export const activePromos = [
{
  id: 1,
  code: 'FRESH20',
  description: '20% off on your first subscription',
  expiryDate: '2025-03-31',
  discountValue: 20,
  discountType: 'percentage'
},
{
  id: 2,
  code: 'WEEKEND10',
  description: '10% off on weekend orders',
  expiryDate: '2025-03-15',
  discountValue: 10,
  discountType: 'percentage'
},
{
  id: 3,
  code: 'FREEDEL',
  description: 'Free delivery on orders above ₹199',
  expiryDate: '2025-03-20',
  discountValue: 'FREE',
  discountType: 'delivery',
  minOrderValue: 199
},
{
  id: 4,
  code: 'FIRSTMEAL',
  description: 'Flat ₹50 off on your first order',
  expiryDate: '2025-05-31',
  discountValue: 50,
  discountType: 'fixed'
}
];
