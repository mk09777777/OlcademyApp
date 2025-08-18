import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView
} from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import SearchBar from '@/components/SearchBar';
import RadioButtonRN from 'radio-buttons-react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeNavigation } from '@/hooks/navigationPage';
import DiningCard from '@/components/DaningCard';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Api_url = 'http://192.168.0.103:3000';

const quickFilters = [
  { name: 'Pure Veg', icon: 'leaf' },
  { name: 'Offers', icon: 'local-offer' },
  { name: 'Rating 4.0+', icon: 'star' },
  { name: 'Open Now', icon: 'access-time' },
];

export default function Collections() {
  const params = useLocalSearchParams();
  const collectionName = params.collectionName;
  const router = useRouter();
  const [firms, setFirms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
    const [profileData, setProfileData] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionData, setCollectionData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Sort');
  const [offerFilter, setOfferFilter] = useState(false);
  const navigation = useNavigation();
  const { safeNavigation } = useSafeNavigation();

  const [filter, setFilter] = useState({
    sort: "",
    priceRange: "",
    cuisines: "",
    dietary: "",
  });

  const categories = [
    "Sort",
    "Price Range",
    "Cuisines",
    "Dietary",
    "Cost For Two",
    "More Filters",
  ];

  const options = {
    "Sort": [
      "Popularity",
      "Recommended",
      "Earliest Arrival",
      "Rating",
      "Cost: Low to High",
      "Cost: High to Low",
      "Distance",
    ],
    "Cuisines": ["Italian", "Indian", "Chinese", "Mexican"],
    "Dietary": ["Pure Veg", "Non-Veg", "Vegan"],
    "Cost For Two": [
      "Less Than Rs.X",
      "Rs.300 to 600",
      "More Than Rs.X",
    ],
    "More Filters": ['Rating 4.0+', 'Outdoor Seating', 'Serves Alcohol', 'Pet Friendly', 'Open Now', 'Offers']
  };
  const handleFav = async (firmId) => {
    const saved = await AsyncStorage.getItem("userProfileData");
    if (saved) {
      setProfileData(JSON.parse(saved));
    }
    console.log(saved);
    const url = `${Api_url}/firm/fav/${firmId}`;
    console.log("Fetching URL:", url);

    const response = await axios.post(url, { withCredentials: true });
    alert("updated successfull");
    console.log("Response:", response.data);
  };

  const checkIfFavorite = async (firmId) => {
    try {
      const url = `${Api_url}/firm/favCheck/${firmId}`;
      const response = await axios.get(url, { withCredentials: true });
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking favorite status:", error.response?.data || error.message);
    }
  };

  const removeFavorite = async (firmId) => {
    try {
      const url = `${Api_url}/firm/favRemove/${firmId}`;
      const response = await axios.post(url, { withCredentials: true });
      console.log("Response:", response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing favorite:", error.response?.data || error.message);
    }
  };

  const handleFavoriteClick = async (firmId) => {
    try {
      const { isFavorite } = await checkIfFavorite(firmId);
      console.log(isFavorite);

      if (isFavorite) {
        Alert.alert(
          "Remove Favorite",
          "This item is already in your favorites. Do you want to remove it?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Remove",
              onPress: async () => {
                await removeFavorite(firmId);
              }
            }
          ]
        );
      } else {
        await handleFav(firmId);
      }
    } catch (error) {
      console.error("Error handling favorite click:", error);
      Alert.alert("Error", "Failed to update favorites");
    }
  };
    const addtoFavorite = async (firmId) => {
    try {
      await axios.post(
        `${Api_url}/firm/users/${firmId}/liked`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch collection data
  const fetchCollectionData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${Api_url}/collections/by-slug/${encodeURIComponent(collectionName)}`);
      if (response.data) {
        setCollectionData(response.data);
        const collectionFirms = response.data.restaurants.map(restaurant => ({
          _id: restaurant._id,
          restaurantInfo: {
            name: restaurant.restaurantInfo.name,
            address: restaurant.restaurantInfo.address,
            ratings: restaurant.restaurantInfo.ratings,
            cuisines: restaurant.restaurantInfo.cuisines || '',
            priceRange: restaurant.restaurantInfo.priceRange || '',
            image_urls: restaurant.image_urls?.[0] || '',
            category: restaurant.restaurantInfo.category || [],
            offer: restaurant.restaurantInfo.offer || false
          }
        }));
        setFirms(collectionFirms);
      }
    } catch (error) {
      console.error('Error fetching collection data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: collectionName || 'On Mind',
    });
  }, [collectionName, navigation]);

  // Initial load
  useEffect(() => {
    fetchCollectionData();
  }, [collectionName]);

  useEffect(() => {
    const searchRestaurants = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);

      try {
        const response = await axios.get(`${Api_url}/search`, { params: { query } });
        const results = response.data?.restaurants || [];

        const formattedResults = results.map((restaurant) => ({
          _id: restaurant.id,
          restaurantInfo: {
            name: restaurant.restaurant_name,
            address: restaurant.address,
            ratings: { overall: restaurant.rating },
            cuisines: restaurant.cuisines || '',
            priceRange: restaurant.price_range || '',
            image_urls: restaurant.image_url,
          },
        }));

        setSearchResults(formattedResults);
      } catch (error) {
        console.error('Error searching restaurants:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchRestaurants, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const applyQuickFilters = (filters) => {
    return firms.filter((firm) => {
      return filters.every((filter) => {
        switch (filter) {
          case 'Pure Veg':
            return firm.restaurantInfo.category?.includes('veg') && !firm.restaurantInfo.category?.includes('non-veg');
          case 'Offers':
            return firm.restaurantInfo.offer;
          case 'Rating 4.0+':
            return firm.restaurantInfo.ratings?.overall >= 4;
          case 'Open Now':
            // Implement open now logic based on your business hours data
            return true;
          default:
            return true;
        }
      });
    });
  };

  const applySortFilter = (firmsToSort) => {
    if (!filter.sort) return firmsToSort;
    
    return [...firmsToSort].sort((a, b) => {
      switch (filter.sort) {
        case 'Rating':
          return (b.restaurantInfo.ratings?.overall || 0) - (a.restaurantInfo.ratings?.overall || 0);
        case 'Cost: Low to High':
          return (a.restaurantInfo.priceRange || '').localeCompare(b.restaurantInfo.priceRange || '');
        case 'Cost: High to Low':
          return (b.restaurantInfo.priceRange || '').localeCompare(a.restaurantInfo.priceRange || '');
        default:
          return 0;
      }
    });
  };

  const filteredFirms = useMemo(() => {
    let result = query.trim() !== '' ? searchResults : firms;
    
    if (activeQuickFilters.length > 0) {
      result = applyQuickFilters(activeQuickFilters);
    }
    
    result = applySortFilter(result);
    
    return result;
  }, [query, searchResults, firms, activeQuickFilters, filter.sort]);

  const handleQuickFilterPress = (filterName) => {
    setActiveQuickFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName) 
        : [...prev, filterName]
    );
  };

  const handleOptionSelect = (category, option) => {
    setFilter({ ...filter, [category.toLowerCase().replace(' ', '')]: option });
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setFilter({
      sort: "",
      priceRange: "",
      cuisines: "",
      dietary: "",
    });
    setActiveQuickFilters([]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCollectionData().finally(() => setRefreshing(false));
  }, [collectionName]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e23845" />
      </View>
    );
  }

  if (!collectionData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Collection not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Collection Header */}
      <ImageBackground
        source={{ uri: collectionData.photoApp }}
        style={styles.collectionHeader}
        imageStyle={styles.collectionHeaderImage}
      >
        <View style={styles.collectionOverlay}>
          <Text style={styles.collectionTitle}>{collectionData.title}</Text>
          <Text style={styles.collectionDescription}>{collectionData.description}</Text>
          <Text style={styles.collectionCount}>{firms.length} Places</Text>
        </View>
      </ImageBackground>

      {/* Quick Filters */}
      {/* <View style={styles.filterContainer}>
        <FlatList
          data={quickFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const isSelected = activeQuickFilters.includes(item.name);
            return (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  isSelected && styles.selectedFilterButton,
                ]}
                onPress={() => handleQuickFilterPress(item.name)}
                activeOpacity={0.7}
              >
                {item.name === 'Pure Veg' ? (
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={16}
                    color={isSelected ? 'white' : '#e23845'}
                    style={{ marginRight: 4 }}
                  />
                ) : (
                  <MaterialIcons
                    name={item.icon}
                    size={16}
                    color={isSelected ? 'white' : '#e23845'}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text style={isSelected ? styles.selectedFilterText : styles.filterText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View> */}

      {/* Main Filter Button */}
      {/* <TouchableOpacity 
        style={styles.mainFilterButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="filter-list" size={20} color="#e23845" />
        <Text style={styles.mainFilterText}>Filters</Text>
      </TouchableOpacity> */}

      {/* Restaurant List */}
      <View style={styles.resContainer}>
        <FlatList
          data={filteredFirms}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#e23845']}
            />
          }
          renderItem={({ item }) => (
            <DiningCard
              firmId={item._id}
              restaurantInfo={item.restaurantInfo}
              firmName={item.restaurantInfo.name}
              area={item.restaurantInfo.address}
              rating={item.restaurantInfo.ratings?.overall}
              cuisines={item.restaurantInfo.cuisines}
              price={item.restaurantInfo.priceRange}
              image={item.restaurantInfo.image_urls}
              addtoFavorite={addtoFavorite}
              handleFavoriteClick={handleFavoriteClick}
              onPress={() =>
                safeNavigation({
                  pathname: '/screens/FirmDetailsDining',
                  params: { firmId: item._id },
                })
              }
            />
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No restaurants found in this collection</Text>
            </View>
          }
        />
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            
            <View style={styles.modalBody}>
              <View style={styles.categoryList}>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryButton,
                        selectedCategory === item && styles.activeCategory,
                      ]}
                      onPress={() => handleCategoryPress(item)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === item && styles.activeCategoryText,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              
              <View style={styles.optionsList}>
                <FlatList
                  data={options[selectedCategory] || []}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const isSelected = filter[selectedCategory.toLowerCase().replace(' ', '')] === item;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          isSelected && styles.selectedOptionButton,
                        ]}
                        onPress={() => handleOptionSelect(selectedCategory, item)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  collectionHeader: {
    height: 250,
    width: '100%',
    justifyContent: 'flex-end',
  },
  collectionHeaderImage: {
    borderRadius: 0,
  },
  collectionOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  collectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  collectionDescription: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  collectionCount: {
    fontSize: 14,
    color: 'white',
  },
  filterContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  resContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical:15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e23845',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e23845',
  },
  selectedFilterButton: {
    backgroundColor: '#e23845',
  },
  selectedFilterText: {
    color: '#fff',
  },
  mainFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e23845',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  mainFilterText: {
    marginLeft: 5,
    color: '#e23845',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: windowHeight * 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalBody: {
    flex: 1,
    flexDirection: 'row',
  },
  categoryList: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingRight: 10,
  },
  categoryButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  activeCategory: {
    backgroundColor: '#f8e8e9',
  },
  categoryText: {
    color: '#666',
  },
  activeCategoryText: {
    color: '#e23845',
    fontWeight: '500',
  },
  optionsList: {
    width: '60%',
    paddingLeft: 15,
  },
  optionButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOptionButton: {
    backgroundColor: '#f8e8e9',
  },
  optionText: {
    color: '#666',
  },
  selectedOptionText: {
    color: '#e23845',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e23845',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#e23845',
    fontWeight: '500',
  },
  applyButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#e23845',
    flex: 1,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});