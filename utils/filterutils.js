// Filter types
export const FILTER_TYPES = {
    SORT: 'sort',
    CUISINE: 'cuisine',
    PRICE_RANGE: 'priceRange',
    RATING: 'rating',
    DIETARY: 'dietary',
    DELIVERY_TIME: 'deliveryTime',
  };
  
  // Sort options
  export const SORT_OPTIONS = {
    RATING_HIGH: 'ratingHigh',
    RATING_LOW:  'ratingLow',
    PRICE_LOW: 'priceLow',
    PRICE_HIGH: 'priceHigh',
    DISTANCE_NEAR: 'distanceNear',
    DELIVERY_FAST: 'deliveryFast',
  };
  
  // Cuisine types
  export const CUISINE_TYPES = [
    'North Indian',
    'South Indian',
    'Chinese',
    'Continental',
    'Healthy',
    'Home Style',
    'Multi Cuisine',
  ];
  
  // Dietary preferences
  export const DIETARY_TYPES = [
    'Vegetarian',
    'Non-Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Keto',
    'Low-Carb',
  ];
  
  // Price ranges
  export const PRICE_RANGES = [
    { min: 0, max: 100, label: 'Under ₹100' },
    { min: 100, max: 200, label: '₹100 - ₹200' },
    { min: 200, max: 300, label: '₹200 - ₹300' },
    { min: 300, max: Infinity, label: 'Above ₹300' },
  ];
  
  // Rating options
  export const RATING_OPTIONS = [
    { value: 4.5, label: '4.5+' },
    { value: 4.0, label: '4.0+' },
    { value: 3.5, label: '3.5+' },
  ];
  
  // Delivery time ranges
  export const DELIVERY_TIME_RANGES = [
    { max: 30, label: 'Under 30 mins' },
    { min: 30, max: 45, label: '30-45 mins' },
    { min: 45, max: 60, label: '45-60 mins' },
  ];
  
  // Filter functions
  export const filterByPrice = (items, range) => {
    if (!range) return items;
    return items.filter(item => 
      item.pricePerDay >= range.min && item.pricePerDay <= (range.max || Infinity)
    );
  };
  
  export const filterByRating = (items, minRating) => {
    if (!minRating) return items;
    return items.filter(item => item.rating >= minRating);
  };
  
  export const filterByCuisine = (items, cuisineTypes) => {
    if (!cuisineTypes?.length) return items;
    return items.filter(item => 
      cuisineTypes.some(cuisine => 
        item.speciality.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
  };
  
  export const filterByDietary = (items, dietaryTypes) => {
    if (!dietaryTypes?.length) return items;
    return items.filter(item => 
      dietaryTypes.some(diet => 
        item.dietaryTags?.includes(diet)
      )
    );
  };
  
  export const filterByDeliveryTime = (items, timeRange) => {
    if (!timeRange) return items;
    return items.filter(item => {
      const deliveryMinutes = parseInt(item.deliveryTime.split('-')[0]);
      return deliveryMinutes >= (timeRange.min || 0) && 
             deliveryMinutes <= (timeRange.max || Infinity);
    });
  };
  
  export const sortItems = (items, sortType) => {
    const sorted = [...items];
    switch (sortType) {
      case SORT_OPTIONS.RATING_HIGH:
        return sorted.sort((a, b) => b.rating - a.rating);
      case SORT_OPTIONS.PRICE_LOW:
        return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case SORT_OPTIONS.PRICE_HIGH:
        return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case SORT_OPTIONS.DISTANCE_NEAR:
        return sorted.sort((a, b) => 
          parseFloat(a.distance) - parseFloat(b.distance)
        );
      case SORT_OPTIONS.DELIVERY_FAST:
        return sorted.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
      default:
        return sorted;
    }
  };
  
  // Apply all filters
  export const applyFilters = (items, filters) => {
    let filtered = [...items];
  
    // Apply each filter in sequence
    if (filters.priceRange) {
      filtered = filterByPrice(filtered, filters.priceRange);
    }
    if (filters.rating) {
      filtered = filterByRating(filtered, filters.rating);
    }
    if (filters.cuisineTypes?.length) {
      filtered = filterByCuisine(filtered, filters.cuisineTypes);
    }
    if (filters.dietaryTypes?.length) {
      filtered = filterByDietary(filtered, filters.dietaryTypes);
    }
    if (filters.deliveryTime) {
      filtered = filterByDeliveryTime(filtered, filters.deliveryTime);
    }
    if (filters.sortBy) {
      filtered = sortItems(filtered, filters.sortBy);
    }
  
    return filtered;
  }; 