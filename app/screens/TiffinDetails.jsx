import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator, Share, Image, Dimensions, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import ImageGallery from '../../components/ImageGallery';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';
import styles from '../../styles/tiffinDetailsStyle';
const Api_url = API_CONFIG.BACKEND_URL;
const { width } = Dimensions.get('window');

const MENU_CATEGORIES = [
  'All',
  'Recommended',
  'Thali',
  'Meals',
  'Combos',
  'Specials'
];

const FILTER_OPTIONS = {
  ALL: 'all',
  VEG: 'veg',
  NON_VEG: 'non-veg',
};

const calculateDiscount = (planLabel) => {
  const days = parseInt(planLabel);
  if (days >= 100) return 20;
  if (days >= 75) return 18;
  if (days >= 45) return 15;
  if (days >= 30) return 15;
  if (days >= 7) return 10;
  return 0;
};

const getDiscountText = (planLabel) => {
  const discount = calculateDiscount(planLabel);
  return discount > 0 ? `${discount}% off` : 'No discount';
};

const TiffinDetails = () => {
  const { addToCart, getCartItems, getTotalItems, getSubtotal } = useCart();
  const router = useRouter();
  const { tiffinId } = useLocalSearchParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [localTaxes, setLocalTaxes] = useState([]);
  const [localCharges, setLocalCharges] = useState([]);
  const [localOffers, setLocalOffers] = useState([]);
  const [menuState, setMenuState] = useState({
    cartItems: {},
    selectedCategory: 'All',
    filteredMenu: [],
    wishlistItems: {},
    foodFilter: FILTER_OPTIONS.ALL,
    showCustomization: false,
    selectedMenuItem: null
  });
  const UploadRecentlyViewd = useCallback(async () => {
    try {
      const restId = tiffinId;
      if (!restId) {
        console.warn("No restaurant ID available for recently viewed tracking");
        return;
      }

      const response = await axios.post(
        `${Api_url}/firm/recently-viewed/${restId}`,
        {},
        { withCredentials: true }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      console.log("Recently viewed uploaded successfully:", response.data);
    } catch (err) {
      console.error("Failed to upload recently viewed:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
    }
  }, [tiffinId]);

  const fetchServiceDetails = useCallback(async () => {
    if (!tiffinId) {
      setError('No tiffinId provided');
      Alert.alert('Error', 'No tiffin service ID provided');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const response = await axios.get(`${Api_url}/api/get-tiffin/${tiffinId}`);
      const { success, tiffin } = response.data;
      
      if (success && tiffin) {
        const transformedData = transformServiceData(tiffin);
        setService(transformedData);

        if (tiffin.images?.length > 0) {
          setMainImage(tiffin.images[0]);
        } else {
          setMainImage(require('../../assets/images/food1.jpg'));
        }

        setLocalTaxes(tiffin.tax?.filter((tax) => tax.isApplicable) || []);
        setLocalCharges(tiffin.charges?.filter((charge) => charge.isApplicable) || []);
        setLocalOffers(tiffin.offers?.filter((offer) => offer.active) || []);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      setError(error.message || 'Failed to load service details');

      let errorMessage = 'Failed to load service details';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid tiffin service ID';
        } else if (error.response.status === 404) {
          errorMessage = 'Tiffin service not found';
        }
      } else if (error.request) {
        errorMessage = 'No response from server';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tiffinId]);

  useEffect(() => {
    fetchServiceDetails();
    UploadRecentlyViewd();
  }, [fetchServiceDetails, UploadRecentlyViewd]);

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, [getCartItems]);

  useEffect(() => {
    if (!service?.menu) return;

    let filtered = menuState.selectedCategory === 'All'
      ? service.menu
      : service.menu.filter(item => item.category === menuState.selectedCategory);

    if (menuState.foodFilter !== FILTER_OPTIONS.ALL) {
      filtered = filtered.filter(item => {
        if (menuState.foodFilter === FILTER_OPTIONS.VEG) return item.isVeg === true;
        if (menuState.foodFilter === FILTER_OPTIONS.NON_VEG) return item.isVeg === false;
        return true;
      });
    }

    setMenuState(prev => ({ ...prev, filteredMenu: filtered }));
  }, [service?.menu, menuState.selectedCategory, menuState.foodFilter]);

  const transformServiceData = (tiffinData) => {
    const planMap = {};
    tiffinData.menu.plans.forEach(plan => {
      planMap[plan._id] = plan;
    });

    let allPlans = [...tiffinData.menu.plans];
    if (tiffinData.menu.isFlexibleDates) {
      if (!allPlans.some(p => p.label === "Custom Date Range")) {
        allPlans.push({ _id: "date-range", label: "Custom Date Range", duration: 0 });
      }
      if (!allPlans.some(p => p.label === "Flexible Dates")) {
        allPlans.push({ _id: "flexi-dates", label: "Flexible Dates", duration: 0 });
      }
    }

    return {
      id: tiffinData._id,
      title: tiffinData.kitchenName,
      rating: parseFloat(tiffinData.ratings) || 0,
      reviews: tiffinData.reviews || [],
      prices: transformPrices(tiffinData.menu.mealTypes, planMap),
      mealTypes: tiffinData.menu.plans.map(plan => ({
        id: plan._id,
        label: `${plan.label} ${plan.label === '1' ? 'Day' : 'Days'}`,
        value: `${plan.label}-day`,
        price: tiffinData.menu.mealTypes[0]?.prices?.[plan._id] || 0,
        discount: calculateDiscount(plan.label),
        discountText: getDiscountText(plan.label),
        days: parseInt(plan.label)
      })),
      deliveryCities: tiffinData.deliveryCity || [],
      images: tiffinData.images.length > 0
        ? tiffinData.images
        : [require('../../assets/images/food1.jpg')],
      menu: transformMenu(tiffinData, planMap),
      termsAndConditions: tiffinData.menu.instructions?.map(i => `${i.title}: ${i.details}`).join('\n\n') || 'No terms available',
      isVerified: true,
      isPopular: parseFloat(tiffinData.ratings) >= 4.0,
      deliveryTime: tiffinData.deliveryTime || '30-45 mins',
      distance: tiffinData.distance || '2.5 km',
      tags: tiffinData.category || [],
      phoneNumber: tiffinData.ownerPhoneNo?.fullNumber || 'Not available',
      planMap,
      isFlexibleDates: tiffinData.menu.isFlexibleDates || false,
      deliveryTimeSlots: tiffinData.deliveryTimeSlots || [],
      address: tiffinData.address || '',
      taxes: localTaxes,
      charges: localCharges,
      offers: localOffers
    };
  };

  const transformPrices = (mealTypes, planMap) => {
    const prices = {};
    mealTypes.forEach(meal => {
      if (meal.specificPlans && meal.specificPlans.length > 0) {
        meal.specificPlans.forEach(planId => {
          const planLabel = planMap[planId]?.label || planId;
          const priceValue = meal.prices[planId] || 0;
          prices[`${meal.label}-${planLabel}`] = {
            price: priceValue,
            formatted: `₹${priceValue.toFixed(2)}`,
            planId: planId
          };
        });
      }
    });
    return prices;
  };

  const transformMenu = (tiffinData, planMap) => {
    return tiffinData.menu.mealTypes.map(meal => {
      const availablePlans = tiffinData.menu.plans
        .filter(plan => meal.specificPlans.includes(plan.label))
        .map(plan => ({
          id: plan._id,
          label: `${plan.label} ${plan.label === '1' ? 'Day' : 'Days'}`,
          price: meal.prices?.[plan._id] || 0,
          days: parseInt(plan.label),
          discount: calculateDiscount(plan.label),
          discountText: getDiscountText(plan.label)
        }));

      if (tiffinData.menu.isFlexibleDates) {
        availablePlans.push({
          id: 'date-range',
          label: 'Custom Date Range',
          price: meal.prices?.[tiffinData.menu.plans.find(p => p.label === '1')?._id] || 0,
          days: 0,
          discount: 0,
          discountText: 'No discount'
        });
        availablePlans.push({
          id: 'flexi-dates',
          label: 'Flexible Dates',
          price: meal.prices?.[tiffinData.menu.plans.find(p => p.label === '1')?._id] || 0,
          days: 0,
          discount: 0,
          discountText: 'No discount'
        });
      }

      const priceDisplay = availablePlans.map(plan =>
        `${plan.label}: ₹${plan.price.toFixed(2)}${plan.discount > 0 ? ` (${plan.discount}% off)` : ''}`
      ).join(' | ');
      const mealImage = meal.images?.length > 0
        ? { uri: meal.images[0] }
        : require('../../assets/images/food1.jpg');

      return {
        id: meal.mealTypeId,
        name: meal.label,
        basePrice: availablePlans[0]?.price || 0,
        price: availablePlans[0]?.price || 0,
        priceDisplay: priceDisplay,
        description: meal.description || 'No description available',
        isVeg: tiffinData.category?.includes('veg') || true,
        mealTypes: [meal.label],
        timeSlots: tiffinData.deliveryTimeSlots || [],
        customizable: true,
        isAddOn: meal.label.includes('Extra') || meal.label.includes('Add-On'),
        category: (meal.label.includes('Extra') || meal.label.includes('Add-On')) ? 'Extras' : 'Meals',
        image: mealImage,
        rating: parseFloat(tiffinData.ratings) || 0,
        availablePlans: availablePlans,
        prices: meal.prices,
        availableAddons: meal.addons || [],
        specificPlans: meal.specificPlans || []
      };
    });
  };

  const handleOpenModal = (item) => {
    if (!item || !service) {
      console.error('No meal item or service provided', { item, service });
      return;
    }
    const firstImage = service.images.length > 0 ? service.images[0] : require('../../assets/images/food1.jpg');
    router.push({
      pathname: '/screens/MealCustomizeScreen',
      params: {
        mealItem: JSON.stringify({
          ...item,
          id: item.id,
          image: item.image || require('../../assets/images/food1.jpg'),
          name: item.name || 'Custom Meal',
          basePrice: item.basePrice || 0,
          taxes: localTaxes,
          charges: localCharges,
          offers: localOffers,
          isFlexibleDates: service.isFlexibleDates,
          deliveryTimeSlots: service.deliveryTimeSlots || [],
          category: service.tags || [],
          description: item.description || '',
          foodType: item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'
        }),
        planTypes: JSON.stringify(service.mealTypes || []),
        timeSlots: JSON.stringify(service.deliveryTimeSlots || []),
        firmId: service.id,
        restaurantName: service.title,
        img: firstImage,
        returnScreen: router.pathname,
      }
    });
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleShare = () => {
    if (!service) return;

    Share.share({
      message: `Check out ${service.title} on our app!`,
      title: service.title
    });
  };

  const toggleWishlist = useCallback((itemId) => {
    setMenuState(prev => {
      const newItems = { ...prev.wishlistItems };
      const isAdded = !newItems[itemId];

      if (newItems[itemId]) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = true;
      }

      return { ...prev, wishlistItems: newItems };
    });
  }, []);

  const renderMenuItem = useCallback((item) => {
    if (!item?.id || !item?.name) return null;
    return (
      <View
        key={item.id}
        className="flex-row items-stretch w-[370px] h-[110px] bg-white border border-[#c1c1c1] rounded-xl mb-3 p-[5px] shadow-sm"
      >
        
        <View className="w-[100px] h-full items-center justify-start pt-1">
          <View className="relative w-[85px] h-[85px] rounded-xl overflow-hidden border border-[#c1c1c1]">
            <Image
              source={item.image}
              resizeMode="cover"
              defaultSource={require('../../assets/images/food1.jpg')}
              className="w-full h-full"
            />

            {/* Veg / Non-Veg Badge */}
            {item.isVeg !== undefined && (
              <View className="absolute top-1 left-1 bg-white rounded-full p-[2px]">
                <MaterialCommunityIcons
                  name={item.isVeg ? 'circle' : 'triangle'}
                  size={12}
                  color={item.isVeg ? '#4CAF50' : '#FF4B3A'}
                />
              </View>
            )}
          </View>

        </View>

        {/* Right Section - Content */}
        <View className="flex-1 pl-4 pr-2 py-1 justify-between">
          <View>
            {/* Item Title */}
            <Text className="text-[16px] font-bold text-[#333] mb-1" numberOfLines={1}>
              {item.name}
            </Text>

            {/* Description */}
            {item.description && (
              <Text
                className="text-[13px] text-[#666] leading-[18px]"
                numberOfLines={1}
              >
                {item.description}
                {item.description.length > 60 && (
                  <Text className="text-[#FF4B3A]">...more</Text>
                )}
              </Text>
            )}

            <View className="flex-row items-center justify-between mt-1">
              {/* Price */}
              <Text className="text-[16px] font-bold text-[#FF4B3A]">
                ₹ {item.price || item.basePrice || 0}
              </Text>

              <TouchableOpacity
                onPress={() => handleOpenModal(item)}
                className="bg-[#FF4B3F] rounded-lg w-20 py-1"
              >
                <Text className="text-white text-[14px] font-bold text-center">
                  ADD
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }, [menuState.cartItems, menuState.wishlistItems, handleOpenModal, toggleWishlist]);

  const DeliveryCitiesList = ({ cities }) => {
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3;

    // Process the cities data correctly - split the first item by commas
    // const allCities = cities.length > 0
    // 	? cities[0].split(',').map(city => city.trim()).filter(city => city.length > 0)
    // 	: [];
    const allCities = cities
    // console.log(allCities)
    const toggleShowAll = () => {
      setShowAll(!showAll);
    };

    const visibleCities = showAll ? allCities : allCities.slice(0, maxVisible);
    const hasMoreCities = allCities.length > maxVisible;

    return (
      <View className="mb-4">
        <View className="flex-row flex-wrap">
          {visibleCities.map((city, index) => (
            <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-sm font-outfit color-gray-700">{city}</Text>
            </View>
          ))}
          {hasMoreCities && (
            <TouchableOpacity onPress={toggleShowAll} activeOpacity={0.7}>
              <View className="bg-primary px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-sm font-outfit-bold text-white">
                  {showAll ? 'Show Less' : `+${allCities.length - maxVisible} More`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  if (loading && !service) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FF002E" />
        <Text className="text-textsecondary font-outfit mt-4">Loading service details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#FF002E" />
        <Text className="text-primary text-center font-outfit mb-4">{error || 'Service not found'}</Text>
        <Button
          mode="contained"
          onPress={fetchServiceDetails}
          buttonColor="#FF002E"
        >
          Try Again
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1 bg-background">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View className="flex-row justify-between items-center px-4 pt-4 pb-2 bg-white">
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="black" 
            onPress={() => router.back()} 
          />
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <MaterialCommunityIcons
                name={isFavorite ? "bookmark" : "bookmark-outline"}
                size={30}
                color={isFavorite ? "#FF002E" : "rgba(0, 0, 0, 0.8)"}
              />
            </TouchableOpacity>
            <AntDesign
              name='share-alt'
              size={30}
              color="rgba(0, 0, 0, 0.8)"
              onPress={handleShare}
            />
          </View>
        </View>

        <View className="h-80">
          <ImageGallery
            images={service.images}
            currentIndex={currentImageIndex}
            onIndexChange={setCurrentImageIndex}
          />
          <View className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/screens/TiffinDetailsScreen',
                params: {
                  restaurant: JSON.stringify({
                    ...service,
                    kitchenName: service.title,
                    ratings: service.rating,
                    menu: service.menu,
                    deliveryCity: service.deliveryCities,
                    category: service.tags,
                    ownerPhoneNo: {
                      fullNumber: service.phoneNumber
                    }
                  })
                }
              })}
              className="mb-3"
            >
              <View className="mb-2">
                <Text
                  className="text-xl font-outfit-bold color-gray-900"
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {service.title}
                </Text>
                
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="phone" size={20} color="#078518ff" />
                <Text className="text-sm font-outfit color-gray-700 ml-2">Contact: {service.phoneNumber}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/screens/Reviewsall",
                params: {
                  firmId: service.id,
                  restaurantName: service.title,
                  averageRating: service.rating.toFixed(1),
                  reviewCount: service.reviews.length,
                  reviewType: 'tiffin',
                }
              })}
              className="bg-primary rounded-lg p-3 min-w-20 items-center"
            >
              <View className="flex-row items-center mb-1">
                <Text className="text-white font-outfit-bold text-lg mr-1">
                  {service.rating.toFixed(1)}
                </Text>
                <FontAwesome name="star" size={18} color="white" />
              </View>
              <View className="items-center">
                <Text className="text-white font-outfit text-xs">
                  {service.reviews.length}
                </Text>
                <Text className="text-white font-outfit text-xs">Reviews</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-4">
          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="mb-4">
              <DeliveryCitiesList cities={service.deliveryCities} />
            </View>
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#666" />
              <Text className="text-sm font-outfit color-gray-700 ml-2 flex-1">Distance: {service.distance}</Text>
            </View>

            <View className="flex-row items-center">
              <MaterialCommunityIcons name="home" size={24} color="#666" />
              <Text className="text-sm font-outfit color-gray-700 ml-2 flex-1" numberOfLines={2}
                ellipsizeMode="tail">Address: {service.address}</Text>
            </View>
          </View>
          {service.offers && service.offers.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Special Offers</Text>
              {service.offers.map((offer, index) => (
                <View key={index} className="bg-green-50 p-3 rounded-lg mb-2">
                  <Text className="text-base font-outfit-bold color-gray-900">{offer.name}</Text>
                  <Text className="text-sm font-outfit color-gray-700 mt-1">{offer.description}</Text>
                  <Text className="text-sm font-outfit-bold color-primary mt-1">Code: {offer.code}</Text>
                </View>
              ))}
            </View>
          )}
          {/* Menu Section */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-border" />
              <Text className="text-textsecondary font-outfit-bold mx-4 text-sm">
                Tiffin Meals
              </Text>
              <View className="flex-1 h-px bg-border" />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-4"
            >
              {menuState.filteredMenu.length > 0 ? (
                menuState.filteredMenu.map(renderMenuItem)
              ) : (
                <View className="flex-1 items-center justify-center py-8">
                  <MaterialCommunityIcons name="food-off" size={48} color="#666" />
                  <Text className="text-base font-outfit color-gray-600 text-center mt-2">No items found in this category</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Terms & Conditions</Text>
            <Text className="text-sm font-outfit color-gray-700 leading-5">{service.termsAndConditions}</Text>
          </View>
        </View>
      </ScrollView>

      {getTotalItems() > 0 && (
        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 bg-primary p-4 m-4 rounded-lg"
          onPress={() => router.push({
            pathname: '/home/Cart',
            params: {
              restaurantId: service.id,
              restaurantName: service.title,
            }
          })}
        >
          <Text className="text-white text-center font-outfit-bold">
            {getTotalItems()} items | ${getSubtotal()} | Go to Cart
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default TiffinDetails;
