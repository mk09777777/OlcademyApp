import { View, Text, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '@/styles/FirmDetailsTakeAwayStyles';
import axios from 'axios';
import { AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import ImageGallery from '@/components/ImageGallery';

const API_BASE_URL = 'http://192.168.0.102:3000';
const API_URL = 'http://192.168.0.102:3000';
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
  const [filterVisible, setFilterVisible] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [offers, setOffers] = useState([
    {
      _id: "1",
      name: "Caffè Coco",
      code: "Coco24",
      offerType: "percentage",
      discountValue: 11,
      minOrder: "₹300"
    },
    {
      _id: "2",
      name: "Italy",
      code: "Italy24",
      offerType: "flat",
      discountValue: 16,
      minOrder: "₹500"
    }
  ]);

  const filters = [
    { name: "Filter", icon: "filter" },
    { name: "Veg", icon: "leaf" },
    { name: "Non-veg", icon: "nutrition" },
    { name: "Spicy", icon: "flame" },
    { name: "Popular", icon: "trending-up" }
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/offers/takeaway/offer/${firmId}`
        );
        const data = await response.json();
        console.log(data, "offerdata");
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

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

  const toggleFilter = (category, filterId) => {
    setFilter((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].map((filter) =>
        filter.id === filterId ? { ...filter, selected: !filter.selected } : filter
      ),
    }));
  };

  const clearFilters = () => {
    setFilter((prevFilters) =>
      Object.keys(prevFilters).reduce((acc, category) => {
        acc[category] = prevFilters[category].map((filter) => ({
          ...filter,
          selected: false,
        }));
        return acc;
      }, {})
    );
  };

  const handleFilterPress = (filterName) => {
    if (filterName === 'Filter') {
      setFilterVisible(true);
    } else {
      setSelectedFilter((prevFilters) =>
        prevFilters.includes(filterName)
          ? prevFilters.filter((filter) => filter !== filterName)
          : [...prevFilters, filterName]
      );
    }
  };

  const selectedCount = Object.values(filter).flat().filter((f) => f.selected).length;

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

        if (isNaN(priceValue) || priceValue <= 0) {
          throw new Error('Invalid price value');
        }

        const cartItem = {
          itemToAdd: {
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
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={item?.image_urls?.[0]
              ? { uri: item.image_urls[0] }
              : require('@/assets/images/food_placeholder.jpg')}
            style={styles.image}
          />
          <View style={styles.cartControls}>
            {quantity > 0 ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity onPress={handleDecrement}>
                  <Text style={styles.controlButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={handleAdd} activeOpacity={1.0}>
                  <Text style={styles.controlButton}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAdd}
                activeOpacity={1.0}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{item?.productName || item?.name || 'Unnamed Item'}</Text>
          <Text style={styles.description}>{item?.description || ''}</Text>
          <Text style={styles.price}>{item?.price || 'Price not available'}</Text>
          {item.variations?.length > 0 && (
            <View style={styles.variationsContainer}>
              {item.variations.map((variation, index) => (
                <Text key={index} style={styles.variationText}>
                  {variation.name}: {variation.price}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 180 }}>
        <ImageGallery
          images={
            firmDetails?.image_urls?.length > 0
              ? firmDetails.image_urls
              : [require('@/assets/images/food1.jpg')]
          }
          currentIndex={currentImageIndex}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        />
      </View>

      <View style={styles.upperPannel}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>

        <View style={styles.rightPannel}>
          <TouchableOpacity>
            <AntDesign name='sharealt' size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setToggleBookmark(!toggleBookmark)}
            style={{ marginLeft: 10 }}
          >
            {toggleBookmark ?
              <Ionicons name='bookmark' size={30} /> :
              <Ionicons name='bookmark-outline' size={30} />
            }
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bttomPannel}>
        <View>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/screens/RestaurantDetailsScreen',
              params: { restaurant: JSON.stringify(firmDetails) }
            })}
          >
            <Text style={styles.restaurantName}>
              {firmDetails?.restaurantInfo?.name || "Restaurant"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.restaurantAddress}>
            {firmDetails?.restaurantInfo?.address}
          </Text>
          <View style={styles.cuisineContainer}>
            <Text style={styles.cuisineText}>
              {firmDetails?.restaurantInfo?.cuisines?.join(", ")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/screens/Reviewsall",
            params: {
              firmId: firmId,
              restaurantName: firmDetails?.restaurantInfo?.name,
              averageRating: firmDetails?.restaurantInfo?.ratings?.overall,
              reviewCount: firmDetails?.restaurantInfo?.ratings?.totalReviews
            }
          })}
          style={styles.reviewBox}
        >
          <View style={styles.reviewBoxTopContainer}>
            <View style={styles.reviewBoxUpperContainer}>
              <Text style={styles.reviewText}>
                {firmDetails?.restaurantInfo?.ratings?.overall || "4.5"}
              </Text>
              <FontAwesome name="star" size={24} color="white" />
            </View>
          </View>
          <View style={styles.reviewBoxBottomContainer}>
            <Text style={styles.reviewCount}>
              {firmDetails?.restaurantInfo?.ratings?.totalReviews || "725"}
            </Text>
            <Text style={styles.reviewCount}>Reviews</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.separatorRow}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>MENU</Text>
        <View style={styles.line} />
      </View>

      <View style={[styles.offersContainer, { padding: 10 ,marginBottom: 20}]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersTrack}
        >
          {offers?.map((offer) => {
            const discountText =
              offer.offerType === "percentage"
                ? `${offer.discountValue}% OFF`
                : `₹${offer.discountValue} OFF`;

            const isPercentageOffer = offer.offerType === "percentage";

            return (
              <TouchableOpacity
                key={offer._id}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.offerCard,
                  isPercentageOffer ? styles.percentageOffer : styles.flatOffer
                ]}>
                  <View style={[
                    styles.offerBadge,
                    isPercentageOffer ?
                      { backgroundColor: '#FF525220' } :
                      { backgroundColor: '#4285F420' }
                  ]}>
                    <Text style={[
                      styles.offerBadgeText,
                      isPercentageOffer ?
                        { color: '#FF5252' } :
                        { color: '#4285F4' }
                    ]}>
                      {isPercentageOffer ? 'HOT' : 'FLAT'}
                    </Text>
                  </View>

                  <Text style={styles.offerTitle} numberOfLines={2}>
                    {offer.name}
                  </Text>

                  <Text style={[
                    styles.offerDiscount,
                    isPercentageOffer ?
                      { color: '#FF5252' } :
                      { color: '#4285F4' }
                  ]}>
                    {discountText}
                  </Text>

                  <View style={styles.offerCodeContainer}>
                    <Text style={styles.offerCodeText}>
                      Use code:
                    </Text>
                    <Text style={styles.offerCode}>
                      {offer.code}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.filterContainer}>
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
      </View>

      <FlatList
        data={categories}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(category)}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.toggleIcon}>{collapsed[category] ? "▼" : "▲"}</Text>
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

      {getTotalItems() > 0 && (
        <TouchableOpacity
          style={styles.proceedToCartButton}
          onPress={() => router.push({
            pathname: 'screens/TakeAwayCart',
            params: {
              offers: JSON.stringify(offers),
              restaurantId: firmId,
              restaurantName: firmDetails?.restaurantInfo?.name
            }
          })}
        >
          <Text style={styles.proceedToCartText}>
            {getTotalItems()} items | ${getSubtotal()} | Go to Cart
          </Text>
        </TouchableOpacity>
      )}

      <Modal visible={offersVisible} transparent animationType="slide">
        <View style={styles.offerModalOverlay}>
          <View style={styles.offerModalContainer}>
            <Text style={styles.offerHeader}>Offers at {firmDetails?.restaurantInfo?.name || "Restaurant"}</Text>
            <Text style={styles.offerSubHeader}>Restaurant Coupons</Text>
            <FlatList
              data={offers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.offerCard}>
                  <TouchableOpacity
                    style={styles.offerHeader}
                    onPress={() =>
                      setExpandedOffer(expandedOffer === item.id ? null : item.id)
                    }
                  >
                    <Ionicons name={item.icon} size={22} color="#007BFF" />
                    <Text style={styles.offerTitle}>{item.title}</Text>
                    <Ionicons
                      name={expandedOffer === item.id ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {expandedOffer === item.id && (
                    <View style={styles.offerExpandedContent}>
                      {item.code && (
                        <Text style={styles.offerCodeText}>Use code {item?.code} | above {item?.minOrder}</Text>
                      )}
                      {item.details.map((detail, index) => (
                        <View key={index} style={styles.offerDetailItem}>
                          <Ionicons name="checkmark-circle-outline" size={18} color="green" />
                          <Text style={styles.offerDetailText}>{detail}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setOffersVisible(false)} style={styles.offerCloseButton}>
              <Text style={styles.offerCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={filterVisible} transparent animationType="slide">
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
      </Modal>
    </View>
  );
}