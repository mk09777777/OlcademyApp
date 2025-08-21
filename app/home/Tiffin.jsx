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
  Image,
  Pressable,
  Alert
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import SearchBar from '../../components/SearchBar';
import styles from '../../styles/tiffinstyle';
import LocationHeader from '@/components/HomeHeader';
import axios from 'axios';
import MinTiffinCard from '../../components/minCardTiffin';
import Whatsonyou from '../../components/WhatYou';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useAuth } from '@/context/AuthContext';
import FilterModal from '@/components/FilterModal';
import BannerCarousel from '@/components/Banner';

const Api_url = 'http://10.34.125.16:3000';

// Filter options
const FILTER_OPTIONS = {
  SORT_BY: [
    { label: 'Rating: High to Low', value: 'rating-desc' },
    { label: 'Rating: Low to High', value: 'rating-asc' },
    { label: 'Price: High to Low', value: 'costHighToLow' },
    { label: 'Price: Low to High', value: 'costLowToHigh' },
  ],
  CATEGORY: [
    { label: 'Vegetarian', value: 'veg' },
    { label: 'Non-Vegetarian', value: 'non-veg' },
  ],
  // RATING: [
  //   { label: '4.0+', value: '4.0' },
  //   { label: '4.5+', value: '4.5' },
  //   { label: '5.0', value: '5.0' },
  // ],
  // PRICE_RANGE: [
  //   { label: 'Under ₹100', value: '100' },
  //   { label: '₹100-₹200', value: '200' },
  //   { label: '₹200-₹300', value: '300' },
  //   { label: '₹300+', value: '300+' },
  // ],
  DELIVERY_CITIES: [],
  SPECIAL_FILTERS: [
    { label: 'Open Now', value: 'openNow' },
    { label: 'Top Rated', value: 'topRated' },
  ]
};

// Quick filters
const QUICK_FILTERS = [
  { name: 'Rating 4.0+', icon: 'star' },
  { name: 'Pure Veg', icon: 'leaf' },
  { name: 'Top Rated', icon: 'thumb-up' },
  { name: 'Open Now', icon: 'clock' },
];

