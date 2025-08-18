import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import styles from '../styles/menuSectionStyle';
import { useSafeNavigation } from '@/hooks/navigationPage';
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

const MenuSection = ({
  menu = [],
  onAddToCart,
  onCustomize,
  onAddToWishlist,
  loading = false,
  error = null,
  theme = {},
  plans = [] // Added plans to destructured props
}) => {
  const { safeNavigation } = useSafeNavigation();
  const router = useRouter();
  const [state, setState] = useState({
    cartItems: {},
    selectedCategory: 'All',
    filteredMenu: [],
    wishlistItems: {},
    foodFilter: FILTER_OPTIONS.ALL,
    showCustomization: false,
    selectedMenuItem: null
  });

  useEffect(() => {
    let filtered = state.selectedCategory === 'All'
      ? menu
      : menu.filter(item => item.category === state.selectedCategory);

    if (state.foodFilter !== FILTER_OPTIONS.ALL) {
      filtered = filtered.filter(item => {
        if (state.foodFilter === FILTER_OPTIONS.VEG) return item.isVeg === true;
        if (state.foodFilter === FILTER_OPTIONS.NON_VEG) return item.isVeg === false;
        return true;
      });
    }

    setState(prev => ({ ...prev, filteredMenu: filtered }));
  }, [menu, state.selectedCategory, state.foodFilter]);

  const handleAddToCart = useCallback((item) => {
    setState(prev => {
      const newQuantity = (prev.cartItems[item.id] || 0) + 1;
      const newItems = { ...prev.cartItems, [item.id]: newQuantity };

      if (onAddToCart) {
        onAddToCart({
          itemId: item.id,
          quantity: newQuantity,
          price: item.price,
          name: item.name,
          totalPrice: item.price * newQuantity,
          image: item.image,
          customizable: item.customizable || true
        });
      }

      return { ...prev, cartItems: newItems };
    });
  }, [onAddToCart]);

  const handleRemoveFromCart = useCallback((item) => {
    setState(prev => {
      if (!prev.cartItems[item.id] || prev.cartItems[item.id] <= 1) {
        const newItems = { ...prev.cartItems };
        delete newItems[item.id];
        return { ...prev, cartItems: newItems };
      }

      const newQuantity = prev.cartItems[item.id] - 1;
      return { ...prev, cartItems: { ...prev.cartItems, [item.id]: newQuantity } };
    });
  }, []);

  const toggleWishlist = useCallback((itemId) => {
    setState(prev => {
      const newItems = { ...prev.wishlistItems };
      const isAdded = !newItems[itemId];

      if (newItems[itemId]) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = true;
      }

      if (onAddToWishlist) {
        onAddToWishlist(itemId, isAdded);
      }

      return { ...prev, wishlistItems: newItems };
    });
  }, [onAddToWishlist]);

  const handleCustomize = useCallback((item) => {
    safeNavigation({
      pathname: '/screens/MealCustomizeScreen',
      params: {
        mealItem: JSON.stringify(item),
        planTypes: JSON.stringify(plans || []), 
        timeSlots: JSON.stringify(item.timeSlots || []),
        preferences: JSON.stringify({}),
        returnScreen: router.pathname
      }
    });
  }, [router, plans]); 

  const handleCustomizeSubmit = useCallback(async (orderDetails) => {
    try {
      const completeOrderDetails = {
        ...orderDetails,
        price: orderDetails.price || 0,
        quantity: orderDetails.quantity || 1
      };
      await onCustomize(completeOrderDetails);
      setState(prev => ({
        ...prev,
        showCustomization: false,
        selectedMenuItem: null
      }));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add customized item to cart');
    }
  }, [onCustomize]);

  const handleShare = useCallback(async (item) => {
    try {
      await Share.share({
        message: `Check out ${item.name} for $${item.price} on our app!\n${item.description || ''}`,
        title: item.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, []);
  useEffect(() => {
    console.log('MenuSection modal state:', {
      showCustomization: state.showCustomization,
      selectedItem: state.selectedMenuItem
    });
  }, [state.showCustomization, state.selectedMenuItem]);

  const renderMenuItem = useCallback((item) => {
    if (!item?.id || !item?.name) return null;

    const isInWishlist = state.wishlistItems[item.id];
    const itemQuantity = state.cartItems[item.id] || 0;

    return (
      <View key={item.id} style={styles.menuItem}>
        <View style={styles.menuItemImageContainer}>
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={styles.menuItemImage}
            resizeMode="cover"
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

          {/* {itemQuantity > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleRemoveFromCart(item)}
              >
                <MaterialCommunityIcons name="minus" size={16} color="#FF4B3A" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{itemQuantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleAddToCart(item)}
              >
                <MaterialCommunityIcons name="plus" size={16} color="#FF4B3A" />
              </TouchableOpacity>
            </View>
          ) : ( */}
             <View style={styles.addButtonsContainer}>
            {/* {item.customizable && ( */}
              <TouchableOpacity
                style={[styles.addButton]}
                onPress={() => handleCustomize(item)} 
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
{/* 
            {item.rating && (
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.reviewCount || 0})
                </Text>
              </View>
            )} */}

            <Text style={styles.menuItemPrice}>
              ${item.price || item.basePrice || 0}
            </Text>

            {item.description && (
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
                {item.description.length > 60 && (
                  <Text style={{ color: '#FF4B3A' }}>...more</Text>
                )}
              </Text>
            )}
          </View>

          <View style={styles.menuItemActions}>
            <TouchableOpacity onPress={() => toggleWishlist(item.id)}>
              <MaterialCommunityIcons
                name={isInWishlist ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isInWishlist ? "#FF4B3A" : "#666"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleShare(item)}
            >
              <MaterialCommunityIcons name="share-variant" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [state.cartItems, state.wishlistItems, handleAddToCart, handleRemoveFromCart, handleShare, toggleWishlist, handleCustomize, theme]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={32} color="#FF4B3A" />
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          Try Again
        </Button>
      </View>
    );
  }

  if (loading && !state.filteredMenu.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B3A" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            styles.vegFilterButton,
            state.foodFilter === FILTER_OPTIONS.VEG && styles.vegFilterButtonSelected
          ]}
          onPress={() => setState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.VEG }))}
        >
          <MaterialCommunityIcons name="circle" size={16} color="#fff" />
          <Text style={[styles.filterButtonText, styles.vegFilterText]}>Veg</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            styles.nonVegFilterButton,
            state.foodFilter === FILTER_OPTIONS.NON_VEG && styles.nonVegFilterButtonSelected
          ]}
          onPress={() => setState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.NON_VEG }))}
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
                state.selectedCategory === category && styles.categoryButtonSelected
              ]}
              onPress={() => setState(prev => ({ ...prev, selectedCategory: category }))}
            >
              <Text style={[
                styles.categoryButtonText,
                state.selectedCategory === category && styles.categoryButtonTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      >
        {state.filteredMenu.length > 0 ? (
          state.filteredMenu.map(renderMenuItem)
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="food-off" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No items found in this category</Text>
          </View>
        )}
      </ScrollView>

{/* <MealCustomizationModal
  visible={state.showCustomization}
  onClose={() => setState(prev => ({
    ...prev,
    showCustomization: false,
    selectedMenuItem: null
  }))}
  onSubmit={handleCustomizeSubmit}
  mealItem={state.selectedMenuItem || {}}
  key={state.selectedMenuItem?.id || 'modal'}
/> */}
    </View>
  );
};

MenuSection.propTypes = {
  menu: PropTypes.array,
  onAddToCart: PropTypes.func,
  onCustomize: PropTypes.func,
  onAddToWishlist: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  theme: PropTypes.shape({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    textColor: PropTypes.string,
  }),
  plans: PropTypes.array 
};

// MenuSection.defaultProps = {
//   theme: {
//     primaryColor: '#FF4B3A',
//     secondaryColor: '#FF9500',
//     textColor: '#333',
//   },
// };

export default MenuSection;