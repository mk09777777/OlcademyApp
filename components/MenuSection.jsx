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
      <View key={item.id} className="flex-row bg-white rounded-lg shadow-sm mb-4 p-4">
        <View className="relative">
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />

          {item.bestseller && (
            <View className="absolute top-1 left-1 bg-yellow-500 rounded px-1 py-0.5 flex-row items-center">
              <MaterialCommunityIcons name="crown" size={12} color="#FFD700" />
              <Text className="text-xs text-white font-outfit-bold ml-1">Bestseller</Text>
            </View>
          )}

          {item.isVeg !== undefined && (
            <View className="absolute top-1 right-1 bg-white rounded-full p-1">
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
             <View className="absolute bottom-1 right-1">
              <TouchableOpacity
                className="bg-primary px-3 py-1 rounded-lg"
                onPress={() => handleCustomize(item)} 
              >
                <Text className="text-white text-xs font-outfit-bold">ADD</Text>
              </TouchableOpacity>
          </View>
        
        </View>

        <View className="flex-1 ml-3 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <Text className="text-base font-outfit-bold color-gray-900 flex-1" numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <Text className="text-lg font-outfit-bold color-primary mt-1">
              ${item.price || item.basePrice || 0}
            </Text>

            {item.description && (
              <Text className="text-sm color-gray-600 font-outfit mt-1" numberOfLines={2}>
                {item.description}
                {item.description.length > 60 && (
                  <Text className="color-primary">...more</Text>
                )}
              </Text>
            )}
          </View>

          <View className="flex-row items-center justify-end mt-2">
            <TouchableOpacity onPress={() => toggleWishlist(item.id)} className="mr-3">
              <MaterialCommunityIcons
                name={isInWishlist ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isInWishlist ? "#FF4B3A" : "#666"}
              />
            </TouchableOpacity>
            <TouchableOpacity
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
      <View className="flex-1 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle" size={32} color="#FF4B3A" />
        <Text className="text-base color-gray-700 font-outfit mt-2 text-center">{error}</Text>
        <Button
          mode="contained"
          className="mt-4"
          onPress={() => window.location.reload()}
        >
          Try Again
        </Button>
      </View>
    );
  }

  if (loading && !state.filteredMenu.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF4B3A" />
        <Text className="text-base color-gray-600 font-outfit mt-2">Loading menu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-center gap-4 p-4">
        <TouchableOpacity
          className={`flex-row items-center px-4 py-2 rounded-full ${
            state.foodFilter === FILTER_OPTIONS.VEG ? 'bg-green-600' : 'bg-green-500'
          }`}
          onPress={() => setState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.VEG }))}
        >
          <MaterialCommunityIcons name="circle" size={16} color="#fff" />
          <Text className="text-white text-sm font-outfit-bold ml-1">Veg</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center px-4 py-2 rounded-full ${
            state.foodFilter === FILTER_OPTIONS.NON_VEG ? 'bg-red-600' : 'bg-red-500'
          }`}
          onPress={() => setState(prev => ({ ...prev, foodFilter: FILTER_OPTIONS.NON_VEG }))}
        >
          <MaterialCommunityIcons name="triangle" size={16} color="#fff" />
          <Text className="text-white text-sm font-outfit-bold ml-1">Non-Veg</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-3"
        >
          {MENU_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 rounded-full border ${
                state.selectedCategory === category 
                  ? 'bg-primary border-primary' 
                  : 'bg-white border-gray-200'
              }`}
              onPress={() => setState(prev => ({ ...prev, selectedCategory: category }))}
            >
              <Text className={`text-sm font-outfit ${
                state.selectedCategory === category 
                  ? 'text-white font-outfit-bold' 
                  : 'color-gray-700'
              }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-4"
      >
        {state.filteredMenu.length > 0 ? (
          state.filteredMenu.map(renderMenuItem)
        ) : (
          <View className="flex-1 justify-center items-center py-12">
            <MaterialCommunityIcons name="food-off" size={48} color="#666" />
            <Text className="text-base color-gray-600 font-outfit mt-2">No items found in this category</Text>
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
/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  vegFilterButton: {
    backgroundColor: '#4CAF50',
  },
  vegFilterButtonSelected: {
    backgroundColor: '#2E7D32',
  },
  nonVegFilterButton: {
    backgroundColor: '#FF4B3A',
  },
  nonVegFilterButtonSelected: {
    backgroundColor: '#D32F2F',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuCategories: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonSelected: {
    backgroundColor: '#FF4B3A',
    borderColor: '#FF4B3A',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
  },
  menuItemImageContainer: {
    position: 'relative',
  },
  menuItemImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestsellerText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  vegBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  addButtonsContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  addButton: {
    backgroundColor: '#FF4B3A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4B3A',
    marginTop: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconButton: {
    marginLeft: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
*/