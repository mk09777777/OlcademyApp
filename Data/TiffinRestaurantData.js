export const tiffinRestaurants = [
    {
      id: 1,
      name: "Ghar Ka Khana Tiffin Service",
      rating: 4.3,
      deliveryTime: 30,
      distance: "2.1 km",
      speciality: "North Indian Home Food",
      pricePerDay: 120,
      image: require("../assets/images/food1.jpg"),
      offer: "First week 20% OFF",
      isVeg: true
    },
    {
      id: 2,
      name: "Mom's Kitchen Tiffin",
      rating: 4.5,
      deliveryTime: 25,
      distance: "1.8 km",
      speciality: "Multi-Cuisine Meals",
      pricePerDay: 150,
      image: require("../assets/images/food2.jpg"),
      offers: [
        "Monthly subscription 25% OFF",
        "Free delivery for weekly plan"
      ]
    },
    {
      id: 3,
      name: "South Indian Tiffin Hub",
      rating: 4.2,
      deliveryTime: 35,
      distance: "3.0 km",
      speciality: "South Indian",
      pricePerDay: 130,
      image: require("../assets/images/food3.jpg"),
      offer: "Free sweet with lunch"
    }
  ];