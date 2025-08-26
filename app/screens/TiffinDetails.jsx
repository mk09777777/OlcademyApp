import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl, ActivityIndicator, Share, Image, Dimensions, Animated } from 'react-native';
import { Text, Button, IconButton, Chip } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import ImageGallery from '../../components/ImageGallery';
// import MenuImage from '../../components/MenuImage';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/tiffinDetailsStyle';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

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

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/api/get-tiffin/${tiffinId}`);
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
  }, [fetchServiceDetails]);

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
            formatted: `$${priceValue.toFixed(2)}`,
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
        `${plan.label}: $${plan.price.toFixed(2)}${plan.discount > 0 ? ` (${plan.discount}% off)` : ''}`
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
      <View key={item.id} style={styles.menuItem}>
        <View style={styles.menuItemImageContainer}>
          <Image
            source={item.image}
            style={styles.menuItemImage}
            resizeMode="cover"
            defaultSource={require('../../assets/images/food1.jpg')}
          />

          {item.bestseller && (
            <View style={styles.bestsellerBadge}>
              <MaterialCommunityIcons name="crown" size={12} color="#FFD700" />
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </View>
          )}

          {item.isVeg !== undefined && (
            <View style={styles.vegBadge}>
              <MaterialCommunityIcons
                name={item.isVeg ? 'circle' : 'triangle'}
                size={12}
                color={item.isVeg ? '#4CAF50' : '#FF4B3A'}
              />
            </View>
          )}

          <View style={styles.addButtonsContainer}>
            <TouchableOpacity
              style={[styles.addButton]}
              onPress={() => handleOpenModal(item)}
            >
              <Text style={styles.addButtonLabel}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuItemContent}>
          <View>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemTitle} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            

            {item.description && (
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
                {item.description.length > 60 && (
                  <Text style={{ color: '#FF4B3A' }}>...more</Text>
                )}
              </Text>
            )}
            <Text style={styles.menuItemPrice}>
              ${item.price || item.basePrice || 0}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [menuState.cartItems, menuState.wishlistItems, handleOpenModal, toggleWishlist]);

  const DeliveryCitiesList = ({ cities }) => {
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3;

    // Split the first item in the cities array (since it's a comma-separated string)
    const allCities = cities.length > 0
      ? cities[0].split(',').map(city => city.trim())
      : [];

    const toggleShowAll = () => {
      setShowAll(!showAll);
    };

    const visibleCities = showAll ? allCities : allCities.slice(0, maxVisible);
    const hasMoreCities = allCities.length > maxVisible;

    return (
      <View style={styles.deliveryCitiesContainer}>

        <View style={styles.citiesWrapper}>
          {visibleCities.map((city, index) => (
            <View key={index} style={styles.cityPill}>
              <Text style={styles.cityText}>{city}</Text>
            </View>
          ))}
          {hasMoreCities && (
            <TouchableOpacity onPress={toggleShowAll} activeOpacity={0.7}>
              <View style={styles.moreLessPill}>
                <Text style={styles.moreLessText}>
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4500" />
        <Text style={styles.errorText}>{error || 'Service not found'}</Text>
        <Button
          mode="contained"
          onPress={fetchServiceDetails}
          style={styles.retryButton}
        >
          Try Again
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={26}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <MaterialCommunityIcons
                name={isFavorite ? "bookmark" : "bookmark-outline"}
                size={30}
                color={isFavorite ? "rgba(222, 10, 10, 0.95)" : "rgba(0, 0, 0, 0.8)"}
              />
            </TouchableOpacity>
            <AntDesign
              name='sharealt'
              size={30}
              color="rgba(0, 0, 0, 0.8)"
              onPress={handleShare}
            />
          </View>
        </View>

        <View style={{ height: 200 }}>
          <ImageGallery
            images={service.images}
            currentIndex={currentImageIndex}
            onIndexChange={setCurrentImageIndex}
            style={{ width: 412, height: 313, borderRadius: 12 }}
          />

          {/* Overlay Container for title + review box */}
          <View style={styles.overlayContainer}>
            {/* Title */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/screens/TiffinDetailsScreen",
                  params: {
                    restaurant: JSON.stringify({
                      ...service,
                      kitchenName: service.title,
                      ratings: service.rating,
                      ownerPhoneNo: {
                        fullNumber: service.phoneNumber,
                      },
                    }),
                  },
                })
              }
              style={styles.titleWrapper}
            >
              <Text
                style={styles.titleText}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {service.title}
              </Text>
            </TouchableOpacity>

            {/* Review Box */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/screens/Reviewsall",
                  params: {
                    firmId: service.id,
                    restaurantName: service.title,
                    averageRating: service.rating.toFixed(1),
                    reviewCount: service.reviews.length,
                  },
                })
              }
              style={styles.reviewBox}
            >
              <View style={styles.reviewBoxTopContainer}>
                <View style={styles.reviewBoxUpperContainer}>
                  <Text style={styles.reviewText}>
                    {service.rating.toFixed(1)}
                  </Text>
                  <FontAwesome name="star" size={18} color="white" />
                </View>
              </View>
              <View style={styles.reviewBoxBottomContainer}>
                <Text style={styles.reviewCount}>{service.reviews.length}</Text>
                <Text style={styles.reviewCount}>Reviews</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.contentContainer}>
          <View style={styles.maincontainer}>
            <View style={styles.headerContainer}>
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
                style={styles.titleButton}
              >
              </TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.infoRow}>
                <DeliveryCitiesList cities={service.deliveryCities} />
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone" size={20} color="#FF69B4" />
                <Text style={styles.infoText}>Contact: {service.phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="truck-delivery"
                  size={20}
                  color="#FF69B4"
                  style={styles.icon}
                />                <Text style={styles.infoText}>Distance: {service.distance}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#FF69B4" />
                <Text style={styles.infoText}>Address: {service.address}</Text>
              </View>
            </View>
          </View>
          {service.offers && service.offers.length > 0 && (
            <View style={styles.offersContainer}>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              {service.offers.map((offer, index) => (
                <View key={index} style={styles.offerItem}>
                  <Text style={styles.offerTitle}>{offer.name}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                  <Text style={styles.offerCode}>Code: {offer.code}</Text>
                </View>
              ))}
            </View>
          )}
          {/* Menu Section */}
          <View style={styles.menuSectionContainer}>
            {/* <Text style={styles.sectionTitle}>Our Menu</Text> */}
            {/* <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  styles.vegFilterButton,
                  menuState.foodFilter === FILTER_OPTIONS.VEG && styles.vegFilterButtonSelected
                ]}
                onPress={() => setMenuState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.VEG }))}
              >
                <MaterialCommunityIcons name="circle" size={16} color="#fff" />
                <Text style={[styles.filterButtonText, styles.vegFilterText]}>Veg</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  styles.nonVegFilterButton,
                  menuState.foodFilter === FILTER_OPTIONS.NON_VEG && styles.nonVegFilterButtonSelected
                ]}
                onPress={() => setMenuState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.NON_VEG }))}
              >
                <MaterialCommunityIcons name="triangle" size={16} color="#fff" />
                <Text style={[styles.filterButtonText, styles.nonVegFilterText]}>Non-Veg</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuCategories}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {MENU_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      menuState.selectedCategory === category && styles.categoryButtonSelected
                    ]}
                    onPress={() => setMenuState(prev => ({ ...prev, selectedCategory: category }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      menuState.selectedCategory === category && styles.categoryButtonTextSelected
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View> */}
            <View style={styles.separatorRow}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>
                 Meals
              </Text>
              <View style={styles.line} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuList}
            >
              {menuState.filteredMenu.length > 0 ? (
                menuState.filteredMenu.map(renderMenuItem)
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="food-off" size={48} color="#666" />
                  <Text style={styles.emptyStateText}>No items found in this category</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.TermsContainer}>
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
            <Text style={styles.description}>{service.termsAndConditions}</Text>
          </View>
        </View>
      </ScrollView>

      {getTotalItems() > 0 && (
        <TouchableOpacity
          style={styles.proceedToCartButton}
          onPress={() => router.push({
            pathname: '/home/Cart',
            params: {
              // offers: JSON.stringify(offers),
              restaurantId: service.id,
              restaurantName: service.title,
            }
          })}
        >
          <Text style={styles.proceedToCartText}>
            {getTotalItems()} items | ${getSubtotal()} | Go to Cart
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default TiffinDetails;