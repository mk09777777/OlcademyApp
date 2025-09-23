import { View, Text, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import ImageGallery from '@/components/ImageGallery';
import OffersCard from '@/components/OffersCard';


import { API_CONFIG } from '../../config/apiConfig';
const API_BASE_URL = API_CONFIG.BACKEND_URL;
const API_URL = API_CONFIG.BACKEND_URL;

const filtersData = {
  "Dietary": [
    { id: 1, label: "Vegetarian", icon: "leaf", selected: false },
    { id: 2, label: "Vegan", icon: "leaf-outline", selected: false },
    { id: 3, label: "Gluten Free", icon: "nutrition-outline", selected: false },
  ],
  "Cuisine": [
    { id: 4, label: "Italian", icon: "pizza-outline", selected: false },
    { id: 5, label: "Indian", icon: "restaurant-outline", selected: false },
    { id: 6, label: "Chinese", icon: "fast-food-outline", selected: false },
  ],
};
// Commented out filtersData as it's not being used
// const filtersData = {
//   "Dietary": [
//     { id: 1, label: "Vegetarian", icon: "leaf", selected: false },
//     { id: 2, label: "Vegan", icon: "leaf-outline", selected: false },
//     { id: 3, label: "Gluten Free", icon: "nutrition-outline", selected: false },
//   ],
//   "Cuisine": [
//     { id: 4, label: "Italian", icon: "pizza-outline", selected: false },
//     { id: 5, label: "Indian", icon: "restaurant-outline", selected: false },
//     { id: 6, label: "Chinese", icon: "fast-food-outline", selected: false },
//   ],
// };

export default function FirmDetailsTakeAway() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const {
    cart,
    handleQuantityChange,
    addToCart,
    getCartItems,
    getTotalItems,
    getSubtotal,
    clearCart,
  } = useCart();

  const firmId = params.firmId || params.firm;
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firmDetails, setFirmDetails] = useState(null);
  const [toggleBookmark, setToggleBookmark] = useState(false);
  const [offersVisible, setOffersVisible] = useState(false);
  // Commented out filterVisible state as it's not being used
  //const [filterVisible, setFilterVisible] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const offers = [
    { id: 1, title: "Flat 10% Off on Orders Above 399", validity: "Valid till 15th February" },
    { id: 2, title: "Flat 20% Off on Orders Upto 200", validity: "Valid till 28th February" },
    { id: 3, title: "Items @99", validity: "Valid Today" }
  ];

  // Commented out filters array as it's not being used
  //const filters = [
  //{ name: "Filter", icon: "filter" },
  //{ name: "Veg", icon: "leaf" },
  //{ name: "Non-veg", icon: "nutrition" },
  //{ name: "Spicy", icon: "flame" },
  //{ name: "Popular", icon: "trending-up" }
  //];



  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/firm/getOne/${firmId}`, {
        timeout: 5000,
      });
      setFirmDetails(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      let errorMessage = 'Network error. Check server connection.';
      if (error.code === 'ECONNABORTED') errorMessage = 'Request timed out.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/firm/restaurants/menu-sections-items/${firmId}`,
        { timeout: 5000 }
      );

      const transformedData = {
        menuTabs: response.data.menuSections.map(tab => ({
          name: tab.tabName,
          sections: tab.sections.map(section => ({
            name: section.sectionName,
            items: section.items.map(item => ({
              _id: item.id,
              name: item.name,
              description: item.description,
              price: item.price === "N/A" ? "0" : item.price,
              image_urls: Array.isArray(item.images) ? item.images : item.images ? [item.images] : [],
              variations: item.variations || [],
              foodType: item.type || "veg",
              category: tab.tabName,
              subcategory: section.sectionName
            }))
          }))
        }))
      };
      setMenuData(transformedData);
    } catch (error) {
      console.error('API error:', error);
      setMenuData({
        menuTabs: [{
          name: "Main Menu",
          sections: [{
            name: "Popular Items",
            items: [{
              _id: "1",
              name: "Sample Dish",
              description: "This is sample data",
              price: "199",
              image_urls: [],
              foodType: "veg"
            }]
          }]
        }]
      });
      setError('Using sample data - could not connect to server');
    } finally {
      setLoading(false);
    }
  };


  const UploadRecentlyViewd = async () => {
    try {
      // getSimilar()
      const restId = firmId
      if (!restId) return
      await axios.post(`${API_URL}/firm/recently-viewed/${restId}`, null, {
        withCredentials: true
      });
      console.log("recently viewed uploaded successfully")
    } catch (err) {
      console.error("Failed to upload recently viewed:", err)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchRestaurantDetails(), fetchMenuData()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    UploadRecentlyViewd();
  }, [firmId]);

  const transformMenuData = (menuData) => {
    if (!menuData?.menuTabs) {
      console.error('Invalid menu data structure - missing menuTabs');
      return [];
    }

    return menuData.menuTabs.flatMap(tab => {
      const sections = Array.isArray(tab.sections) ? tab.sections : [];
      return sections.flatMap(section => {
        const items = Array.isArray(section.items) ? section.items : [];
        return items.map(item => ({
          ...item,
          _id: item._id || Math.random().toString(36).substr(2, 9),
          category: section.name || tab.name || 'Uncategorized',
          productName: item.name || 'Unnamed Item',
          description: item.description || '',
          price: item.price ?
            (item.price.startsWith('$') ? item.price : `$${parseFloat(item.price).toFixed(2)}`)
            : '$0.00',
          image_urls: item.image_urls || [],
          variations: item.variations || [],
          foodType: item.foodType || "veg"
        }));
      });
    });
  };

  const products = menuData ? transformMenuData(menuData) : [];

  const groupedProducts = products.reduce((acc, item) => {
    const category = item.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts);
  const [collapsed, setCollapsed] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );

  const toggleCategory = (category) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const [filter, setFilter] = useState(filtersData);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [addError, setAddError] = useState(null);

  //const toggleFilter = (category, filterId) => {
  //setFilter((prevFilters) => ({
  //...prevFilters,
  //[category]: prevFilters[category].map((filter) =>
  //filter.id === filterId ? { ...filter, selected: !filter.selected } : filter
  //),
  //}));
  //};

  //const clearFilters = () => {
  //setFilter((prevFilters) =>
  //Object.keys(prevFilters).reduce((acc, category) => {
  //acc[category] = prevFilters[category].map((filter) => ({
  //...filter,
  //selected: false,
  //}));
  //return acc;
  //}, {})
  //);
  //};

  // Commented out handleFilterPress function
  //const handleFilterPress = (filterName) => {
  //if (filterName === 'Filter') {
  //setFilterVisible(true);
  //} else {
  //setSelectedFilter((prevFilters) =>
  //prevFilters.includes(filterName)
  //? prevFilters.filter((filter) => filter !== filterName)
  //: [...prevFilters, filterName]
  //);
  //}
  //};

  // Commented out selectedCount as it's not being used
  //const selectedCount = Object.values(filter).flat().filter((f) => f.selected).length;

  const renderItem = ({ item }) => {
    const cartItems = getCartItems();
    const cartItem = cartItems.find(cartItem =>
      cartItem.productId === (item._id || item.id)
    );
    const quantity = cartItem?.quantity || 0;

    const handleAdd = async () => {
      try {
        setAddError(null);
        const priceValue = item?.price
          ? (typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : item.price)
          : 8;

        const cartItem = {
          itemToAdd: {
            subcategoryId: null,
            categoryId: "507f1f77bcf86cd799439011",
            productId: item?._id || item?.id,
            name: item?.productName || item?.name || 'Unknown Item',
            description: item?.description || '',
            price: 8,
            quantity: 1,
            img: item?.image_urls?.[0] || require('@/assets/images/food_placeholder.jpg'),
            foodType: item?.foodType || "veg",
            sourceEntityId: firmId,
            itemType: "firm",
            sourceEntityName: "Firm",
            productModelType: "Firm",
          }
        };

        await addToCart(cartItem);
      } catch (error) {
        setAddError('Failed to add item. Please try again.');
        console.error('Add to cart error:', error);
      }
    };

    const handleIncrement = () => {
      const itemId = item._id || item.id;
      if (itemId) {
        handleQuantityChange(itemId, 1);
      }
    };

    const handleDecrement = () => {
      const itemId = item._id || item.id;
      if (itemId) {
        handleQuantityChange(itemId, -1);
      }
    };

    return (
      <View className="flex-row p-4 bg-white mb-1 ml-3 mr-3 rounded-lg shadow-sm">
        {/* Left side: Image */}
        <View className="w-32 h-40 mr-4">
          <Image
            source={item?.image_urls?.[0]
              ? { uri: item.image_urls[0] }
              : require('@/assets/images/food_placeholder.jpg')}
            className="w-full h-full rounded-lg"
          />
        </View>

        {/* Right side: Details */}
        <View className="flex-1">
          <Text className="text-textprimary font-outfit-bold text-base mb-1">{item?.productName || item?.name || 'Unnamed Item'}</Text>
          <Text className="text-textprimary font-outfit-bold text-md mb-1">{item?.price || 'Price not available'}</Text>
          <Text className="text-textsecondary font-outfit text-sm mb-2">{item?.description || ''}</Text>

          {item.variations?.length > 0 && (
            <View className="mb-2">
              {item.variations.map((variation, index) => (
                <Text key={index} className="text-textsecondary font-outfit text-xs">
                  {variation.name}: {variation.price}
                </Text>
              ))}
            </View>
          )}

          {/* ADD / Quantity Controls at bottom */}
          {quantity > 0 ? (
            <View className="bg-light border-primary flex-row border-2 rounded-lg justify-center items-center">
              <TouchableOpacity onPress={handleDecrement}>
                <Text className="text-primary font-outfit-bold text-lg px-3 py-1">-</Text>
              </TouchableOpacity>
              <Text className="text-primary font-outfit-bold text-base px-3">{quantity}</Text>
              <TouchableOpacity onPress={handleIncrement}>
                <Text className="text-primary font-outfit-bold text-lg px-3 py-1">+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity className="bg-light border-primary border-2 px-4 py-2 rounded-lg items-center" onPress={handleAdd} activeOpacity={1.0}>
              <Text className="text-primary font-outfit-bold text-sm">ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };


  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f0fafaff]">
            <ActivityIndicator size="large" color="#02757A" />
            <Text className="text-textsecondary font-outfit mt-4">Loading service details...</Text>
          </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-primary text-center font-outfit mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-outfit-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-64">
        <ImageGallery
          style={{ backgroundColor: "rgba(0, 0, 0, 0.63)" }}
          images={
            firmDetails?.image_urls?.length > 0
              ? firmDetails.image_urls
              : [require('@/assets/images/food1.jpg')]
          }
          currentIndex={currentImageIndex}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          className="absolute inset-0"
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center z-10">
          <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-black/40 p-2 items-center justify-center">
            <Ionicons name='chevron-back' size={28} color='white' />
          </TouchableOpacity>
          {/* <View className="flex-row items-center">
            <TouchableOpacity>
              <AntDesign name='sharealt' size={28} color='white' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToggleBookmark(!toggleBookmark)}
              className="ml-3"
            >
              {toggleBookmark ?
                <Ionicons name='bookmark' size={28} color='white' /> :
                <Ionicons name='bookmark-outline' size={28} color='white' />
              }
            </TouchableOpacity>
          </View> */}
        </View>
        <View className="absolute bottom-3 left-0 right-0 h-[60%] flex-row justify-between items-center">
          <LinearGradient
            colors={["#18181800", "#18181866", "#181818CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}
          >
            <View className="w-[80%] p-1 mt-15">
              <View>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: '/screens/RestaurantDetailsScreen',
                    params: { restaurant: JSON.stringify(firmDetails) }
                  })}
                >
                  <Text className="text-white font-outfit-bold text-xl mb-1">
                    {firmDetails?.restaurantInfo?.name || "Restaurant"}
                  </Text>
                </TouchableOpacity>
                <Text className="text-white/80 font-outfit text-sm mb-1">
                  {firmDetails?.restaurantInfo?.address}
                </Text>
                <Text className="text-white/80 font-outfit text-sm mb-1">
                  {Array.isArray(firmDetails?.restaurantInfo?.cuisines)
                    ? firmDetails.restaurantInfo.cuisines.join(' • ')
                    : firmDetails?.restaurantInfo?.cuisines || 'Italian • Dessert'}
                </Text>
                <Text className="text-white/80 font-outfit text-sm">
                  {firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="rounded-2xl mt-28 mr-2.5 mb-3"
              onPress={() => router.push({
                pathname: "/screens/Reviewsall",
                params: {
                  firmId: firmId,
                  restaurantName: firmDetails?.restaurantInfo?.name,
                  averageRating: firmDetails?.restaurantInfo?.ratings?.overall,
                  reviewCount: firmDetails?.restaurantInfo?.ratings?.totalReviews,
                  reviewType: "dining"
                }
              })}
            >
              <View className="bg-green-600 p-2 rounded-t-2xl">
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-base mr-2 font-outfit">
                    {firmDetails?.restaurantInfo?.ratings?.overall?.toFixed(1) || '4.5'}
                  </Text>
                  <FontAwesome name='star' size={18} color='white' />
                </View>
              </View>
              <View className="bg-white rounded-b-2xl">
                <Text className="text-xs text-gray-800 text-center mt-1 font-outfit">
                  {firmDetails?.restaurantInfo?.ratings?.totalReviews || '2179'}
                </Text>
                <Text className="text-xs text-gray-800 text-center" style={{ fontFamily: 'outfit' }}>Reviews</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

     <ScrollView className="flex-1">
       <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-textsecondary font-outfit-bold mx-4 text-sm">Offers</Text>
        <View className="flex-1 h-px bg-border" />
      </View>
      <View className="mb-5">
        <FlatList
          data={offers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <OffersCard offerTitle={item.title} offerValidity={item.validity} />}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>

      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-textsecondary font-outfit-bold mx-4 text-sm">MENU</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* Commented out filter container section */}
      {/* <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const isSelected = selectedFilter.includes(item.name);
            const renderIcon = () => {
              switch (item.name) {
                case "Filter":
                  return (
                    <FontAwesome
                      name={item.icon}
                      size={16}
                      color={!isSelected ? "#e23845" : "white"}
                      style={{ marginRight: 4 }}
                    />
                  )
                case "Non-veg":
                case "Spicy":
                  return (
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={!isSelected ? "#e23845" : "white"}
                      style={{ marginRight: 4 }}
                    />
                  )
                default:
                  return (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={16}
                      color={!isSelected ? "#e23845" : "white"}
                      style={{ marginRight: 4 }}
                    />
                  )
              }
            }
            return (
              <TouchableOpacity
                style={[styles.filterButton, isSelected && styles.selectedFilterButton]}
                onPress={() => handleFilterPress(item.name)}
              >
                {renderIcon()}
                <Text style={!isSelected ? styles.filterText : styles.selectedFilterText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View> */}

      <FlatList
        data={categories}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View className="mb-4">
            <TouchableOpacity className="flex-row justify-between items-center p-4 bg-white border-b border-border" onPress={() => toggleCategory(category)}>
              <Text className="text-textprimary font-outfit-bold text-lg">{category}</Text>
              <Feather name={collapsed[category] ? "chevron-down" : "chevron-up"} size={20} color="#333333" />
            </TouchableOpacity>
            {!collapsed[category] && (
              <FlatList
                data={groupedProducts[category]}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
              />
            )}
          </View>
        )}
      />

      <Modal visible={offersVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            <Text className="text-textprimary font-outfit-bold text-xl mb-2">Offers at {firmDetails?.restaurantInfo?.name || "Restaurant"}</Text>
            <Text className="text-textsecondary font-outfit text-base mb-4">Restaurant Coupons</Text>
            <FlatList
              data={offers}
              keyExtractor={(item) => item._id || item.id}
              renderItem={({ item }) => (
                <View className="bg-background border border-border rounded-lg p-4 mb-3">
                  <TouchableOpacity
                    className="flex-row items-center justify-between"
                    onPress={() =>
                      setExpandedOffer(expandedOffer === item._id ? null : item._id)
                    }
                  >
                    <Ionicons name={item.icon} size={22} color="#007BFF" />
                    <Text className="text-textprimary font-outfit-bold text-base flex-1 mx-3">{item.title}</Text>
                    <Ionicons
                      name={expandedOffer === item.id ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {expandedOffer === item._id && (
                    <View className="mt-3 pt-3 border-t border-border">
                      {item.code && (
                        <Text className="text-primary font-outfit-bold text-sm mb-2">Use code {item?.code} | above {item?.minOrder}</Text>
                      )}
                      {item.details?.map((detail, index) => (
                        <View key={index} className="flex-row items-center mb-1">
                          <Ionicons name="checkmark-circle-outline" size={18} color="green" />
                          <Text className="text-textsecondary font-outfit text-sm ml-2">{detail}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setOffersVisible(false)} className="bg-primary p-4 rounded-lg mt-4">
              <Text className="text-white font-outfit-bold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Commented out filter modal section */}
      {/* <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.filterOverlay}>
          <View style={styles.filterModalContainer}>
            <Text style={styles.filterHeader}>Filters and Sorting</Text>
            <FlatList
              data={Object.entries(filter)}
              keyExtractor={(item) => item[0]}
              renderItem={({ item }) => {
                const category = item[0];
                const filterItems = item[1];

                if (!Array.isArray(filterItems)) return null;

                return (
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>{category}</Text>
                    <View style={styles.filterChipContainer}>
                      {filterItems.map((filter) => (
                        <TouchableOpacity
                          key={filter.id}
                          style={[styles.filterChip, filter.selected && styles.filterChipSelected]}
                          onPress={() => toggleFilter(category, filter.id)}
                        >
                          {filter.icon && (
                            <Ionicons
                              name={filter.icon}
                              size={16}
                              color={filter.selected ? "#fff" : "#333"}
                              style={{ marginRight: 5 }}
                            />
                          )}
                          <Text style={[styles.filterChipText, filter.selected && styles.filterChipTextSelected]}>
                            {filter.label}
                          </Text>
                          {filter.selected && (
                            <Ionicons name="close" size={14} color="#fff" style={{ marginLeft: 5 }} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.filterFooter}>
              <TouchableOpacity onPress={clearFilters} style={styles.filterClearButton}>
                <Text style={styles.filterClearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.filterApplyButton}>
                <Text style={styles.filterApplyButtonText}>Apply ({selectedCount})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
     </ScrollView>
     
     {getTotalItems() > 0 && (
        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 bg-primary p-4 m-4 rounded-lg"
          onPress={() => router.push({
            pathname: 'screens/TakeAwayCart',
            params: {
              offers: JSON.stringify(offers),
              restaurantId: firmId,
              restaurantName: firmDetails?.restaurantInfo?.name
            }
          })}
        >
          <Text className="text-white text-center font-outfit-bold">
            {getTotalItems()} items | ${getSubtotal()} | Go to Cart
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}