export default function Tiffin() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedFilters, setSelectedFilters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [loadingVegData, setLoadingVegData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [recentlyViewData, setRecentlyViewdData] = useState([])
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const [location, setLocation] = useState({
    city: 'Loading...',
    state: '',
    country: '',
    lat: "43.6534627",
    lon: "-79.4276471",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: null,
    category: null,
    rating: null,
    price: null,
    deliveryCity: null,
    special: null,
  });
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [minRatingFilter, setMinRatingFilter] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [offersFilter, setOffersFilter] = useState(false);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [recommendedTiffins, setRecommendedTiffins] = useState([]);

  const SectionTitleWithLines = ({ title }) => {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.line} />
        <Text style={styles.sectionTitleText}>{title}</Text>
        <View style={styles.line} />
      </View>
    );
  };

  const toggleFavorite = useCallback(async (tiffinId) => {
    if (!isAuthenticated || !user?.id) {
      Alert.alert('Login Required', 'Please login to save favorites');
      return;
    }

    setFavoriteLoading(prev => ({ ...prev, [tiffinId]: true }));

    try {
      const response = await axios.post(
        `${Api_url}/api/tiffins/${tiffinId}/like`,
        {},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log('data', JSON.stringify(response.data))
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [tiffinId]: false }));
    }
  }, [isAuthenticated, user?.id], fetchLikedTiffins);

  const fetchLikedTiffins = useCallback(async (tiffinId) => {
    if (isAuthenticated && user?.id) {
      try {
        const response = await axios.get(`${Api_url}/api/tiffins/liked`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });

        let favorites = [];
        if (response.data && Array.isArray(response.data.favorites)) {
          favorites = response.data.favorites;
        }
        else if (Array.isArray(response.data)) {
          favorites = response.data;
        }
        else if (response.data && typeof response.data === 'object') {
          // Try to extract array from the object
          favorites = Object.values(response.data).find(Array.isArray) || [];
        }
        setFavoriteServices(favorites.map(t => t._id || t.id || t));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
  }, [isAuthenticated, user?.id]);

  // Call this when component mounts and when user toggles favorites
  useEffect(() => {
    fetchLikedTiffins();
  }, [fetchLikedTiffins]);

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
const FetchRecentlyViewData = useCallback(async () => {
  try {
    const response = await axios.get(`${Api_url}/firm/getrecently-viewed`, {
      withCredentials: true
    });

    // Improved data transformation
    const firmItems = response.data.recentlyViewed
      ?.filter(item => item.itemType === "Tiffin")
      ?.map(item => ({
        id: item.itemId,
        Title: item.tiffinInfo?.name || 'Unknown Tiffin',
        Rating: item.tiffinInfo?.ratings || 0,
        Images: item.tiffinInfo?.image_urls || [],
        address: item.tiffinInfo?.address || '',
        // mincost: 0,
        // isVeg: item.tiffinInfo?.name?.toLowerCase().includes('veg') || false,
        // Delivery_Cities: [], 
        // "Meal_Types": [] 
      })) || [];

    console.log('Recently viewed data:', firmItems);
    setRecentlyViewdData(firmItems);
  } catch (error) {
    console.error('Error fetching recently viewed data:', error);
    setRecentlyViewdData([]);
  }
}, []);
  const fetchTiffinData = async (filters = {}) => {
    try {
      setIsLoading(true);
      let url = `${Api_url}/api/tiffin/tiffins/filter`;
      const params = new URLSearchParams();

      // Apply filters if any
      if (filters.sortBy) {
        const [sortField, sortOrder] = filters.sortBy.split('-');
        params.append('sortBy', sortField);
        params.append('order', sortOrder);
      }
      if (filters.rating) params.append('minRating', filters.rating);
      if (filters.price) params.append('price', filters.price);
      if (filters.category) params.append('category', filters.category);
      if (filters.deliveryCity) params.append('deliveryCity', filters.deliveryCity);
      if (filters.special === 'openNow') {
        url = `${Api_url}/api/tiffin/tiffins/open-now`;
      } else if (filters.special === 'topRated') {
        url = `${Api_url}/api/tiffin/tiffins/high-rated`;
      }

      if (params.toString() && !['open-now', 'high-rated'].includes(filters.special)) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);

      if (!response.data || (!Array.isArray(response.data) && !Array.isArray(response.data.tiffins))) {
        throw new Error('Invalid data format from API');
      }

      const data = Array.isArray(response.data) ? response.data : response.data.tiffins;

      const transformedData = data.map(tiffin => {
        if (!tiffin) return null;

        return {
          id: tiffin._id || tiffin.id,
          Title: tiffin.kitchenName || tiffin.tiffin_name || 'Unknown Kitchen',
          Rating: tiffin.ratings || tiffin.rating || 0,
          Images: Array.isArray(tiffin.images) ? tiffin.images : (tiffin.image_url ? [tiffin.image_url] : []),
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
          menu: tiffin.menu || {},
          isVeg: tiffin.category?.includes('veg') || false,
          mincost: tiffin.minCost,
        };
      }).filter(Boolean);

      const allCities = transformedData.flatMap(tiffin => tiffin.Delivery_Cities || []);
      const uniqueCities = [...new Set(allCities)].filter(city => city.trim() !== '');
      FILTER_OPTIONS.DELIVERY_CITIES = uniqueCities.map(city => ({
        label: city,
        value: city.toLowerCase().replace(/\s+/g, '-')
      }));

      setLocalTiffinData(transformedData);
      updateRecommendedTiffins(transformedData);
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
      setLocalTiffinData([]);
    } finally {
      setIsLoading(false);
    }
  };
  const updateRecommendedTiffins = useCallback((data) => {
    if (!data || !data.length) return;

    let recommendations = [...data];

    // Filter by delivery city first (if location is available)
    if (location.city && location.city !== 'Loading...' && location.city !== 'Unknown City') {
      recommendations = recommendations.filter(tiffin =>
        tiffin.Delivery_Cities?.some(city =>
          city.toLowerCase().includes(location.city.toLowerCase())
        ))
    }

    // Filter to only include tiffins with rating >= 4
    recommendations = recommendations.filter(tiffin => tiffin.Rating >= 4);

    // Then sort by rating and price
    recommendations.sort((a, b) => {
      if (b.Rating !== a.Rating) {
        return b.Rating - a.Rating;
      }
      const aPrice = a.mincost || Number.MAX_SAFE_INTEGER;
      const bPrice = b.mincost || Number.MAX_SAFE_INTEGER;
      return aPrice - bPrice;
    });

    setRecommendedTiffins(recommendations);
  }, [location.city]);

  const handleQuickFilter = (filterName) => {
    setActiveQuickFilters(prev => {
      const newFilters = prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName];

      if (filterName === 'Rating 4.0+') {
        setMinRatingFilter(newFilters.includes(filterName) ? 4 : null);
      }
      if (filterName === 'Pure Veg') {
        setSelectedDietary(newFilters.includes(filterName) ? ['vegetarian'] : []);
      }
      if (filterName === 'Top Rated') {
        setOffersFilter(newFilters.includes(filterName));
      }
      if (filterName === 'Open Now') {
        setOpenNowFilter(newFilters.includes(filterName));
      }

      return newFilters;
    });
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      await fetchTiffinData(activeFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
      Alert.alert('Error', 'Failed to apply filters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setActiveFilters({
      sortBy: null,
      category: null,
      rating: null,
      price: null,
      deliveryCity: null,
      special: null,
    });
    setActiveQuickFilters([]);
    setMinRatingFilter(null);
    setSelectedDietary([]);
    setOffersFilter(false);
    setOpenNowFilter(false);
    fetchTiffinData();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchTiffinData(activeFilters), fetchLocation()]);
    } catch (error) {
      console.error('Error during refresh:', error);
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchTiffinData(), fetchLocation()]);
    };
    fetchInitialData();
    FetchRecentlyViewData();
  }, []);

  useEffect(() => {
    if (Object.values(activeFilters).some(filter => filter !== null) ||
      activeQuickFilters.length > 0) {
      applyFilters();
    }
  }, [activeFilters, activeQuickFilters]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    const searchTiffins = async () => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`${Api_url}/search`, {
          params: { query }
        });

        const results = response.data?.tiffins || [];
        const formattedResults = results.map(tiffin => {
          if (!tiffin) return null;

          return {
            id: tiffin.id,
            Title: tiffin.tiffin_name || 'Unknown Kitchen',
            Rating: tiffin.rating || 0,
            Images: tiffin.image_url ? [tiffin.image_url] : [],
            Prices: {},
            "Meal_Types": [],
            "Delivery_Cities": [],
            category: tiffin.category || [],
            isVeg: tiffin.category?.includes('veg') || false
          };
        }).filter(Boolean);

        setSearchResults(formattedResults);
      } catch (error) {
        console.error('Error searching tiffins:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchTiffins, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getDisplayData = () => {
    if (query.trim() && searchResults.length > 0) {
      return searchResults;
    }
    return localTiffinData;
  };

  const filteredTiffinData = getDisplayData().filter(item => {
    if (!item || !item.id) return false;

    const matchesSearch = searchQuery
      ? item.Title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesVegOnly = isVegOnly ? item.isVeg === true : true;
    return matchesSearch && matchesVegOnly;
  });

  const getItemKey = (item, index) => {
    return item?.id ? `${item.id}` : `item-${index}`;
  };
  const renderTiffinItem = useCallback(({ item, index, isVertical = false }) => {
    if (!item) return null;

    const isFavorite = favoriteServices.includes(item.id)
    const isLoading = favoriteLoading[item.id];
    if (isVertical) {
      return (
        <TiffinCard
          key={getItemKey(item, index)}
          firm={{
            id: item.id,
            image: item.Images?.[0] || require('../../assets/images/food1.jpg'),
            title: item.Title || 'Unknown',
            rating: item.Rating || 0,
            priceRange: item.mincost || 'N/A',
            mealTypes: item["Meal_Types"] || [],
            deliveryCities: item.Delivery_Cities || [],
          }}
          onPress={() => {
            safeNavigation({
              pathname: '/screens/TiffinDetails',
              params: { tiffinId: item.id }
            });
          }}
          onFavoriteToggle={() => toggleFavorite(item.id, item.Title)}
          isFavorite={isFavorite}
          isLoading={isLoading}
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
            // priceRange: Object.values(item.Prices || {})[0] || 'N/A',
            // mealTypes: item["Meal_Types"] || item["Meal Types"] || [],
            // deliveryCities: item.Delivery_Cities || [],
            // isVeg: item.isVeg || false
          }}
          onPress={() => {
            if (!item.id) {
              console.error('No ID found for item:', item);
              return;
            }
            safeNavigation({
              pathname: '/screens/TiffinDetails',
              params: {
                tiffinId: item.id
              }
            });
          }}
          onFavoriteToggle={() => toggleFavorite(item.id, item.Title)}
          isFavorite={isFavorite}
          isLoading={isLoading}
        />
      );
    }
  }, [favoriteServices, favoriteLoading, safeNavigation, toggleFavorite]);
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
          {viewAllRoute && (
            <TouchableOpacity onPress={() => safeNavigation({
              pathname: viewAllRoute,
              params: {
                title,
                filters: JSON.stringify(activeFilters),
                searchQuery
              }
            })}>
              {/* <Text style={styles.viewAllText}>View All</Text> */}
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

  const renderMainContent = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e23845" />
        </View>
      );
    }

    if (query.trim() && searchResults.length === 0 && !isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setQuery('')}
          >
            <Text style={styles.retryButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return query.trim() ? (
      renderSection({
        data: filteredTiffinData,
        emptyMessage: 'No matching services found',
        isVertical: true,
      })
    ) : (
      <>
        <Whatsonyou />
        {recentlyViewData.length > 0 && renderSection({
          title: 'RECENTLY VIEWED',
          data: recentlyViewData,
          emptyMessage: 'No recently viewed tiffins',
          isVertical: false
        })}
        {renderSection({
          title: 'RECOMMENDED FOR YOU',
          data: recommendedTiffins.length ? recommendedTiffins : updateRecommendedTiffins,
          emptyMessage: 'No recommendations available',
          isVertical: false
        })}


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickFiltersContainer}
          contentContainerStyle={styles.quickFiltersContent}
        >
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <MaterialCommunityIcons name="filter" size={20} color="#e23845" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </Pressable>

          {QUICK_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.name}
              style={[
                styles.filterButton,
                activeQuickFilters.includes(filter.name) && styles.activeQuickFilter
              ]}
              onPress={() => handleQuickFilter(filter.name)}
            >
              <MaterialCommunityIcons
                name={filter.icon}
                size={16}
                color={activeQuickFilters.includes(filter.name) ? '#e23845' : '#666'}
              />
              <Text style={[
                styles.quickFilterText,
                activeQuickFilters.includes(filter.name) && styles.activeQuickFilterText
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderSection({
          title: 'ALL TIFFIN SERVICES',
          data: filteredTiffinData,
          emptyMessage: query.trim() ? 'No matching services found' : 'No services available',
          isVertical: true,
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
        const response = await axios.get(`${Api_url}/api/tiffin/tiffins/filter?category=veg`, {
          withCredentials: true
        });

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
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e23845" />
      </View>
    );
  }

  // if (!isLoading && localTiffinData.length === 0 && !query.trim()) {
  //   return (
  //     <View style={styles.emptyContainer}>
  //       <Text style={styles.emptyText}>No tiffin services available</Text>
  //       <TouchableOpacity
  //         style={styles.retryButton}
  //         onPress={fetchTiffinData}
  //       >
  //         <Text style={styles.retryButtonText}>Retry</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.topContainer}>
          <View style={styles.locationContainer}>
            <LocationHeader />
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginRight: 10, marginTop: 10, }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/screens/NoficationsPage')}
            >
              <Ionicons name='notifications-circle-sharp' size={38} style={{ color: '#e23845', marginRight: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/screens/User')}
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
            <Text style={styles.vegFilterText}>Veg Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#8BC34A" }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={(newValue) => {
                setIsVegOnly(newValue);
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
      <View><BannerCarousel page="Tiffin-services" /></View>
      {/* {renderFilterModal()} */}
      <FilterModal
        isOpen={showFilters}
        setIsOpen={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onApplyFilters={applyFilters}
      />
      <FlatList
        data={[1]}
        renderItem={() => renderMainContent()}
        keyExtractor={() => 'main-content'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}