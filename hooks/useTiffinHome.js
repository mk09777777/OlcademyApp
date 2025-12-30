import { useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import { Alert } from 'react-native';
// import { tiffinService } from '../services/tiffinService';
// // import { useLocation } from '../utils/useLocation';
// import { calculateDistance } from '../utils/helpers';
// import { usePreferences } from '../context/PreferencesContext';
// import { useFavorites } from '../context/FavoritesContext';
import { API_BASE_URL, API_ERRORS } from '../config/api';

const API_BASE = String(API_BASE_URL ?? '').replace(/\/+$/, '');

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
  const scrollY = new Animated.Value(0);
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
      // Load tiffins from API
      const response = await fetch(`${API_BASE}/api/firms`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tiffins');
      }
      const tiffins = await response.json();

      // Load user preferences
      const preferencesResponse = await fetch(`${API_BASE}/api/user/preferences`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (preferencesResponse.ok) {
        const preferences = await preferencesResponse.json();
        setLocalDietaryPreferencesOptions(preferences.dietaryPreferences || []);
        setLocalCuisines(preferences.favoriteCuisines || []);
        setPriceRange(preferences.priceRange || [0, 1000]);
      }

      // Load favorites
      const favoritesResponse = await fetch(`${API_BASE}/api/user/favorites`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (favoritesResponse.ok) {
        const favorites = await favoritesResponse.json();
        setFavoriteServices(favorites);
      }

      // Categorize tiffins
      const categorizedTiffins = {
        featured: tiffins.slice(0, 5),
        popular: tiffins.slice(5, 10),
        nearby: tiffins.slice(10, 15),
        recommended: tiffins.slice(15, 20),
        all: tiffins
      };

      setFilteredServices(categorizedTiffins);
    } catch (err) {
      setError('Failed to fetch tiffin services. Please try again.');
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
        const results = await fetch(`${API_BASE}/api/tiffins?search=${encodeURIComponent(query)}`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        if (!results.ok) {
          throw new Error('Failed to fetch search results');
        }
        const searchResults = await results.json();
        setSearchResults(searchResults);
        setShowSearchResults(true);
        if (!recentSearches.includes(query)) {
          setRecentSearches(prev => [query, ...prev].slice(0, 5));
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setError(error.message || API_ERRORS.UNKNOWN);
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
      const response = await fetch(`${API_BASE}/api/user/favorites/${encodeURIComponent(String(id))}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }
      const newFavorites = await response.json();
      if (newFavorites) {
        setFavoriteServices(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError(error.message || API_ERRORS.UNKNOWN);
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
      const response = await fetch(`${API_BASE}/api/user/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences)
      });
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError(error.message || API_ERRORS.UNKNOWN);
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