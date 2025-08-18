export const restaurants = [
    {
      id: 1,
      name: "Shivam Pahalwan Dhaba",
      rating: 4.1,
      time: 41,
      distance: "2.4 km",
      type: "North Indian",
      priceForOne: 100,
      image: require("../assets/images/food.jpg"),
      offer: "Flat ₹50 OFF above ₹199",
      isVeg: true
    },
    {
      id: 2,
      name: "The Next Ingredient",
      rating: 4.1,
      time: 47,
      distance: "2.9 km",
      type: "Momos • Chinese",
      priceForOne: 250,
      image: require("../assets/images/food1.jpg"),
      offers: [
        "Extra 15% OFF",
        "Flat ₹125 OFF above ₹249"
      ]
    },
    {
      name: "Cake 'O' Clocks",
      rating: 4.3,
      time: 27,
      distance: '1.8 km',
      price: 150,
      offer: 'Flat ₹120 OFF above ₹200',
      type: 'Pure Veg • Desserts',
      image: require('../assets/images/food2.jpg')
    },
    {
      name: 'Annpurna Shudh Shakahari Bhojnalaya',
      rating: 3.9,
      time: 51,
      distance: '5 km',
      price: 150,
      type: 'Pure Veg • North Indian',
      offer: 'Flat ₹120 OFF above ₹200',
      image: require('../assets/images/food3.jpg')
    }
  ];