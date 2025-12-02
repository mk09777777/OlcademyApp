import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import SearchBar from '../../components/SearchBar';
import LocationHeader from '@/components/HomeHeader';
import axios from 'axios';
import MinTiffinCard from '../../components/minCardTiffin';
import Whatsonyou from '../../components/WhatYou';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useAuth } from '@/context/AuthContext';
import FilterModal from '@/components/FilterModal';
import BannerCarousel from '@/components/Banner';
import MiniRecommendedCard from '@/components/MiniRecommendedCard';
import ErrorHandler from '@/components/ErrorHandler';

const Api_url = 'https://backend-0wyj.onrender.com';

// Sort options
const sortOptions = [
  { id: 1, label: 'Default', value: 'default' },
  { id: 2, label: 'Rating: High to Low', value: 'rating-desc' },
  { id: 3, label: 'Rating: Low to High', value: 'rating-asc' },
  { id: 4, label: 'Price: Low to High', value: 'costLowToHigh' },
  { id: 5, label: 'Price: High to Low', value: 'costHighToLow' },
];

// Quick filters
const quickFilters = [
  { name: 'Filters', icon: 'filter' },
  { name: 'Rating 4.0+', icon: 'star' },
  { name: 'Pure Veg', icon: 'leaf' },
  { name: 'Top Rated', icon: 'thumb-up' },
  { name: 'Open Now', icon: 'clock' },
];

