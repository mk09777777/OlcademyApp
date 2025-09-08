import { View, Text, FlatList, Image, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, ScrollView, RefreshControl, Switch } from 'react-native'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useRouter, } from 'expo-router'
import axios from 'axios'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import SearchBar from '@/components/SearchBar'
import FirmCard from '@/components/FirmCard'
import MiniRecommendedCard from '@/components/MiniRecommendedCard';
import RadioButtonRN from 'radio-buttons-react-native'
// import { useBookmarkManager } from '../../hooks/BookMarkmanger';

import Filterbox from '@/components/Filterbox';
import LocationHeader from '@/components/HomeHeader';
import { API_CONFIG } from '../../config/apiConfig';
const Api_url = API_CONFIG.BACKEND_URL;
export default function TakeAway() {
  // const { bookmarks, toggleBookmark, isBookmarked } = useBookmarkManager();
  const [firms, setFirms] = useState([])
  const [isSortVisible, setSortVisible] = useState(false);
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [selectedDietary, setSelectedDietary] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [minRatingFilter, setMinRatingFilter] = useState(null)
   const [maxRatingFilter, setMaxRatingFilter] = useState(null)
  const [priceRangeFilter, setPriceRangeFilter] = useState([])
  const [openNowFilter, setOpenNowFilter] = useState(false)
  const [offersFilter, setOffersFilter] = useState(false)
  const [alcoholFilter, setAlcoholFilter] = useState(null)
  const [searchResults, setSearchResults] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const showcaseRef = useRef(null);
  const [profileData, setProfileData] = useState("");
  const [randomData, setRandomData] = useState([])
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [recentlyViewData, setRecentlyViewdData] = useState([])
  const [popularData, setPopularData] = useState([])
  const [vegData, setVegData] = useState([])
  const [loadingVegData, setLoadingVegData] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchCache, setSearchCache] = useState({});
  const [searchStatus, setSearchStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState({
    latitude: "43.6534627",
    longitude: "-79.4276471",
  })
  const [location, setLocation] = useState({
    city: 'KIIT University',
    state: 'Patia, Bhubaneshwar',
    country: '',
    lat: '',
    lon: ''
  });
  const sortOptions = useMemo(() => ([
    { id: 1, label: 'Price Low to High', value: 'default' },
     { id: 2, label: 'Rating', value: 'HighToLow' },
    { id: 3, label: 'Price Low to High', value: 'lowToHigh' },
     { id: 4, label: 'Price High to Low', value: 'highToLow' },
   
    { id: 5, label: 'Distance', value: 'deliveryTime' }
  ]), []);
  const quickFilters = [
    { name: 'Filters', icon: 'filter-list' },
    { name: 'Rating 4.0+', icon: 'star' },
    { name: 'Pure Veg', icon: 'leaf' },
    { name: 'Offers', icon: 'local-offer' },
    { name: 'Open Now', icon: 'access-time' }
  ];

  const whatsOnYourMind = [
    { id: 1, title: 'Noodles', image: require('@/assets/images/noodles.png') },
    { id: 2, title: 'Paneer', image: require('@/assets/images/paneer.png') },
    { id: 3, title: 'Pizza', image: require('@/assets/images/pizza.png') },
    { id: 4, title: 'Sandwich', image: require('@/assets/images/sandwitch.png') },
    { id: 5, title: 'Shawarma', image: require('@/assets/images/shawarma.png') },
    { id: 6, title: 'Biryani', image: require('@/assets/images/biryani.png') },
    { id: 7, title: 'Burger', image: require('@/assets/images/burger.png') },
    { id: 8, title: 'Chicken', image: require('@/assets/images/chicken.png') },
    { id: 9, title: 'Fries', image: require('@/assets/images/fries.png') },
    { id: 10, title: 'Home Style', image: require('@/assets/images/homestyle.png') },
  ];

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [randomItems, setRandomItems] = useState([]);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [filterboxFilters, setFilterboxFilters] = useState({
    sortBy: '',
    cuisines: '',
    minRating: '',
    maxRating: '',
    priceRange: '',
    feature: '',
    others: '',
    Alcohol: false,
    openNow: false,
    offers: false,
  });

const sortMapping = {
  popularity: "default",
  ratingHighToLow: "HighToLow",
  costLowToHigh: "lowToHigh",
  costHighToLow: "highToLow",
  deliveryTime: "deliveryTime",
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

  const getRandomItems = (arr, n) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, shuffled.length));
  };

  const fetchRestaurants = async (params = {}, isLoadMore = false) => {
    if (!location.lat || !location.lon || (isLoadMore && !hasMore)) return [];

    setLoading(true);
    setShowProgress(true);
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 10));
    }, 100);

    try {
      const baseParams = {
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        radius: 5,
        limit: 20,
        cursor: isLoadMore ? cursor : null,
        features: 'Takeaway'
      };

      if (selectedCuisines.length > 0) {
        baseParams.cuisines = selectedCuisines.join(',');
      }
      if (isVegOnly) {
        baseParams.Dietary = 'vegetarian';
      } else if (selectedDietary.length > 0) {
        baseParams.Dietary = selectedDietary.join(',');
      }
      if (selectedFeatures.length > 0) {
        baseParams.features = selectedFeatures.join(',');
      }
      if (minRatingFilter) {
        baseParams.minRating = minRatingFilter;
      }
      if (maxRatingFilter) {
        baseParams.maxRating = maxRatingFilter;
      }
      if (priceRangeFilter.length > 0) {
        baseParams.priceRange = priceRangeFilter.join(',');
      }
      if (openNowFilter) {
        baseParams.openNow = true;
      }
      if (offersFilter) {
        baseParams.offers = true;
      }
      if (alcoholFilter !== null) {
        baseParams.Alcohol = alcoholFilter;
      }
      if (selectedSortOption) {
        baseParams.sortBy = selectedSortOption.value;
      }

      const finalParams = { ...baseParams, ...params };
      const response = await axios.get(`${Api_url}/firm/getnearbyrest?feature=Takeaway`, { 
        params: finalParams,
        withCredentials: true 
      });

      if (response.data.success) {
        const newData = response.data.data || [];
        setRandomData(newData);
        
        const restaurantsWithDistance = newData.map(restaurant => {
          return { ...restaurant };
        });

        if (isLoadMore) {
          setIsLoadingMore(false);
          setFirms(prev => [...prev, ...restaurantsWithDistance]);
        } else {
          setFirms(restaurantsWithDistance);
        }

        setCursor(response.data.nextCursor);
        setHasMore(response.data.nextCursor !== null && newData.length === 20);
        setNotFound(false);
        return restaurantsWithDistance;
      } else {
        console.error('API error:', response.data.message);
        if (!isLoadMore) {
          setNotFound(true);
          removeNotFound();
        }
        return [];
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
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
      await fetchRestaurants({}, false, false);
    }, 1500);
  };

  const fetchInitialData = async () => {
    setIsInitialLoading(true);
    try {
      const locationResponse = await axios.get(`${Api_url}/api/location`);
      const { city, state, country, lat, lon } = locationResponse.data;
      setLocation({
        city: city || 'KIIT University',
        state: state ? `${city}, ${state}` : 'Patia, Bhubaneshwar',
        country,
        lat,
        lon
      });

      const firmsData = await fetchRestaurants();
      if (firmsData && firmsData.length > 0) {
        const selectedItems = getRandomItems(firmsData, Math.min(25, firmsData.length));
        setRandomItems(selectedItems);
      } else {
        setRandomItems([]);
      }
      await FetchRecentlyViewData();
      await sortPopularData();
    } catch (error) {
      console.error('Error in initial data fetch:', error);
      setError('Failed to detect location.');
      setLocation({
        city: 'KIIT University',
        state: 'Patia, Bhubaneshwar',
        country: '',
        lat: '',
        lon: ''
      });
      await fetchRestaurants();
      setRandomItems([]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCursor(null);
    setHasMore(true);
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const FetchRecentlyViewData = useCallback(async () => {
    try {
      const response = await axios.get(`${Api_url}/firm/getrecently-viewed`, {
        withCredentials: true
      });
      setRecentlyViewdData(response.data.recentlyViewed || []);
    } catch (error) {
      // console.error('Error fetching recently viewed data:', error);
    }
  }, []);

  const sortPopularData = useCallback(() => {
    const sorted = randomData.filter(
      (item) => item.restaurantInfo?.ratings?.overall >= 4
    );
    setPopularData(sorted);
  }, [randomData]);

  const handleSearch = useCallback((text) => {
    setQuery(text);
  }, []);

  useEffect(() => {
    const searchRestaurants = async () => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`${Api_url}/search`, {
          params: { query },
          withCredentials: true
        });
        
        // Handle both direct search results and recommended restaurants
        let results = [];
        
        if (response.data?.restaurants) {
          results = response.data.restaurants.map(restaurant => ({
            _id: restaurant.id,
            restaurantInfo: {
              name: restaurant.restaurant_name,
              address: restaurant.address,
              ratings: { overall: restaurant.rating || 0 },
              cuisines: restaurant.cuisines || '',
              priceRange: restaurant.price_range || '',
              image_urls: restaurant.image_url,
              location: restaurant.location || null
            },
            image_urls: restaurant.image_url
          }));
        }
        
        if (response.data?.recommendedRestaurants) {
          const recommended = response.data.recommendedRestaurants.map(restaurant => ({
            _id: restaurant.id,
            restaurantInfo: {
              name: restaurant.restaurant_name,
              address: restaurant.address,
              ratings: { overall: restaurant.rating || 0 },
              cuisines: restaurant.additionalDetails || '',
              priceRange: restaurant.price || '',
              image_urls: restaurant.image_url,
              location: {
                coordinates: restaurant.location?.coordinates || [0, 0]
              }
            },
            image_urls: restaurant.image_url,
            distance: restaurant.distance || 0
          }));
          
          results = [...results, ...recommended];
        }

        // Remove duplicates
        const uniqueResults = results.filter((v, i, a) => 
          a.findIndex(t => (t._id === v._id)) === i
        );

        setSearchResults(uniqueResults);
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

useEffect(() => {
  const applyFilters = async () => {
    const firmsData = await fetchRestaurants();
    setFirms(firmsData);
  };
  const debounceTimer = setTimeout(applyFilters, 300);
  return () => clearTimeout(debounceTimer);
}, [
  selectedSortOption,
  selectedCuisines,
  selectedDietary,
  selectedFeatures,
  minRatingFilter,
  maxRatingFilter,
  priceRangeFilter,
  openNowFilter,
  offersFilter,
  alcoholFilter,
  isVegOnly
]);

  const handleQuickFilterPress = (filterName) => {
    if (filterName === 'Filters') {
      setFiltersVisible(true);
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
      if (filterName === 'Offers') {
        setOffersFilter(newFilters.includes(filterName));
      }
      if (filterName === 'Open Now') {
        setOpenNowFilter(newFilters.includes(filterName));
      }

      return newFilters;
    });
  };

  const handleFilterboxChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilterboxFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleApplyFilterboxFilters = (filters) => {
  // Find the matching sort option
  const selectedOption = sortOptions.find(opt => 
    opt.value === filters.sortBy || 
    opt.label.toLowerCase().includes(filters.sortBy?.toLowerCase())
  );
  
  setSelectedSortOption(selectedOption || null);
  setSelectedCuisines(filters.cuisines ? filters.cuisines.split(',') : []);
  setMinRatingFilter(filters.minRating || null);
  setMaxRatingFilter(filters.maxRating || null);
  setPriceRangeFilter(filters.priceRange ? [filters.priceRange] : []);
  setOpenNowFilter(filters.openNow || false);
  setOffersFilter(filters.offers || false);
  setAlcoholFilter(filters.Alcohol || null);
  setSelectedFeatures(filters.feature ? filters.feature.split(',') : []);
  setIsVegOnly(filters.Dietary?.includes('vegetarian') || false);
  setFiltersVisible(false);
};

 const filteredFirms = useMemo(() => {
    if (query.trim() !== '') {
      return searchResults;
    }
    return firms;
  }, [firms, query, searchResults]);

  const applySort = (option) => {
    setSelectedSortOption(option);
    setSortVisible(false);
  };

  // const handleBookmarkPress = (firmId) => {
  //   if (firmId) {
  //     toggleBookmark(firmId, 'restaurants');
  //   }
  // };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isSearching && query.trim() === '') {
      setIsLoadingMore(true);
      fetchRestaurants({}, true);
      FetchRecentlyViewData();
      sortPopularData();

    }
  };

  const getItemKey = (item, index) => {
    return item?.id ? `${item.id}` : `item-${index}`;
  };
  useEffect(() => {
    FetchRecentlyViewData()
    sortPopularData()
  }, [FetchRecentlyViewData, sortPopularData])

  const sortVegData = useCallback(async () => {
    if (isVegOnly) {
      setLoadingVegData(true);
      const MIN_LOADING_TIME = 1000; // 3 seconds
      const startTime = Date.now();

      try {
        const response = await axios.get(`${Api_url}/firm/getnearbyrest?cuisines=Vegetarian`, {
          withCredentials: true
        });

        setVegData(response.data.data);

        // Calculate elapsed time
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_TIME - elapsed;

        if (remaining > 0) {
          // Wait remaining time before hiding loading
          setTimeout(() => {
            setLoadingVegData(false);
          }, remaining);
        } else {
          setLoadingVegData(false);
        }
      } catch (error) {
        console.error('Error fetching vegetarian data:', error);

        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_TIME - elapsed;

        if (remaining > 0) {
          setTimeout(() => {
            setLoadingVegData(false);
          }, remaining);
        } else {
          setLoadingVegData(false);
        }
      }
    }
    else {
      setLoadingVegData(false);
      setVegData([])
    }


  }, [isVegOnly]);

  const HandleUploadVegMode = async () => {
    try {
      await fetch(`${Api_url}/api/updateVegMode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vegMode: isVegOnly }),
      });

      // if (response.ok) {
      //   ToastAndroid.show('Veg Mode updated', ToastAndroid.SHORT);
      // }
    } catch (error) {
      console.error("Error updating vegMode", error);
    }
  };
  const handleGetVegMode = async () => {
    try {
      const response=await axios.get(`${Api_url}/api/getVegMode`, {
        withCredentials: true
      });

      setIsVegOnly(response.data.vegMode); // response is { vegMode: true/false }
    } catch (error) {
      console.error("Error fetching vegMode", error);
    }
  };

  useEffect(() => {
    sortVegData();
  }, [isVegOnly]);

  useEffect(() => {
    handleGetVegMode(); // Fetch veg mode once on mount
  }, []);

  useEffect(() => {
    HandleUploadVegMode(); // Upload veg mode when it changes
  }, [isVegOnly]);


  const handleKeepUsing = () => {
    setIsModalVisible(false);
    setIsVegOnly(true);
    setSelectedDietary(['vegetarian']);
  };



  return (
    <View className="flex-1 bg-white p-4">
      {isInitialLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#e23845" />
        </View>
      ) : (
        <>
          <View className="flex-row justify-between">
         <LocationHeader />
            <View className="flex-row mr-2.5">
              <TouchableOpacity
                onPress={() => router.push('/screens/NoficationsPage')}
              >
                <Ionicons name='notifications-circle-sharp' size={38} color='#e23845' style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/screens/User')}
              >
                <Ionicons name='person-circle' size={40} color='#e23845' />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
              <SearchBar
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
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
            <Modal
              visible={loadingVegData}
              onRequestClose={() => setLoadingVegData(false)}
            >
              <View className="bg-white items-center justify-center flex-1">
                <Image
                  source={require("../../assets/images/natural.png")}
                  className="w-24 h-24"
                />
                <Text className="text-base text-textprimary font-semibold mt-4">Explore veg dishes from all restaurants</Text>
              </View>
            </Modal>
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
                      className="h-18 w-18"
                      source={require('../../assets/images/error1.png')}
                    />
                  </View>
                  <Text className="text-textprimary font-bold text-xl mt-1">Switch off Veg Mode?</Text>
                  <Text className="text-textprimary font-normal text-base mt-2.5">You'll see all restaurants, including those</Text>
                  <Text className="text-textprimary">serving non-veg dishes</Text>
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginTop: 5, fontFamily: 'outfit-bold' }}>Switch off Veg Mode?</Text>
                  <Text style={{ color: "black", fontWeight: "400", marginTop1: 10, fontSize: 15,fontFamily: 'outfit-medium', marginTop: 10 }}>You'll see all restaurants, including those</Text>
                  <Text >serving non-veg dishes</Text>

                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Text className="text-red-500 text-base font-medium mt-5">Switch off</Text>
                    <Text style={{ color: "red", fontSize: 15, fontWeight: "500", marginTop: 20, fontFamily: 'outfit-bold' }}>Switch off</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleKeepUsing()} className="p-2.5 mx-2.5 bg-white rounded-lg mt-2.5 justify-center items-center">
                    <Text className="text-textprimary text-base font-medium">keep using it</Text>
                  <TouchableOpacity onPress={() => handleKeepUsing()} style={styles.KeepUsingButton}>
                    <Text style={{ color: "black", fontSize: 15, fontWeight: "500", fontFamily: 'outfit-medium' }}>keep using it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          {showProgress && (
            <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
            </View>
          )}

          {notFound && (
            <View className="p-4 items-center">
              <Text className="text-textsecondary text-base">No restaurants found with these filters</Text>
            </View>
          )}

          <FlatList
            data={filteredFirms}
            ref={showcaseRef}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#e23845']}
                tintColor={'#e23845'}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {/* <Text style={styles.emptyText}>
              {isInitialLoading
                ? 'Loading restaurants...'
                : isSearching
                  ? 'Searching...'
                  : firms.length === 0
                    ? 'No restaurants found in your area'
                    : 'No restaurants match your filters'}
            </Text> */}
              </View>
            }
            ListHeaderComponent={
              query.trim() === '' ? (
                <View>
                  <View className="flex-row items-center mt-2.5 mb-2.5">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">
                      WHAT'S ON YOUR MIND
                    </Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                  {whatsOnYourMind?.length > 0 && (
                    <ScrollView
                      horizontal
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    >
                      <FlatList
                        data={whatsOnYourMind}
                        renderItem={({ item }) => (
                          <TouchableOpacity className="items-center p-2 m-1" onPress={() => router.push({
                            pathname: '/screens/OnMindScreens',
                            params: { name: item?.title }
                          })}>
                            <Image source={item?.image} className="w-16 h-16 rounded-full" />
                            <Text className="text-xs font-outfit text-textprimary mt-1 text-center">{item?.title}</Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item?.id?.toString()}
                        numColumns={Math.ceil(whatsOnYourMind?.length / 2)}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        ItemSeparatorComponent={() => <View className="w-2" />}
                      />
                    </ScrollView>
                  )}
                  <View className="flex mb-4">
                    <View className="flex-row items-center mt-2.5 mb-2.5">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">
                  <View style={{ display: "flex", marginBottom: 0 }}>
                    <View style={styles.separatorRow}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>
                      RECENTLY VIEWED
                    </Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>

                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={recentlyViewData}
                      horizontal
                      keyExtractor={(item, index) => item._id + '-' + index}
                      renderItem={({ item, index }) => (
                        <MiniRecommendedCard
                          key={item._id}
                          name={item.restaurantInfo?.name}
                          address={item.restaurantInfo?.address}
                          image={item.restaurantInfo?.image_urls}
                          rating={item.restaurantInfo?.ratings?.overall}
                          onPress={() => {
                            router.push({
                              pathname: '/screens/FirmDetailsTakeAway',
                              params: { firmId: item._id }
                            });
                          }}
                          onFavoriteToggle={() => {
                            setFavoriteServices(prevState =>
                              prevState.includes(item._id)
                                ? prevState.filter(id => id !== item._id)
                                : [...prevState, item._id]
                            );
                          }}
                          isFavorite={favoriteServices.includes(item._id)}
                        />
                      )}
                    />


                  </View>


                  <View className="flex mt-1 mb-5">
                   <View className="flex-row items-center mt-2.5 mb-2.5">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">
                  <View style={{ display: "flex", marginTop: 0, marginBottom: 0 }}>
                   <View style={styles.separatorRow}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>
                      POPULAR 
                    </Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={popularData}
                      horizontal
                      renderItem={({ item, index }) => (
                        <View>
                          <MiniRecommendedCard
                            key={getItemKey(item, index)}
                            tiffinId={item._id}
                            name={item.restaurantInfo.name}
                            address={item.restaurantInfo.address}
                            image={item.image_urls}
                            rating={item.restaurantInfo.ratings.overall}
                            onPress={() => {
                              if (!item._id) {
                                console.error('No ID found for item:', item);
                                return;
                              }
                              router.push({
                                pathname: '/screens/FirmDetailsTakeAway',
                                params: {
                                  firmId: item._id
                                }
                              });
                            }}
                            onFavoriteToggle={() => {
                              if (!item._id) return;
                              setFavoriteServices(prevState =>
                                prevState.includes(item._id)
                                  ? prevState.filter(id => id !== item._id)
                                  : [...prevState, item._id]
                              );
                            }}
                            isFavorite={item._id ? favoriteServices.includes(item._id) : false}
                          />
                        </View>
                      )}
                      keyExtractor={(item, index) => item._id ? `${item._id}` : `rec-item-${index}`}
                    />
                  </View>
                  <View className="flex-row items-center mt-2.5 mb-2.5">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">
                      ALL RESTAURANTS
                    </Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                  <View className="mb-2.5">
                    <FlatList
                      data={quickFilters}
                      horizontal
                      showsHorizontalScrollIndicator={false}
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
                            {item.name === 'Pure Veg' ? (
                              <MaterialCommunityIcons
                                name={item.icon}
                                size={16}
                                color={isSelected ? "white" : "#e23845"}
                                style={{ marginRight: 4 }}
                              />
                            ) : (
                              <MaterialIcons
                                name={item.icon}
                                size={16}
                                color={isSelected ? "white" : "#e23845"}
                                style={{ marginRight: 4 }}
                              />
                            )}
                            <Text className={`text-sm font-outfit-medium ${
                              isSelected ? 'text-white' : 'text-textprimary'
                            }`}>
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
              if (!item || !item.restaurantInfo) {
                console.warn('Invalid restaurant item:', item);
                return null;
              }

              return (
                <FirmCard
                  firmId={item._id}
                  restaurantInfo={{
                    ...item.restaurantInfo,
                    // isBookMarked: isBookmarked(item._id, 'restaurants')
                  }}
                  firmName={item.restaurantInfo.name}
                  area={item.restaurantInfo.address}
                  rating={item.restaurantInfo.ratings?.overall}
                  cuisines={item.restaurantInfo.cuisines}
                  price={item.restaurantInfo.priceRange}
                  image={item.restaurantInfo.image_urls || item.image_urls}
                  promoted={item.promoted || false}
                  time={item.time || "N/A"}
                  offB={item.offB || false}
                  proExtraB={item.proExtraB || false}
                  off={item.off || "No offer"}
                  proExtra={item.proExtra || "N/A"}
                  onPress={() => router.push({
                    pathname: "screens/FirmDetailsTakeAway",
                    params: { firmId: item._id }
                  })}
                  distance={item.distance}
                  offer={item.offer}
                  addtoFavorite={addtoFavorite}
                  handleFavoriteClick={handleFavoriteClick}
                // isBookmarked={isBookmarked(item._id, 'restaurants')}
                />
              );
            }}
            keyExtractor={(item) => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#e23845" />
                </View>
              ) : null
            }
          />
          <Modal
            transparent={true}
            visible={isSortVisible}
            animationType="slide"
            onRequestClose={() => setSortVisible(false)}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-white rounded-t-4xl p-6">
                <Text className="text-xl font-outfit-bold text-textprimary mb-4">Sort Options</Text>
                <RadioButtonRN
                  data={sortOptions}
                  selectedBtn={applySort}
                  initial={selectedSortOption ? sortOptions.findIndex(opt => opt.value === selectedSortOption.value) + 1 : null}
                  box={false}
                  textStyle={{ fontSize: 16, color: '#333' }}
                  circleSize={16}
                  activeColor='#e23845'
                />
                <TouchableOpacity
                  className="bg-primary p-4 rounded-2.5 items-center mt-4"
                  onPress={() => setSortVisible(false)}
                >
                  <Text className="text-white font-outfit-bold text-base">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Filterbox
            isOpen={isFiltersVisible}
            setIsOpen={setFiltersVisible}
            handleChange={handleFilterboxChange}
            filters={filterboxFilters}
            onApplyFilters={handleApplyFilterboxFilters}
            sortMapping={sortMapping}
          />
        </>
      )}
    </View>
  )
}