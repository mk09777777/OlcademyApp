import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Switch,
  Modal,
  Image
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IconButton, Chip } from 'react-native-paper';
import TiffinCard from '../../components/TiffinCard';
import SearchBar from '../../components/SearchBar';
import styles from '../../styles/tiffinstyle';
import HomeHeader from '../../components/HomeHeader';
import LocationHeader from '@/components/HomeHeader';
import {
  FILTER_TYPES,
  SORT_OPTIONS,
  CUISINE_TYPES,
  DIETARY_TYPES,
  PRICE_RANGES,
  RATING_OPTIONS,
  DELIVERY_TIME_RANGES,
  applyFilters
} from '../../utils/filterutils';
import FilterModal from '../../components/FilterModal';
import axios from 'axios';
import MinTiffinCard from '../../components/minCardTiffin';
import Whatsonyou from '../../components/WhatYou';
import { useSafeNavigation } from '@/hooks/navigationPage';
const Api_url = 'http://192.168.0.102:3000';

export default function Tiffin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [loadingVegData, setLoadingVegData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [query, setQuery] = useState('');
  const { safeNavigation } = useSafeNavigation();
  const [location, setLocation] = useState({
    city: 'Loading...',
    state: '',
    country: '',
    lat: "43.6534627",
    lon: "-79.4276471",
  });

  const [state, setState] = useState({
    service: null,
    loading: true,
    refreshing: false,
    showCustomization: false,
    showCustomTiffinModal: false,
    selectedMenuItem: null,
    isFavorite: false,
    currentImageIndex: 0,
    showFilters: false,
    filters: {
      sortBy: null,
      cuisineTypes: [],
      priceRange: null,
      rating: null,
      dietaryTypes: [],
      deliveryTime: null
    }
  });

  const SectionTitleWithLines = ({ title }) => {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text style={styles.sectionTitleText}>{title}</Text>
        <View style={styles.line} />
      </View>
    );
  };

  // Fetch location data
  const fetchLocation = async () => {
    try {
      const locationResponse = await axios.get(`${Api_url}/api/location`);
      const { city, state, country, lat, lon } = locationResponse.data;
      setLocation({
        city: city || 'Unknown City',
        state: state || '',
        country: country || '',
        lat: lat || null,
        lon: lon || null
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation({
        city: 'Unknown City',
        state: '',
        country: '',
        lat: null,
        lon: null
      });
    }
  };

  const fetchTiffinData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${Api_url}/api/tiffin`);

      if (!response.data || !Array.isArray(response.data.tiffins)) {
        throw new Error('Invalid data format from API');
      }

      const transformedData = response.data.tiffins.map(tiffin => {
        if (!tiffin) return null;

        return {
          id: tiffin._id,
          Title: tiffin.kitchenName || 'Unknown Kitchen',
          Rating: tiffin.ratings || 0,
          Images: Array.isArray(tiffin.images) ? tiffin.images : [],
          Prices: tiffin.menu?.mealTypes?.reduce((acc, mealType) => {
            if (mealType?.prices && typeof mealType.prices === 'object') {
              const priceValues = Object.values(mealType.prices);
              if (priceValues.length > 0) {
                acc[mealType.label || 'default'] = priceValues[0];
              }
            }
            return acc;
          }, {}) || {},
          "Meal_Types": tiffin.menu?.mealTypes?.map(meal => meal?.label).filter(Boolean) || [],
          "Delivery_Cities": typeof tiffin.deliveryCity === 'string'
            ? tiffin.deliveryCity.split(',').map(c => c.trim()).filter(Boolean)
            : [],
          category: Array.isArray(tiffin.category) ? tiffin.category : [],
          menu: tiffin.menu || {}
        };
      }).filter(Boolean);

      setLocalTiffinData(transformedData);
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
      setLocalTiffinData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchTiffinData(), fetchLocation()]);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchTiffinData(), fetchLocation()]);
    };
    fetchInitialData();
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredTiffinData = applyFilters(localTiffinData, state.filters).filter(item => {
    if (!item || !item.id) return false;

    const matchesSearch = searchQuery
      ? item.Title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const mealTypes = item["Meal_Types"] || item["Meal Types"] || [];
    const matchesFilters = selectedFilters.length === 0 ||
      (Array.isArray(mealTypes) && selectedFilters.some(filter => mealTypes.includes(filter)));
    const matchesVegOnly = isVegOnly ? item.isVeg === true : true;
    return matchesSearch && matchesFilters && matchesVegOnly;
  });

  const getItemKey = (item, index) => {
    return item?.id ? `${item.id}` : `item-${index}`;
  };

  const handleChipPress = (type, value) => {
    setState(prev => {
      const newFilters = { ...prev.filters };

      switch (type) {
        case 'cuisine':
          newFilters.cuisineTypes = newFilters.cuisineTypes.includes(value)
            ? newFilters.cuisineTypes.filter(c => c !== value)
            : [...newFilters.cuisineTypes, value];
          break;
        case 'dietary':
          newFilters.dietaryTypes = newFilters.dietaryTypes.includes(value)
            ? newFilters.dietaryTypes.filter(d => d !== value)
            : [...newFilters.dietaryTypes, value];
          break;
        case 'price':
          newFilters.priceRange = newFilters.priceRange?.label === value.label ? null : value;
          break;
        case 'rating':
          newFilters.rating = newFilters.rating === value.value ? null : value.value;
          break;
        case 'delivery':
          newFilters.deliveryTime = newFilters.deliveryTime?.label === value.label ? null : value;
          break;
        case 'sort':
          newFilters.sortBy = newFilters.sortBy === value ? null : value;
          break;
      }

      return { ...prev, filters: newFilters };
    });
  };

  const isChipActive = (type, value) => {
    switch (type) {
      case 'cuisine':
        return state.filters.cuisineTypes.includes(value);
      case 'dietary':
        return state.filters.dietaryTypes.includes(value);
      case 'price':
        return state.filters.priceRange?.label === value?.label;
      case 'rating':
        return state.filters.rating === value?.value;
      case 'delivery':
        return state.filters.deliveryTime?.label === value?.label;
      case 'sort':
        return state.filters.sortBy === value;
      default:
        return false;
    }
  };

  const renderTiffinItem = useCallback(({ item, index, isVertical = false }) => {
    if (!item) return null;

    if (isVertical) {
      return (
        <TiffinCard
          key={getItemKey(item, index)}
          tiffinId={item.id}
          firm={{
            tiffinId: item.id,
            image: item.Images || require('../../assets/images/food1.jpg'),
            title: item.Title || 'Unknown',
            rating: item.Rating || 0,
            priceRange: Object.values(item.Prices || {})[0] || 'N/A',
            mealTypes: item["Meal_Types"] || item["Meal Types"] || [],
            deliveryCities: item.Delivery_Cities || []
          }}
          onPress={() => {
            if (!item.id) {
              console.error('No ID found for item:', item);
              return;
            }
            safeNavigation({
              pathname: '/screens/TiffinDetails',
              params: {
                tiffinId: item._id || item.id
              }
            });
          }}
          onFavoriteToggle={() => {
            if (!item.Title) return;
            setFavoriteServices(prevState =>
              prevState.includes(item.Title)
                ? prevState.filter(id => id !== item.Title)
                : [...prevState, item.Title]
            );
          }}
          isFavorite={item.Title ? favoriteServices.includes(item.Title) : false}
        />
      );
    } else {
      return (
        <MinTiffinCard
          key={getItemKey(item, index)}
          tiffinId={item.id}
          firm={{
            tiffinId: item.id,
            image: item.Images?.[0] || require('../../assets/images/food1.jpg'),
            title: item.Title || 'Unknown',
            rating: item.Rating || 0,
            priceRange: Object.values(item.Prices || {})[0] || 'N/A',
            mealTypes: item["Meal_Types"] || item["Meal Types"] || [],
            deliveryCities: item.Delivery_Cities || []
          }}
          onPress={() => {
            if (!item.id) {
              console.error('No ID found for item:', item);
              return;
            }
            safeNavigation({
              pathname: '/screens/TiffinDetails',
              params: {
                tiffinId: item._id || item.id
              }
            });
          }}
          onFavoriteToggle={() => {
            if (!item.Title) return;
            setFavoriteServices(prevState =>
              prevState.includes(item.Title)
                ? prevState.filter(id => id !== item.Title)
                : [...prevState, item.Title]
            );
          }}
          isFavorite={item.Title ? favoriteServices.includes(item.Title) : false}
        />
      );
    }
  }, [router, favoriteServices]);

  const renderSection = ({ title, subtitle, data, viewAllRoute, emptyMessage, isVertical, customSubtitleComponent }) => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <SectionTitleWithLines title={title} />
        <View style={styles.sectionHeader}>
          {customSubtitleComponent ? (
            customSubtitleComponent
          ) : (
            subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          )}
          {viewAllRoute && (
            <TouchableOpacity onPress={() => safeNavigation({
              pathname: viewAllRoute,
              params: {
                title,
                filters: JSON.stringify(state.filters),
                searchQuery
              }
            })}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={data}
          renderItem={(props) => renderTiffinItem({ ...props, isVertical })}
          keyExtractor={(item, index) => getItemKey(item, index)}
          horizontal={!isVertical}
          showsHorizontalScrollIndicator={!isVertical}
          scrollEnabled={true}
          contentContainerStyle={isVertical ? styles.verticalListContainer : styles.horizontalListContainer}
        />
      </View>
    );
  };

  const renderFilterChips = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsContainer}
      >
        {/* Sort Chips */}
        {Object.entries(SORT_OPTIONS).map(([key, value]) => (
          <Chip
            key={`sort-${key}`}
            mode="outlined"
            selected={isChipActive('sort', value)}
            onPress={() => handleChipPress('sort', value)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
          </Chip>
        ))}

        {/* Cuisine Chips */}
        {CUISINE_TYPES.map(cuisine => (
          <Chip
            key={`cuisine-${cuisine}`}
            mode="outlined"
            selected={isChipActive('cuisine', cuisine)}
            onPress={() => handleChipPress('cuisine', cuisine)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {cuisine}
          </Chip>
        ))}

        {/* Price Chips */}
        {PRICE_RANGES.map(range => (
          <Chip
            key={`price-${range.label}`}
            mode="outlined"
            selected={isChipActive('price', range)}
            onPress={() => handleChipPress('price', range)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {range.label}
          </Chip>
        ))}

        {/* Rating Chips */}
        {RATING_OPTIONS.map(rating => (
          <Chip
            key={`rating-${rating.label}`}
            mode="outlined"
            selected={isChipActive('rating', rating)}
            onPress={() => handleChipPress('rating', rating)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {rating.label}
          </Chip>
        ))}

        {/* Dietary Chips */}
        {DIETARY_TYPES.map(dietary => (
          <Chip
            key={`dietary-${dietary}`}
            mode="outlined"
            selected={isChipActive('dietary', dietary)}
            onPress={() => handleChipPress('dietary', dietary)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {dietary}
          </Chip>
        ))}

        {/* Delivery Time Chips */}
        {DELIVERY_TIME_RANGES.map(time => (
          <Chip
            key={`delivery-${time.label}`}
            mode="outlined"
            selected={isChipActive('delivery', time)}
            onPress={() => handleChipPress('delivery', time)}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
          >
            {time.label}
          </Chip>
        ))}

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setState(prev => ({ ...prev, showFilters: true }))}
        >
          <MaterialCommunityIcons name="tune" size={20} color="#666" />
          <Text style={styles.filterButtonText}>More Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderMainContent = () => {
    return (
      <>
        <Whatsonyou />

        {renderSection({
          title: 'POPULAR SERVICES',
          data: filteredTiffinData
            .filter(item => parseFloat(item.Rating) >= 4.5)
            .sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating))
            .slice(0, 5),
          viewAllRoute: '/screens/ViewAllTiffins',
          emptyMessage: 'No popular services available',
          isVertical: false
        })}

        {renderSection({
          title: 'NEARBY SERVICES',
          data: filteredTiffinData
            .filter(item => {
              const cities = item["Delivery Cities"] || item.Delivery_Cities || [];
              return cities.some(city =>
                ['Mississauga', 'New York', 'Toronto'].includes(city)
              );
            })
            .slice(0, 5),
          viewAllRoute: '/screens/ViewAllTiffins',
          emptyMessage: 'No nearby services available',
          isVertical: false
        })}

        {renderSection({
          title: 'RECOMMENDED FOR YOU',
          data: filteredTiffinData.slice(0, 5),
          viewAllRoute: '/screens/ViewAllTiffins',
          emptyMessage: 'No recommendations available',
          isVertical: false
        })}

        <View style={styles.filterSection}>
          {renderFilterChips()}
        </View>

        {renderSection({
          title: 'ALL TIFFIN SERVICES',
          data: filteredTiffinData,
          emptyMessage: 'No services available',
          isVertical: true
        })}
      </>
    );
  };

  // Veg Mode: fetch veg tiffins
  const sortVegData = useCallback(async () => {
    if (isVegOnly) {
      setLoadingVegData(true);
      const MIN_LOADING_TIME = 1000;
      const startTime = Date.now();

      try {
        const response = await axios.get(`${Api_url}/firm/getnearbyrest?cuisines=Vegetarian`, {
          withCredentials: true
        });

        // You may want to set your veg tiffin data here
        // setVegData(response.data.data);

        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_TIME - elapsed;
        if (remaining > 0) {
          setTimeout(() => setLoadingVegData(false), remaining);
        } else {
          setLoadingVegData(false);
        }
      } catch (error) {
        console.error('Error fetching vegetarian data:', error);
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_TIME - elapsed;
        if (remaining > 0) {
          setTimeout(() => setLoadingVegData(false), remaining);
        } else {
          setLoadingVegData(false);
        }
      }
    } else {
      setLoadingVegData(false);
      // setVegData([]); // If you use vegData
    }
  }, [isVegOnly]);

  // Upload veg mode to server
  const HandleUploadVegMode = async () => {
    try {
      await fetch(`${Api_url}/api/updateVegMode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vegMode: isVegOnly }),
      });
    } catch (error) {
      console.error("Error updating vegMode", error);
    }
  };

  // Get veg mode from server
  const handleGetVegMode = async () => {
    try {
      const response = await axios.get(`${Api_url}/api/getVegMode`, {
        withCredentials: true
      });
      setIsVegOnly(response.data.vegMode);
    } catch (error) {
      console.error("Error fetching vegMode", error);
    }
  };

  useEffect(() => {
    sortVegData();
  }, [isVegOnly]);

  useEffect(() => {
    handleGetVegMode();
  }, []);

  useEffect(() => {
    HandleUploadVegMode();
  }, [isVegOnly]);

  const handleKeepUsing = () => {
    setIsModalVisible(false);
    setIsVegOnly(true);
    // setSelectedDietary(['vegetarian']); // If you use dietary filter
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e23845" />
      </View>
    );
  }

  if (localTiffinData.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tiffin services available</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchTiffinData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.topContainer}>
          <View style={styles.locationContainer}>
               <LocationHeader />
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginRight: 10 }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => safeNavigation('/screens/NoficationsPage')}
            >
              <Ionicons name='notifications-circle-sharp' size={38} style={{ color: '#e23845', marginRight: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => safeNavigation('/screens/User')}
            >
              <Ionicons name='person-circle' size={40} style={{ color: '#e23845' }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchAndVegContainer}>
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
          />
          <View style={styles.vegFilterContainer}>
            <Text style={styles.vegFilterText}>Veg</Text>
            <Text style={styles.vegFilterText2}>Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#8BC34A" }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={(newValue) => {
                setIsVegOnly(newValue);
                setSelectedDietary(newValue ? ['vegetarian'] : []); // If you use dietary filter
                if (!newValue) {
                  setIsModalVisible(true);
                }
              }}
              style={{ marginTop: 0 }}
              value={isVegOnly}
            />
          </View>
          <Modal
            visible={isModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalV}>
                <View style={styles.imageView}>
                  <Image
                    style={styles.imageE}
                    source={require('../../assets/images/error1.png')}
                  />
                </View>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginTop: 5 }}>Switch off Veg Mode?</Text>
                <Text style={{ color: "black", fontWeight: "400", marginTop1: 10, fontSize: 15, marginTop: 10 }}>You'll see all restaurants, including those</Text>
                <Text >serving non-veg dishes</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Text style={{ color: "red", fontSize: 15, fontWeight: "500", marginTop: 20 }}>Switch off</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleKeepUsing} style={styles.KeepUsingButton}>
                  <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>keep using it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <FlatList
        data={[1]} // Single item to render the content
        renderItem={() => renderMainContent()}
        keyExtractor={() => 'main-content'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <FilterModal
        visible={state.showFilters}
        onClose={() => setState(prev => ({ ...prev, showFilters: false }))}
        onApply={(newFilters) => {
          setState(prev => ({
            ...prev,
            filters: newFilters,
            showFilters: false
          }));
        }}
        filters={state.filters}
        options={{
          sortOptions: SORT_OPTIONS,
          cuisineTypes: CUISINE_TYPES,
          priceRanges: PRICE_RANGES,
          ratingOptions: RATING_OPTIONS,
          dietaryTypes: DIETARY_TYPES,
          deliveryTimeRanges: DELIVERY_TIME_RANGES
        }}
      />
    </SafeAreaView>
  );
};