export default function Tiffin() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  const showcaseRef = useRef(null);

  // Core state management
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Progress indicator states
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  // Search states
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [minRatingFilter, setMinRatingFilter] = useState(null);
  const [maxRatingFilter, setMaxRatingFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([]);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [offersFilter, setOffersFilter] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: null,
    category: null,
    rating: null,
    price: null,
    deliveryCity: null,
    special: null,
  });

  // Veg mode states
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [loadingVegData, setLoadingVegData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Favorites and recently viewed
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [recentlyViewData, setRecentlyViewdData] = useState([]);
  const [recommendedTiffins, setRecommendedTiffins] = useState([]);
  const [popularData, setPopularData] = useState([]);

  // Location state
  const [location, setLocation] = useState({
    city: 'Loading...',
    state: '',
    country: '',
    lat: "43.6534627",
    lon: "-79.4276471",
  });

  // Section Title Component
  const SectionTitleWithLines = ({ title }) => {
    return (
      <View className="flex-row items-center mt-4 mb-4">
        <View className="flex-1 h-px bg-primary" />
        <Text className="font-outfit text-xs text-textprimary mx-2">{title}</Text>
        <View className="flex-1 h-px bg-primary" />
      </View>
    );
  };

  // Fetch location
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
      setError('Failed to detect location');
      setLocation({
        city: 'Unknown City',
        state: '',
        country: '',
        lat: null,
        lon: null
      });
    }
  };

  // Fetch recently viewed data
  const FetchRecentlyViewData = useCallback(async () => {
    try {
      const response = await axios.get(`${Api_url}/firm/getrecently-viewed`, {
        withCredentials: true
      });

      const firmItems = response.data.recentlyViewed
        ?.filter(item => item.itemType === "Tiffin")
        ?.map(item => ({
          id: item.itemId,
          Title: item.tiffinInfo?.name || 'Unknown Tiffin',
          Rating: item.tiffinInfo?.ratings || 0,
          Images: item.tiffinInfo?.image_urls || [],
          address: item.tiffinInfo?.address || '',
        })) || [];

      setRecentlyViewdData(firmItems);
    } catch (error) {
      console.error('Error fetching recently viewed data:', error);
      setRecentlyViewdData([]);
      setError('Failed to load recently viewed tiffins');
    }
  }, []);

  // Fetch popular/recommended tiffins
  const sortPopularData = useCallback(() => {
    const sorted = localTiffinData.filter(
      (item) => item.Rating >= 4
    );
    setPopularData(sorted);
  }, [localTiffinData]);

  // Main fetch function with pagination
  const fetchTiffinData = async (params = {}, isLoadMore = false) => {
    if (isLoadMore && !hasMore) return [];

    setLoading(true);
    setShowProgress(true);
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 10));
    }, 100);

    try {
      const baseParams = {
        limit: 20,
        cursor: isLoadMore ? cursor : null,
      };

      // Apply filters
      if (selectedSortOption) {
        const [sortField, sortOrder] = selectedSortOption.value.split('-');
        baseParams.sortBy = sortField;
        baseParams.order = sortOrder;
      }
      if (minRatingFilter) baseParams.minRating = minRatingFilter;
      if (maxRatingFilter) baseParams.maxRating = maxRatingFilter;
      if (priceRangeFilter.length > 0) baseParams.priceRange = priceRangeFilter.join(',');
      if (openNowFilter) baseParams.openNow = true;
      if (offersFilter) baseParams.offers = true;
      if (isVegOnly) baseParams.category = 'veg';
      else if (selectedDietary.length > 0) baseParams.Dietary = selectedDietary.join(',');

      const finalParams = { ...baseParams, ...params };

      let url = `${Api_url}/api/tiffin/tiffins/filter`;
      if (activeFilters.special === 'openNow') {
        url = `${Api_url}/api/tiffin/tiffins/open-now`;
      } else if (activeFilters.special === 'topRated') {
        url = `${Api_url}/api/tiffin/tiffins/high-rated`;
      }

      const response = await axios.get(url, {
        params: finalParams,
        withCredentials: true
      });

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

      if (isLoadMore) {
        setIsLoadingMore(false);
        setLocalTiffinData(prev => [...prev, ...transformedData]);
      } else {
        setLocalTiffinData(transformedData);
      }

      setCursor(response.data.nextCursor);
      setHasMore(response.data.nextCursor !== null && transformedData.length === 20);
      setNotFound(false);

      // Update recommended tiffins
      updateRecommendedTiffins(transformedData);

      return transformedData;
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
      if (!isLoadMore) {
        setNotFound(true);
        removeNotFound();
      }
      if (isLoadMore) {
        setIsLoadingMore(false);
      }
      return [];
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setShowProgress(false);
        setRefreshing(false);
      }, 300);
    }
  };

  const removeNotFound = async () => {
    setTimeout(async () => {
      setNotFound(false);
      await fetchTiffinData({}, false);
    }, 1500);
  };

  // Update recommended tiffins
  const updateRecommendedTiffins = useCallback((data) => {
    if (!data || !data.length) return;

    let recommendations = [...data];

    if (location.city && location.city !== 'Loading...' && location.city !== 'Unknown City') {
      recommendations = recommendations.filter(tiffin =>
        tiffin.Delivery_Cities?.some(city =>
          city.toLowerCase().includes(location.city.toLowerCase())
        ))
    }

    recommendations = recommendations.filter(tiffin => tiffin.Rating >= 4);

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

  // Fetch liked tiffins
  const fetchLikedTiffins = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      try { 
        const response = await axios.get(`${Api_url}/api/tiffins/liked`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });

        let favorites = [];
        if (response.data && Array.isArray(response.data.favorites)) {
          favorites = response.data.favorites;
        } else if (Array.isArray(response.data)) {
          favorites = response.data;
        } else if (response.data && typeof response.data === 'object') {
          favorites = Object.values(response.data).find(Array.isArray) || [];
        }
        setFavoriteServices(favorites.map(t => t._id || t.id || t));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
  }, [isAuthenticated, user?.id]);

  // Toggle favorite
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
      await fetchLikedTiffins();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [tiffinId]: false }));
    }
  }, [isAuthenticated, user?.id, fetchLikedTiffins]);

  // Search functionality
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
        setError('Failed to search tiffins');
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchTiffins, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Quick filter handler
  const handleQuickFilterPress = (filterName) => {
    if (filterName === 'Filters') {
      setShowFilters(true);
      return;
    }

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

  // Apply filters effect
  useEffect(() => {
    const applyFilters = async () => {
      const firmsData = await fetchTiffinData();
      setLocalTiffinData(firmsData);
    };
    const debounceTimer = setTimeout(applyFilters, 300);
    return () => clearTimeout(debounceTimer);
  }, [
    selectedSortOption,
    selectedCuisines,
    selectedDietary,
    minRatingFilter,
    maxRatingFilter,
    priceRangeFilter,
    openNowFilter,
    offersFilter,
    isVegOnly
  ]);

  // Veg mode handling
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
    setSelectedDietary(['vegetarian']);
  };

  // Initial data fetch
  const fetchInitialData = async () => {
    setIsInitialLoading(true);
    try {
      await fetchLocation();
      const firmsData = await fetchTiffinData();
      if (firmsData && firmsData.length > 0) {
        setLocalTiffinData(firmsData);
      }
      await FetchRecentlyViewData();
      sortPopularData();
    } catch (error) {
      console.error('Error in initial data fetch:', error);
      setError('Failed to load tiffin services.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCursor(null);
    setHasMore(true);
    fetchInitialData();
  }, []);

  // Load more handler
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isSearching && query.trim() === '') {
      setIsLoadingMore(true);
      fetchTiffinData({}, true);
      FetchRecentlyViewData();
      sortPopularData();
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchLikedTiffins();
  }, []);

  useEffect(() => {
    sortPopularData();
  }, [localTiffinData]);

  // Filtered data
  const filteredTiffinData = useMemo(() => {
    if (query.trim() !== '') {
      return searchResults;
    }
    return localTiffinData.filter(item => {
      if (!item || !item.id) return false;
      const matchesSearch = searchQuery
        ? item.Title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesVegOnly = isVegOnly ? item.isVeg === true : true;
      return matchesSearch && matchesVegOnly;
    });
  }, [localTiffinData, query, searchResults, searchQuery, isVegOnly]);

  // Get item key
  const getItemKey = (item, index) => {
    return item?.id ? `${item.id}` : `item-${index}`;
  };

  // Render tiffin item
  const renderTiffinItem = useCallback(({ item, index, isVertical = false }) => {
    if (!item) return null;

    const isFavorite = favoriteServices.includes(item.id);
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
          onFavoriteToggle={() => toggleFavorite(item.id)}
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
          }}
          onPress={() => {
            if (!item.id) {
              console.error('No ID found for item:', item);
              return;
            }
            safeNavigation({
              pathname: '/screens/TiffinDetails',
              params: { tiffinId: item.id }
            });
          }}
          onFavoriteToggle={() => toggleFavorite(item.id)}
          isFavorite={isFavorite}
          isLoading={isLoading}
        />
      );
    }
  }, [favoriteServices, favoriteLoading, safeNavigation, toggleFavorite]);

  // Render main content
  if (isInitialLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#02757A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mr-1 ml-0.5">
        <LocationHeader />
        <View className="flex-row pr-4 items-center">
          <TouchableOpacity onPress={() => safeNavigation('/screens/NoficationsPage')}>
            <Ionicons name='notifications-circle-outline' color='#02757A' size={42} style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => safeNavigation('/screens/User')}>
            <Ionicons name='person-circle-outline' size={42} color='#02757A' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Veg Mode */}
      <View className="flex-row items-center justify-between mr-1.5 ml-1.5">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={setSearchQuery}
        />
        <View className="flex-col items-center justify-start ml-2.5">
          <Text className="text-base font-outfit-medium text-textsecondary text-center">Veg</Text>
          <Text className="text-sm font-outfit-bold text-textsecondary text-center">Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#8BC34A" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={(newValue) => {
              setIsVegOnly(newValue);
              setSelectedDietary(newValue ? ['vegetarian'] : []);
              if (!newValue) {
                setIsModalVisible(true);
              }
            }}
            style={{ marginTop: -5 }}
            value={isVegOnly}
          />
        </View>

        {/* Veg Mode Loading Modal */}
        <Modal
          visible={loadingVegData}
          transparent={false}
          onRequestClose={() => setLoadingVegData(false)}
        >
          <View className="bg-white items-center justify-center flex-1">
            <Image
              source={require("../../assets/images/natural.png")}
              className="w-24 h-24"
            />
            <Text className="text-base text-textprimary font-semibold mt-4">
              Explore veg tiffins from all services
            </Text>
          </View>
        </Modal>

        {/* Veg Mode Switch Off Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="bg-black/50 flex-1 justify-center">
            <View className="bg-white rounded-2.5 flex-col mx-5 p-2.5 items-center">
              <View className="mt-2.5 justify-center items-center">
                <Image
                  className="h-24 w-24"
                  source={require('../../assets/images/error1.png')}
                />
              </View>
              <Text className="text-textprimary font-bold text-xl mt-1">Switch off Veg Mode?</Text>
              <Text className="text-textprimary font-normal text-base mt-2.5">
                You'll see all tiffin services, including those
              </Text>
              <Text className="text-textprimary">serving non-veg dishes</Text>

              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text className="text-red-500 text-base font-medium mt-5">Switch off</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleKeepUsing} 
                className="p-2.5 mx-2.5 bg-white rounded-lg mt-2.5 justify-center items-center"
              >
                <Text className="text-textprimary text-base font-medium">keep using it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Progress Bar */}
      {showProgress && (
        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </View>
      )}

      {/* Error Handler */}
      {error && !loading && (
        <ErrorHandler
          error={error}
          onRetry={() => {
            setError(null);
            fetchInitialData();
          }}
          title="Oops! Something went wrong"
          message={error}
        />
      )}

      {/* Not Found Message */}
      {notFound && !error && (
        <View className="p-4 items-center">
          <Text className="text-textsecondary text-base">
            No tiffin services found with these filters
          </Text>
        </View>
      )}

      {/* Main FlatList */}
      <FlatList
        data={filteredTiffinData}
        ref={showcaseRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#02757A']}
            tintColor={'#02757A'}
          />
        }
        ListHeaderComponent={
          query.trim() === '' ? (
            <View>
              {/* Banner */}
              <View className="mr-1.5 ml-1.5">
                <BannerCarousel page="Tiffin-services" />
              </View>

              {/* What's on your mind */}
              <View className="mr-1.5 ml-1.5">
                <Whatsonyou />
              </View>

              {/* Recently Viewed */}
              <View className="flex">
                <SectionTitleWithLines title="RECENTLY VIEWED" />

                {recentlyViewData.length > 0 ? (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={recentlyViewData}
                    horizontal
                    keyExtractor={(item, index) => item.id + '-' + index}
                    renderItem={({ item, index }) => (
                      <MiniRecommendedCard
                        key={item.id}
                        name={item.Title}
                        address={item.address}
                        image={item.Images}
                        rating={item.Rating}
                        onPress={() => {
                          safeNavigation({
                            pathname: '/screens/TiffinDetails',
                            params: { tiffinId: item.id }
                          });
                        }}
                        onFavoriteToggle={() => {
                          setFavoriteServices(prevState =>
                            prevState.includes(item.id)
                              ? prevState.filter(id => id !== item.id)
                              : [...prevState, item.id]
                          );
                        }}
                        isFavorite={favoriteServices.includes(item.id)}
                      />
                    )}
                  />
                ) : (
                  <View className="items-center justify-center py-6">
                    <Image
                      source={require('@/assets/images/nodata.png')}
                      className="w-36 h-36"
                      resizeMode="contain"
                    />
                    <Text className="mt-3 text-sm font-outfit text-textsecondary text-center px-6">
                      {error ? 'Unable to load recently viewed tiffins' : 'Browse tiffin services to start building your recently viewed list.'}
                    </Text>
                    {error && (
                      <TouchableOpacity
                        className="mt-3 bg-primary px-4 py-2 rounded-lg"
                        onPress={() => {
                          setError(null);
                          FetchRecentlyViewData();
                        }}
                      >
                        <Text className="text-white font-outfit-medium">Retry</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Recommended for you */}
              <View className="flex mt-1">
                <SectionTitleWithLines title="RECOMMENDED FOR YOU" />
                
                {recommendedTiffins.length > 0 ? (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={recommendedTiffins}
                    horizontal
                    renderItem={({ item, index }) => (
                      <MiniRecommendedCard
                        key={getItemKey(item, index)}
                        tiffinId={item.id}
                        name={item.Title}
                        address={item.address}
                        image={item.Images}
                        rating={item.Rating}
                        onPress={() => {
                          if (!item.id) {
                            console.error('No ID found for item:', item);
                            return;
                          }
                          safeNavigation({
                            pathname: '/screens/TiffinDetails',
                            params: { tiffinId: item.id }
                          });
                        }}
                        onFavoriteToggle={() => {
                          if (!item.id) return;
                          setFavoriteServices(prevState =>
                            prevState.includes(item.id)
                              ? prevState.filter(id => id !== item.id)
                              : [...prevState, item.id]
                          );
                        }}
                        isFavorite={item.id ? favoriteServices.includes(item.id) : false}
                      />
                    )}
                    keyExtractor={(item, index) => item.id ? `${item.id}` : `rec-item-${index}`}
                  />
                ) : (
                  <View className="items-center justify-center py-6">
                    <Image
                      source={require('@/assets/images/nodata.png')}
                      className="w-36 h-36"
                      resizeMode="contain"
                    />
                    <Text className="mt-3 text-sm font-outfit text-textsecondary text-center px-6">
                      We're curating personalized recommendations for you. Check back soon!
                    </Text>
                  </View>
                )}
              </View>

              {/* All Tiffin Services */}
              <SectionTitleWithLines title="ALL TIFFIN SERVICES" />

              {/* Quick Filters */}
              <View className="mb-4">
                <FlatList
                  data={quickFilters}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  decelerationRate={1}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => {
                    const isSelected = activeQuickFilters.includes(item.name);
                    return (
                      <TouchableOpacity
                        className={`flex-row items-center px-3 py-2 mr-2 rounded-full border border-primary ${
                          isSelected ? 'bg-primary' : ''
                        }`}
                        onPress={() => handleQuickFilterPress(item.name)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={16}
                          color={isSelected ? "white" : "#02757A"}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          className={`text-sm font-outfit-medium ${
                            isSelected ? 'text-white' : 'text-textprimary'
                          }`}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          if (!item || !item.id) {
            console.warn('Invalid tiffin item:', item);
            return null;
          }

          return renderTiffinItem({ item, isVertical: true });
        }}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View className="flex-1 justify-center mt-10 items-center">
              <ActivityIndicator size="large" color="#02757A" />
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        setIsOpen={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onApplyFilters={async () => {
          try {
            setLoading(true);
            await fetchTiffinData(activeFilters);
          } catch (error) {
            console.error('Error applying filters:', error);
            Alert.alert('Error', 'Failed to apply filters. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
}
