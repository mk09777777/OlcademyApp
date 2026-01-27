import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { Alert } from 'react-native';
import { api, normalizeApiError } from '../config/httpClient';
// import { tiffinService } from '../services/tiffinService';
// // import { useLocation } from '../utils/useLocation';
// import { calculateDistance } from '../utils/helpers';
// import { usePreferences } from '../context/PreferencesContext';
// import { useFavorites } from '../context/FavoritesContext';
import { API_ERRORS } from '../config/api';

const useTiffinHome = () => {
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showQuickFilters, setShowQuickFilters] = useState(true);
  const [localDietaryPreferencesOptions, setLocalDietaryPreferencesOptions] = useState([]);
  const [localCuisines, setLocalCuisines] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState(null);

  // Data States
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [activePromos, setActivePromos] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredServices, setFilteredServices] = useState({
    featured: [],
    popular: [],
    nearby: [],
    recommended: [],
    all: []
  });

  // Animation States
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp',
  });
  const locationOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Location
  // const { currentLocation, locationError } = useLocation();

  // Load Initial Data
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Parallelize requests using Promise.allSettled
      const [firmsResult, preferencesResult, favoritesResult] = await Promise.allSettled([
        api.get('/api/firms'),
        api.get('/api/user/preferences'),
        api.get('/api/user/favorites'),
      ]);

      // Handle Firms (Critical)
      if (firmsResult.status === 'fulfilled') {
        const tiffins = firmsResult.value.data;
        const categorizedTiffins = {
          featured: tiffins.slice(0, 5),
          popular: tiffins.slice(5, 10),
          nearby: tiffins.slice(10, 15),
          recommended: tiffins.slice(15, 20),
          all: tiffins
        };
        setFilteredServices(categorizedTiffins);
      } else {
        throw firmsResult.reason; // Re-throw critical error
      }

      // Handle Preferences (Non-critical)
      if (preferencesResult.status === 'fulfilled') {
        const preferences = preferencesResult.value.data;
        setLocalDietaryPreferencesOptions(preferences.dietaryPreferences || []);
        setLocalCuisines(preferences.favoriteCuisines || []);
        setPriceRange(preferences.priceRange || [0, 1000]);
      } else {
        console.warn('Failed to load preferences:', preferencesResult.reason);
      }

      // Handle Favorites (Non-critical)
      if (favoritesResult.status === 'fulfilled') {
        setFavoriteServices(favoritesResult.value.data);
      } else {
        console.warn('Failed to load favorites:', favoritesResult.reason);
      }

    } catch (err) {
      const normalizedError = normalizeApiError(err);
      setError(normalizedError.message || 'Failed to fetch tiffin services.');
      Alert.alert(
        'Error',
        'Failed to fetch tiffin services. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryFetch = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  const handleRefresh = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handlers
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const { data } = await api.get(`/api/tiffins`, { params: { search: query } });
        setSearchResults(data);
        setShowSearchResults(true);
        if (!recentSearches.includes(query)) {
          setRecentSearches(prev => [query, ...prev].slice(0, 5));
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        const normalized = normalizeApiError(error);
        setError(normalized.message || API_ERRORS.UNKNOWN);
      }
    } else {
      setShowSearchResults(false);
    }
  }, [recentSearches]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const toggleFilter = useCallback((filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    try {
      const { data: newFavorites } = await api.post(`/api/user/favorites/${encodeURIComponent(String(id))}`);
      if (newFavorites) {
        setFavoriteServices(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const normalized = normalizeApiError(error);
      setError(normalized.message || API_ERRORS.UNKNOWN);
    }
  }, []);

  const toggleDietaryPreference = useCallback((preference) => {
    setLocalDietaryPreferencesOptions(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  }, []);

  const toggleCuisine = useCallback((cuisine) => {
    setLocalCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  }, []);

  const handlePromoBannerClick = useCallback((banner) => {
    // Handle promotional banner click
    console.log('Banner clicked:', banner);
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const saveUserPreferences = useCallback(async (preferences) => {
    try {
      await api.post('/api/user/preferences', preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      const normalized = normalizeApiError(error);
      setError(normalized.message || API_ERRORS.UNKNOWN);
    }
  }, []);

  return {
    // Search and Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFilters,
    refreshing,
    showFilterModal,
    setShowFilterModal,
    priceRange,
    setPriceRange,
    favoriteServices,
    isLoading,
    activePromos,
    showSearchResults,
    setShowSearchResults,
    searchResults,
    showQuickFilters,
    // currentLocation,
    recentSearches,
    filteredServices,
    localDietaryPreferencesOptions,
    setLocalDietaryPreferencesOptions,
    localCuisines,
    setLocalCuisines,
    scrollY,
    headerHeight,
    locationOpacity,
    error,
    // Functions
    handleSearch,
    onRefresh,
    toggleFilter,
    toggleFavorite,
    toggleDietaryPreference,
    toggleCuisine,
    handlePromoBannerClick,
    clearRecentSearches,
    saveUserPreferences,
    handleRefresh,
    retryFetch
  };
};
export default useTiffinHome; 