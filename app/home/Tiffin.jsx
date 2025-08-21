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
    { label: 'Distance: Near to Far', value: 'distance-asc' },
    { label: 'Distance: Far to Near', value: 'distance-desc' },
  ],
  CATEGORY: [
    { label: 'Vegetarian', value: 'veg' },
    { label: 'Non-Vegetarian', value: 'non-veg' },
  ],
  SPECIAL_FILTERS: [
    { label: 'Open Now', value: 'openNow' },
    { label: 'Top Rated', value: 'topRated' },
    { label: 'Newly Added', value: 'newlyAdded' },
  ],
  CUISINE: [
    { label: "Punjabi", value: "Punjabi" },
    { label: "Swaminarayan", value: "Swaminarayan" },
    { label: "Gujarati", value: "Gujarati" },
    { label: "South Indian", value: "South Indian" },
    { label: "Rajasthani", value: "Rajasthani" },
    { label: "Marathi", value: "Marathi" },
    { label: "Jain", value: "Jain" },
    { label: "Indian", value: "Indian" },
  ],
};

// Quick filters
const QUICK_FILTERS = [
  { name: 'Rating 4.0+', icon: 'star' },
  { name: 'Pure Veg', icon: 'leaf' },
  { name: 'Top Rated', icon: 'thumb-up' },
  { name: 'Open Now', icon: 'clock' },
  { name: 'Near Me', icon: 'map-marker' },
];

export default function Tiffin() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [loadingVegData, setLoadingVegData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [localTiffinData, setLocalTiffinData] = useState([]);
  const [recentlyViewData, setRecentlyViewdData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const [location, setLocation] = useState({
    city: 'Loading...',
    state: '',
    country: '',
    lat: "28.6139", 
    lon: "77.2090",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: null,
    category: null,
    rating: null,
    price: null,
    deliveryCity: null,
    special: null,
    cuisine: null,
  });
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [minRatingFilter, setMinRatingFilter] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [offersFilter, setOffersFilter] = useState(false);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [recommendedTiffins, setRecommendedTiffins] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

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
      console.log('data', JSON.stringify(response.data));
      fetchLikedTiffins();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [tiffinId]: false }));
    }
  }, [isAuthenticated, user?.id]);

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
        }
        else if (Array.isArray(response.data)) {
          favorites = response.data;
        }
        else if (response.data && typeof response.data === 'object') {
          favorites = Object.values(response.data).find(Array.isArray) || [];
        }
        setFavoriteServices(favorites.map(t => t._id || t.id || t));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
  }, [isAuthenticated, user?.id]);

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
        lat: lat || "28.6139",
        lon: lon || "77.2090"
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation({
        city: 'Unknown City',
        state: '',
        country: '',
        lat: "28.6139",
        lon: "77.2090"
      });
    }
  };

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
    }
  }, []);

  const fetchTiffinData = async (filters = {}, loadMore = false) => {
    try {
      if (!loadMore) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseParams = {
        userLat: "28.6139", 
        userLng: "77.2090",
        limit: 20,
        radius: 10,
        cursor: loadMore ? nextCursor : null
      };

      // Apply filters from the filter modal - FIXED DISTANCE SORTING
      if (filters.sortBy) {
        if (filters.sortBy === 'distance-asc') {
          baseParams.sortBy = 'distance';
          baseParams.order = 'asc';
        } else if (filters.sortBy === 'distance-desc') {
          baseParams.sortBy = 'distance';
          baseParams.order = 'desc';
        } else if (filters.sortBy === 'rating-desc') {
          baseParams.sortBy = 'rating';
          baseParams.order = 'desc';
        } else if (filters.sortBy === 'rating-asc') {
          baseParams.sortBy = 'rating';
          baseParams.order = 'asc';
        } else if (filters.sortBy === 'costHighToLow') {
          baseParams.sortBy = 'cost';
          baseParams.order = 'desc';
        } else if (filters.sortBy === 'costLowToHigh') {
          baseParams.sortBy = 'cost';
          baseParams.order = 'asc';
        }
      }
      
      if (filters.rating) baseParams.minRating = filters.rating;
      if (filters.price) baseParams.priceRange = filters.price;
      if (filters.category) baseParams.Dietary = filters.category;
      if (filters.deliveryCity) baseParams.deliveryCity = filters.deliveryCity;
      
      // FIXED: Properly encode cuisine parameter
      if (filters.cuisine) {
        baseParams.cuisine = encodeURIComponent(filters.cuisine);
      }
      
      if (filters.special === 'openNow') baseParams.openNow = true;
      if (filters.special === 'topRated') baseParams.minRating = 4.5;
      if (filters.special === 'newlyAdded') baseParams.newlyAdded = true;

      // Apply quick filters
      if (minRatingFilter) baseParams.minRating = minRatingFilter;
      if (selectedDietary.length > 0) baseParams.Dietary = selectedDietary.join(',');
      if (offersFilter) baseParams.offers = true;
      if (openNowFilter) baseParams.openNow = true;
      if (isVegOnly) baseParams.Dietary = 'vegetarian';

      const response = await axios.get(`${Api_url}/api/tiffin/tiffins/filter`, {
        params: baseParams,
        withCredentials: true
      });

      if (!response.data || (!Array.isArray(response.data.data) && !response.data.data)) {
        throw new Error('Invalid data format from API');
      }

      const data = response.data.data || [];
      const newNextCursor = response.data.nextCursor || null;

      // FIXED: Ensure unique IDs by adding index as fallback
      const transformedData = data.map((tiffin, index) => {
        if (!tiffin) return null;

        // Extract meal types and prices
        const mealTypes = tiffin.menu?.mealTypes || [];
        const prices = {};
        const mealTypeLabels = [];
        
        mealTypes.forEach(mealType => {
          if (mealType?.prices && typeof mealType.prices === 'object') {
            const priceValues = Object.values(mealType.prices);
            if (priceValues.length > 0) {
              prices[mealType.label || 'default'] = priceValues[0];
              mealTypeLabels.push(mealType.label);
            }
          }
        });

        // Create a unique ID by combining the item ID with index
        const uniqueId = tiffin._id || tiffin.id || `item-${index}`;

        return {
          id: uniqueId,
          Title: tiffin.kitchenName || tiffin.tiffin_name || 'Unknown Kitchen',
          Rating: tiffin.ratings || tiffin.rating || 0,
          Images: Array.isArray(tiffin.images) ? tiffin.images : (tiffin.image_url ? [tiffin.image_url] : []),
          Prices: prices,
          "Meal_Types": mealTypeLabels,
          "Delivery_Cities": Array.isArray(tiffin.deliveryCity) ? 
            tiffin.deliveryCity : 
            (typeof tiffin.deliveryCity === 'string' ? 
              tiffin.deliveryCity.split(',').map(c => c.trim()).filter(Boolean) : 
              []),
          category: Array.isArray(tiffin.category) ? tiffin.category : [],
          cuisine: Array.isArray(tiffin.cuisine) ? tiffin.cuisine : [],
          menu: tiffin.menu || {},
          isVeg: tiffin.category?.includes('veg') || false,
          mincost: tiffin.minCost || 0,
          distance: tiffin.distance,
          address: tiffin.address || '',
          newlyAdded: tiffin.newlyAdded || false,
          openNow: tiffin.openNow || false
        };
      }).filter(Boolean);

      if (loadMore) {
        setLocalTiffinData(prev => [...prev, ...transformedData]);
      } else {
        setLocalTiffinData(transformedData);
      }
      
      setNextCursor(newNextCursor);

      // Update delivery cities filter options
      const allCities = transformedData.flatMap(tiffin => tiffin.Delivery_Cities || []);
      const uniqueCities = [...new Set(allCities)].filter(city => city.trim() !== '');
      FILTER_OPTIONS.DELIVERY_CITIES = uniqueCities.map(city => ({
        label: city,
        value: city.toLowerCase().replace(/\s+/g, '-')
      }));

      if (!loadMore) {
        updateRecommendedTiffins(transformedData);
      }
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
      if (!loadMore) {
        setLocalTiffinData([]);
      }
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
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
        ));
    }

    // Filter to only include tiffins with rating >= 4 and distance < 10km
    recommendations = recommendations.filter(tiffin => 
      tiffin.Rating >= 4 && (tiffin.distance || 0) < 10
    );

    // Then sort by distance and rating
    recommendations.sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return b.Rating - a.Rating;
    });

    setRecommendedTiffins(recommendations.slice(0, 5));
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
        setSelectedDietary(newFilters.includes(filterName) ? ['veg'] : []);
      }
      if (filterName === 'Top Rated') {
        setOffersFilter(newFilters.includes(filterName));
      }
      if (filterName === 'Open Now') {
        setOpenNowFilter(newFilters.includes(filterName));
      }
      if (filterName === 'Near Me') {
        setActiveFilters(prev => ({
          ...prev,
          sortBy: newFilters.includes(filterName) ? 'distance-asc' : null
        }));
      }

      return newFilters;
    });
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      setNextCursor(null);
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
      cuisine: null,
    });
    setActiveQuickFilters([]);
    setMinRatingFilter(null);
    setSelectedDietary([]);
    setOffersFilter(false);
    setOpenNowFilter(false);
    setNextCursor(null);
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

  const loadMoreTiffins = async () => {
    if (nextCursor && !loadingMore) {
      await fetchTiffinData(activeFilters, true);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchTiffinData(), fetchLocation(), FetchRecentlyViewData()]);
    };
    fetchInitialData();
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
          params: { 
            query,
            userLat: location.lat,
            userLng: location.lon 
          }
        });

        const results = response.data?.tiffins || [];
        
        // FIXED: Ensure unique IDs for search results
        const formattedResults = results.map((tiffin, index) => {
          if (!tiffin) return null;

          // Create a unique ID by combining the item ID with index
          const uniqueId = tiffin._id || tiffin.id || `search-item-${index}`;

          return {
            id: uniqueId,
            Title: tiffin.kitchenName || tiffin.tiffin_name || 'Unknown Kitchen',
            Rating: tiffin.ratings || tiffin.rating || 0,
            Images: Array.isArray(tiffin.images) ? tiffin.images : (tiffin.image_url ? [tiffin.image_url] : []),
            Prices: {},
            category: tiffin.category || [],
            isVeg: tiffin.category?.includes('veg') || false,
            distance: tiffin.distance || 0,
            address: tiffin.address || 'NA'
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
  }, [query, location.lat, location.lon]);

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

  // FIXED: Improved key extractor to handle duplicate IDs
  const getItemKey = (item, index) => {
    if (!item) return `item-${index}`;
    
    // Use a combination of ID and index to ensure uniqueness
    return `${item.id}-${index}`;
  };

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
            distance: item.distance ? `${item.distance.toFixed(1)} km` : 'N/A',
            cuisine: item.cuisine || [],
            address: item.address,
            isVeg: item.isVeg,
            openNow: item.openNow
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
            distance: item.distance ? `${item.distance.toFixed(1)} km` : 'N/A',
            isVeg: item.isVeg,
            newlyAdded: item.newlyAdded
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
          onFavoriteToggle={() => toggleFavorite(item.id)}
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
          data: recommendedTiffins,
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

        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#e23845" />
          </View>
        )}
      </>
    );
  };

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
        withCredentials: true,
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
         headers: { 'Content-Type': 'application/json' },
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.topContainer}>
          <View style={styles.locationContainer}>
            <LocationHeader />
          </View>
          <View style={{ display: "flex", flexDirection: "row", marginRight: 10 }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/screens/NoficationsPage')}
            >
              <Ionicons name='notifications-circle-sharp' size={38} style={{ color: '#e23845', marginRight: 10 }} />
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
                    style={styles.image}
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
      
      <FilterModal
        isOpen={showFilters}
        setIsOpen={setShowFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        filterOptions={FILTER_OPTIONS}
      />
      
      <FlatList
        data={[1]}
        renderItem={() => renderMainContent()}
        keyExtractor={() => 'main-content'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreTiffins}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}