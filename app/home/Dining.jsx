// import { View, Text, FlatList, Image, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, ScrollView, RefreshControl, Switch } from 'react-native'
// import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
// import { useRouter, } from 'expo-router'
// import axios from 'axios'
// import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
// import SearchBar from '@/components/SearchBar'
// import MiniRecommendedCard from '@/components/MiniRecommendedCard';
// import RadioButtonRN from 'radio-buttons-react-native'
// // import { useBookmarkManager } from '../../hooks/BookMarkmanger';

// import Filterbox from '@/components/Filterbox';
// import LocationHeader from '@/components/HomeHeader';
// import DiningCard from '@/components/DaningCard';
// import { API_CONFIG } from '../../config/apiConfig';
// const Api_url = API_CONFIG.BACKEND_URL;
// export default function TakeAway() {
//   // const { bookmarks, toggleBookmark, isBookmarked } = useBookmarkManager();
//   const [firms, setFirms] = useState([])
//   const [isSortVisible, setSortVisible] = useState(false);
//   const [isFiltersVisible, setFiltersVisible] = useState(false);
//   const [selectedSortOption, setSelectedSortOption] = useState(null);
//   const [selectedCuisines, setSelectedCuisines] = useState([])
//   const [selectedDietary, setSelectedDietary] = useState([])
//   const [selectedFeatures, setSelectedFeatures] = useState([])
//   const [minRatingFilter, setMinRatingFilter] = useState(null)
//   const [maxRatingFilter, setMaxRatingFilter] = useState(null)
//   const [priceRangeFilter, setPriceRangeFilter] = useState([])
//   const [openNowFilter, setOpenNowFilter] = useState(false)
//   const [offersFilter, setOffersFilter] = useState(false)
//   const [alcoholFilter, setAlcoholFilter] = useState(null)
//   const [searchResults, setSearchResults] = useState([]);
//   const [cursor, setCursor] = useState(null);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [showProgress, setShowProgress] = useState(false);
//   const [notFound, setNotFound] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const showcaseRef = useRef(null);
//   const [profileData, setProfileData] = useState("");
//   const [randomData, setRandomData] = useState([])
//   const [favoriteServices, setFavoriteServices] = useState([]);
//   const [recentlyViewData, setRecentlyViewdData] = useState([])
//   const [popularData, setPopularData] = useState([])
//   const [vegData, setVegData] = useState([])
//   const [loadingVegData, setLoadingVegData] = useState(false)
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [isVegOnly, setIsVegOnly] = useState(false);
//   const [collections, setCollections] = useState([]);
//   const [userLocation, setUserLocation] = useState({
//     latitude: "43.6534627",
//     longitude: "-79.4276471",
//   })
//   const [location, setLocation] = useState({
//     city: 'KIIT University',
//     state: 'Patia, Bhubaneshwar',
//     country: '',
//     lat: '',
//     lon: ''
//   });
//   const campaigns = [
//     { id: 1, title: '50% OFF on all Orders above 499' },
//     { id: 2, title: 'Buy 1 Get 1 Free' },
//     { id: 3, title: 'Free Delivery on First Order' }
//   ];
//   const sortOptions = useMemo(() => ([
//     { id: 1, label: 'Price Low to High', value: 'default' },
//     { id: 2, label: 'Rating', value: 'HighToLow' },
//     { id: 3, label: 'Price Low to High', value: 'lowToHigh' },
//     { id: 4, label: 'Price High to Low', value: 'highToLow' },

//     { id: 5, label: 'Distance', value: 'deliveryTime' }
//   ]), []);
//   const quickFilters = [
//     { name: 'Filters', icon: 'filter-list' },
//     { name: 'Rating 4.0+', icon: 'star' },
//     { name: 'Pure Veg', icon: 'leaf' },
//     { name: 'Offers', icon: 'local-offer' },
//     { name: 'Open Now', icon: 'access-time' }
//   ];

//   const router = useRouter();
//   const [query, setQuery] = useState('');
//   const [randomItems, setRandomItems] = useState([]);
//   const [activeQuickFilters, setActiveQuickFilters] = useState([]);
//   const [filterboxFilters, setFilterboxFilters] = useState({
//     sortBy: '',
//     cuisines: '',
//     minRating: '',
//     maxRating: '',
//     priceRange: '',
//     feature: '',
//     others: '',
//     Alcohol: false,
//     openNow: false,
//     offers: false,
//   });

//   const sortMapping = {
//     popularity: "default",
//     ratingHighToLow: "HighToLow",
//     costLowToHigh: "lowToHigh",
//     costHighToLow: "highToLow",
//     deliveryTime: "deliveryTime",
//   };
//   const handleFav = async (firmId) => {
//     const saved = await AsyncStorage.getItem("userProfileData");
//     if (saved) {
//       setProfileData(JSON.parse(saved));
//     }
//     console.log(saved);
//     const url = `${Api_url}/firm/fav/${firmId}`;
//     console.log("Fetching URL:", url);

//     const response = await axios.post(url, { withCredentials: true });
//     alert("updated successfull");
//     console.log("Response:", response.data);
//   };

//   const checkIfFavorite = async (firmId) => {
//     try {
//       const url = `${Api_url}/firm/favCheck/${firmId}`;
//       const response = await axios.get(url, { withCredentials: true });
//       console.log("Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error checking favorite status:", error.response?.data || error.message);
//     }
//   };

//   const removeFavorite = async (firmId) => {
//     try {
//       const url = `${Api_url}/firm/favRemove/${firmId}`;
//       const response = await axios.post(url, { withCredentials: true });
//       console.log("Response:", response.data);
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error removing favorite:", error.response?.data || error.message);
//     }
//   };

//   const handleFavoriteClick = async (firmId) => {
//     try {
//       const { isFavorite } = await checkIfFavorite(firmId);
//       console.log(isFavorite);

//       if (isFavorite) {
//         Alert.alert(
//           "Remove Favorite",
//           "This item is already in your favorites. Do you want to remove it?",
//           [
//             {
//               text: "Cancel",
//               style: "cancel"
//             },
//             {
//               text: "Remove",
//               onPress: async () => {
//                 await removeFavorite(firmId);
//               }
//             }
//           ]
//         );
//       } else {
//         await handleFav(firmId);
//       }
//     } catch (error) {
//       console.error("Error handling favorite click:", error);
//       Alert.alert("Error", "Failed to update favorites");
//     }
//   };

//   const addtoFavorite = async (firmId) => {
//     try {
//       await axios.post(
//         `${Api_url}/firm/users/${firmId}/liked`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const getRandomItems = (arr, n) => {
//     if (!arr || arr.length === 0) return [];
//     const shuffled = [...arr].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, Math.min(n, shuffled.length));
//   };

//   // const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   //   const R = 6371; 
//   //   const dLat = deg2rad(lat2 - lat1);
//   //   const dLon = deg2rad(lon2 - lon1);
//   //   const a =
//   //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   //     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//   //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   //   const distance = R * c; // Distance in km
//   //   return distance.toFixed(1);
//   // };

//   // const deg2rad = (deg) => {
//   //   return deg * (Math.PI / 180);
//   // };
//   const fetchRestaurants = async (params = {}, isLoadMore = false) => {
//     if (!location.lat || !location.lon || (isLoadMore && !hasMore)) return [];

//     setLoading(true);
//     setShowProgress(true);
//     setProgress(0);
//     setError(null);

//     const interval = setInterval(() => {
//       setProgress(prev => (prev >= 90 ? prev : prev + 10));
//     }, 100);

//     try {
//       const baseParams = {
//         lat: userLocation.latitude,
//         lon: userLocation.longitude,
//         radius: 5,
//         limit: 20,
//         cursor: isLoadMore ? cursor : null,
//         features: 'Takeaway'
//       };

//       if (selectedCuisines.length > 0) {
//         baseParams.cuisines = selectedCuisines.join(',');
//       }
//       if (isVegOnly) {
//         baseParams.Dietary = 'vegetarian';
//       } else if (selectedDietary.length > 0) {
//         baseParams.Dietary = selectedDietary.join(',');
//       }
//       if (selectedFeatures.length > 0) {
//         baseParams.features = selectedFeatures.join(',');
//       }
//       if (minRatingFilter) {
//         baseParams.minRating = minRatingFilter;
//       }
//       if (maxRatingFilter) {
//         baseParams.maxRating = maxRatingFilter;
//       }
//       if (priceRangeFilter.length > 0) {
//         baseParams.priceRange = priceRangeFilter.join(',');
//       }
//       if (openNowFilter) {
//         baseParams.openNow = true;
//       }
//       if (offersFilter) {
//         baseParams.offers = true;
//       }
//       if (alcoholFilter !== null) {
//         baseParams.Alcohol = alcoholFilter;
//       }
//       if (selectedSortOption) {
//         baseParams.sortBy = selectedSortOption.value;
//       }

//       const finalParams = { ...baseParams, ...params };
//       const response = await axios.get(`${Api_url}/firm/getnearbyrest?feature=Booking`, {
//         params: finalParams,
//         withCredentials: true
//       });

//       if (response.data.success) {
//         const newData = response.data.data || [];
//         setRandomData(newData);

//         const restaurantsWithDistance = newData.map(restaurant => {
//           return { ...restaurant };
//         });

//         if (isLoadMore) {
//           setIsLoadingMore(false);
//           setFirms(prev => [...prev, ...restaurantsWithDistance]);
//         } else {
//           setFirms(restaurantsWithDistance);
//         }

//         setCursor(response.data.nextCursor);
//         setHasMore(response.data.nextCursor !== null && newData.length === 20);
//         setNotFound(false);
//         return restaurantsWithDistance;
//       } else {
//         console.error('API error:', response.data.message);
//         if (!isLoadMore) {
//           setNotFound(true);
//           removeNotFound();
//         }
//         return [];
//       }
//     } catch (error) {
//       console.error('Error fetching firms:', error);
//       if (!isLoadMore) {
//         setNotFound(true);
//         removeNotFound();
//       }
//       if (isLoadMore) {
//         setIsLoadingMore(false);
//       }
//       return [];
//     } finally {
//       clearInterval(interval);
//       setProgress(100);
//       setTimeout(() => {
//         setLoading(false);
//         setShowProgress(false);
//         setRefreshing(false);
//       }, 300);
//     }
//   };

//   const removeNotFound = async () => {
//     setTimeout(async () => {
//       setNotFound(false);
//       await fetchRestaurants({}, false, false);
//     }, 1500);
//   };

//   const fetchCollections = useCallback(async () => {
//     try {
//       const response = await axios.get(`${Api_url}/api/marketing-dashboard/collections/active`);
//       setCollections(response.data);
//     } catch (error) {
//       console.error('Error fetching collections:', error);
//       setCollections([]);
//     }
//   }, []);
//   const fetchInitialData = async () => {
//     setIsInitialLoading(true);
//     try {
//       const locationResponse = await axios.get(`${Api_url}/api/location`);
//       const { city, state, country, lat, lon } = locationResponse.data;
//       setLocation({
//         city: city || 'KIIT University',
//         state: state ? `${city}, ${state}` : 'Patia, Bhubaneshwar',
//         country,
//         lat,
//         lon
//       });

//       const firmsData = await fetchRestaurants();
//       if (firmsData && firmsData.length > 0) {
//         const selectedItems = getRandomItems(firmsData, Math.min(25, firmsData.length));
//         setRandomItems(selectedItems);
//       } else {
//         setRandomItems([]);
//       }
//       await fetchCollections();
//       await FetchRecentlyViewData();
//       await sortPopularData();
//     } catch (error) {
//       console.error('Error in initial data fetch:', error);
//       setError('Failed to detect location.');
//       setLocation({
//         city: 'KIIT University',
//         state: 'Patia, Bhubaneshwar',
//         country: '',
//         lat: '',
//         lon: ''
//       });
//       await fetchRestaurants();
//       setRandomItems([]);
//     } finally {
//       setIsInitialLoading(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setCursor(null);
//     setHasMore(true);
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const FetchRecentlyViewData = useCallback(async () => {
//     try {
//       const response = await axios.get(`${Api_url}/firm/getrecently-viewed`, {
//         withCredentials: true
//       });
//       const firmItems = response.data.recentlyViewed
//         ?.filter(item => item.itemType === "Firm")
//         ?.map(item => ({
//           _id: item.itemId,
//           restaurantInfo: {
//             name: item.firmInfo?.name,
//             address: item.firmInfo?.address,
//             ratings: item.firmInfo?.ratings,
//             image_urls: item.firmInfo?.image_urls
//           }
//         })) || [];

//       setRecentlyViewdData(firmItems);
//     } catch (error) {
//       console.error('Error fetching recently viewed data:', error);
//       setRecentlyViewdData([]);
//     }
//   }, []);

//   const sortPopularData = useCallback(() => {
//     const sorted = randomData.filter(
//       (item) => item.restaurantInfo?.ratings?.overall >= 4
//     );
//     setPopularData(sorted);
//   }, [randomData]);

//   const handleSearch = useCallback((text) => {
//     setQuery(text);
//   }, []);

//   useEffect(() => {
//     const searchRestaurants = async () => {
//       if (query.trim() === '') {
//         setSearchResults([]);
//         setIsSearching(false);
//         return;
//       }

//       setIsSearching(true);
//       try {
//         const response = await axios.get(`${Api_url}/search`, {
//           params: { query },
//           withCredentials: true
//         });

//         // Handle both direct search results and recommended restaurants
//         let results = [];

//         if (response.data?.restaurants) {
//           results = response.data.restaurants.map(restaurant => ({
//             _id: restaurant.id,
//             restaurantInfo: {
//               name: restaurant.restaurant_name,
//               address: restaurant.address,
//               ratings: { overall: restaurant.rating || 0 },
//               cuisines: restaurant.cuisines || '',
//               priceRange: restaurant.price_range || '',
//               image_urls: restaurant.image_url,
//               location: restaurant.location || null
//             },
//             image_urls: restaurant.image_url
//           }));
//         }

//         if (response.data?.recommendedRestaurants) {
//           const recommended = response.data.recommendedRestaurants.map(restaurant => ({
//             _id: restaurant.id,
//             restaurantInfo: {
//               name: restaurant.restaurant_name,
//               address: restaurant.address,
//               ratings: { overall: restaurant.rating || 0 },
//               cuisines: restaurant.additionalDetails || '',
//               priceRange: restaurant.price || '',
//               image_urls: restaurant.image_url,
//               location: {
//                 coordinates: restaurant.location?.coordinates || [0, 0]
//               }
//             },
//             image_urls: restaurant.image_url,
//             distance: restaurant.distance || 0
//           }));

//           results = [...results, ...recommended];
//         }

//         // Remove duplicates
//         const uniqueResults = results.filter((v, i, a) =>
//           a.findIndex(t => (t._id === v._id)) === i
//         );

//         setSearchResults(uniqueResults);
//       } catch (error) {
//         console.error('Error searching restaurants:', error);
//         setSearchResults([]);
//       } finally {
//         setIsSearching(false);
//       }
//     };

//     const debounceTimer = setTimeout(searchRestaurants, 500);
//     return () => clearTimeout(debounceTimer);
//   }, [query]);
//   useEffect(() => {
//     const applyFilters = async () => {
//       const firmsData = await fetchRestaurants();
//       setFirms(firmsData);
//     };
//     const debounceTimer = setTimeout(applyFilters, 300);
//     return () => clearTimeout(debounceTimer);
//   }, [
//     selectedSortOption,
//     selectedCuisines,
//     selectedDietary,
//     selectedFeatures,
//     minRatingFilter,
//     maxRatingFilter,
//     priceRangeFilter,
//     openNowFilter,
//     offersFilter,
//     alcoholFilter,
//     isVegOnly
//   ]);

//   const handleQuickFilterPress = (filterName) => {
//     if (filterName === 'Filters') {
//       setFiltersVisible(true);
//       return;
//     }

//     setActiveQuickFilters(prev => {
//       const newFilters = prev.includes(filterName)
//         ? prev.filter(f => f !== filterName)
//         : [...prev, filterName];
//       if (filterName === 'Rating 4.0+') {
//         setMinRatingFilter(newFilters.includes(filterName) ? 4 : null);
//       }
//       if (filterName === 'Pure Veg') {
//         setSelectedDietary(newFilters.includes(filterName) ? ['vegetarian'] : []);
//       }
//       if (filterName === 'Offers') {
//         setOffersFilter(newFilters.includes(filterName));
//       }
//       if (filterName === 'Open Now') {
//         setOpenNowFilter(newFilters.includes(filterName));
//       }

//       return newFilters;
//     });
//   };

//   const handleFilterboxChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFilterboxFilters(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleApplyFilterboxFilters = (filters) => {
//     // Find the matching sort option
//     const selectedOption = sortOptions.find(opt =>
//       opt.value === filters.sortBy ||
//       opt.label.toLowerCase().includes(filters.sortBy?.toLowerCase())
//     );

//     setSelectedSortOption(selectedOption || null);
//     setSelectedCuisines(filters.cuisines ? filters.cuisines.split(',') : []);
//     setMinRatingFilter(filters.minRating || null);
//     setMaxRatingFilter(filters.maxRating || null);
//     setPriceRangeFilter(filters.priceRange ? [filters.priceRange] : []);
//     setOpenNowFilter(filters.openNow || false);
//     setOffersFilter(filters.offers || false);
//     setAlcoholFilter(filters.Alcohol || null);
//     setSelectedFeatures(filters.feature ? filters.feature.split(',') : []);
//     setIsVegOnly(filters.Dietary?.includes('vegetarian') || false);
//     setFiltersVisible(false);
//   };

//   const filteredFirms = useMemo(() => {
//     if (query.trim() !== '' && searchResults.length > 0) {
//       return searchResults;
//     }

//     if (query.trim() !== '') {
//       return [];
//     }

//     return firms;
//   }, [firms, query, searchResults]);

//   const applySort = (option) => {
//     setSelectedSortOption(option);
//     setSortVisible(false);
//   };

//   // const handleBookmarkPress = (firmId) => {
//   //   if (firmId) {
//   //     toggleBookmark(firmId, 'restaurants');
//   //   }
//   // };

//   const handleLoadMore = () => {
//     if (hasMore && !isLoadingMore && !isSearching && query.trim() === '') {
//       setIsLoadingMore(true);
//       fetchRestaurants({}, true);
//       FetchRecentlyViewData();
//       sortPopularData();

//     }
//   };

//   const getItemKey = (item, index) => {
//     return item?.id ? `${item.id}` : `item-${index}`;
//   };
//   useEffect(() => {
//     FetchRecentlyViewData()
//     sortPopularData()
//   }, [FetchRecentlyViewData, sortPopularData])

//   const sortVegData = useCallback(async () => {
//     if (isVegOnly) {
//       setLoadingVegData(true);
//       const MIN_LOADING_TIME = 1000; // 3 seconds
//       const startTime = Date.now();

//       try {
//         const response = await axios.get(`${Api_url}/firm/getnearbyrest?cuisines=Vegetarian`, {
//           withCredentials: true
//         });

//         setVegData(response.data.data);

//         // Calculate elapsed time
//         const elapsed = Date.now() - startTime;
//         const remaining = MIN_LOADING_TIME - elapsed;

//         if (remaining > 0) {
//           // Wait remaining time before hiding loading
//           setTimeout(() => {
//             setLoadingVegData(false);
//           }, remaining);
//         } else {
//           setLoadingVegData(false);
//         }
//       } catch (error) {
//         console.error('Error fetching vegetarian data:', error);

//         const elapsed = Date.now() - startTime;
//         const remaining = MIN_LOADING_TIME - elapsed;

//         if (remaining > 0) {
//           setTimeout(() => {
//             setLoadingVegData(false);
//           }, remaining);
//         } else {
//           setLoadingVegData(false);
//         }
//       }
//     }
//     else {
//       setLoadingVegData(false);
//       setVegData([])
//     }


//   }, [isVegOnly]);

//   const HandleUploadVegMode = async () => {
//     try {
//       await fetch(`${Api_url}/api/updateVegMode`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ vegMode: isVegOnly }),
//       });

//       // if (response.ok) {
//       //   ToastAndroid.show('Veg Mode updated', ToastAndroid.SHORT);
//       // }
//     } catch (error) {
//       console.error("Error updating vegMode", error);
//     }
//   };
//   const handleGetVegMode = async () => {
//     try {
//       const response = await axios.get(`${Api_url}/api/getVegMode`, {
//         withCredentials: true
//       });

//       setIsVegOnly(response.data.vegMode); // response is { vegMode: true/false }
//     } catch (error) {
//       console.error("Error fetching vegMode", error);
//     }
//   };

//   useEffect(() => {
//     sortVegData();
//   }, [isVegOnly]);

//   useEffect(() => {
//     handleGetVegMode(); // Fetch veg mode once on mount
//   }, []);

//   useEffect(() => {
//     HandleUploadVegMode(); // Upload veg mode when it changes
//   }, [isVegOnly]);


//   const handleKeepUsing = () => {
//     setIsModalVisible(false);
//     setIsVegOnly(true);
//     setSelectedDietary(['vegetarian']);
//   };



//   return (
//     <View className="flex-1 bg-white p-4">
//       {isInitialLoading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#02757A" />
//         </View>
//       ) : (
//         <>
//           <View className="flex-row justify-between">
//             <LocationHeader />
//             <View className="flex-row mr-2.5">
//               <TouchableOpacity
//                 onPress={() => router.push('/screens/NoficationsPage')}
//               >
//                 <Ionicons name='notifications-circle-outline' size={42} color='#02757A' style={{ marginRight: 10 }} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => router.push('/screens/User')}
//               >
//                 <Ionicons name='person-circle-outline' size={40} color='#02757A' />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View className="flex-row items-center justify-between">
//             <SearchBar
//               query={query}
//               setQuery={setQuery}
//               onSearch={handleSearch}
//             />
//             <View className="flex-col items-center justify-start ml-2.5">
//               <Text className="text-base font-outfit-medium text-textsecondary text-center">Veg</Text>
//               <Text className="text-sm font-outfit-bold text-textsecondary text-center">Mode</Text>
//               <Switch
//                 trackColor={{ false: "#767577", true: "#8BC34A" }}
//                 thumbColor="#f4f3f4"
//                 ios_backgroundColor="#3e3e3e"
//                 onValueChange={(newValue) => {
//                   setIsVegOnly(newValue);
//                   setSelectedDietary(newValue ? ['vegetarian'] : []);
//                   if (!newValue) {
//                     setIsModalVisible(true);
//                   }
//                 }}
//                 className="-mt-1.5"
//                 value={isVegOnly}
//               />

//             </View>
//             <Modal
//               visible={loadingVegData}
//               onRequestClose={() => setLoadingVegData(false)}
//             >
//               <View className="bg-white items-center justify-center flex-1">
//                 <Image
//                   source={require("../../assets/images/natural.png")}
//                   className="w-24 h-24"
//                 />
//                 <Text className="text-base text-textprimary font-semibold mt-4">Explore veg dishes from all restaurants</Text>
//               </View>
//             </Modal>
//             <Modal
//               visible={isModalVisible}
//               transparent
//               animationType="fade"
//               onRequestClose={() => setIsModalVisible(false)}
//             >
//               <View className="bg-black/50 flex-1 justify-center">
//                 <View className="bg-white rounded-2.5 flex-col mx-5 p-2.5 items-center">
//                   <View className="mt-2.5 justify-center items-center">
//                     <Image
//                       className="h-24 w-24"
//                       source={require('../../assets/images/error1.png')}
//                     />
//                   </View>
//                   <Text className="text-textprimary font-bold text-xl mt-1">Switch off Veg Mode?</Text>
//                   <Text className="text-textprimary font-normal text-base mt-2.5">You'll see all restaurants, including those</Text>
//                   <Text className="text-textprimary">serving non-veg dishes</Text>

//                   <TouchableOpacity onPress={() => setIsModalVisible(false)}>
//                     <Text className="text-red-500 text-base font-medium mt-5">Switch off</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={() => handleKeepUsing()} className="p-2.5 mx-2.5 bg-white rounded-lg mt-2.5 justify-center items-center">
//                     <Text className="text-textprimary text-base font-medium">keep using it</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           </View>

//           {showProgress && (
//             <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
//               <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
//             </View>
//           )}

//           {notFound && (
//             <View className="p-4 items-center">
//               <Text className="text-textsecondary text-base">No restaurants found with these filters</Text>
//             </View>
//           )}

//           <FlatList
//             data={filteredFirms}
//             ref={showcaseRef}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={['#02757A']}
//                 tintColor={'#02757A'}
//               />
//             }
//             ListEmptyComponent={
//               <View className="flex-1 justify-center items-center p-4">
//                 {/* <Text style={styles.emptyText}>
//               {isInitialLoading
//                 ? 'Loading restaurants...'
//                 : isSearching
//                   ? 'Searching...'
//                   : firms.length === 0
//                     ? 'No restaurants found in your area'
//                     : 'No restaurants match your filters'}
//             </Text> */}
//               </View>
//             }
//             ListHeaderComponent={
//               query.trim() === '' ? (
//                 <View>
//                   <FlatList
//                     horizontal
//                     pagingEnabled
//                     showsHorizontalScrollIndicator={false}
//                     data={campaigns}
//                     keyExtractor={(item) => item.id.toString()}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity className="m-2.5 w-80 h-40 rounded-2.5">
//                         <Image
//                           source={require('@/assets/images/campaign.webp')}
//                           className="h-32"
//                         />
//                         <Text className="text-textprimary font-outfit">{item.title}</Text>
//                       </TouchableOpacity>
//                     )}
//                     contentContainerStyle={{ flexGrow: 0 }}
//                   />
//                   {/*              
//                   Collections
//                 {collections.length > 0 && (
//                   <>
//                     <View style={styles.separatorRow}>
//                       <View style={styles.line} />
//                       <Text style={styles.separatorText}>COLLECTIONS</Text>
//                       <View style={styles.line} />
//                     </View>

//                     <ScrollView
//                       horizontal
//                       showsHorizontalScrollIndicator={false}
//                       contentContainerStyle={styles.collectionsScrollContainer}
//                     >
//                       {collections.map(item => (
//                         <TouchableOpacity
//                           key={item._id}
//                           style={styles.collectionCard}
//                           onPress={() => router.push({
//                             pathname: 'screens/Collections',
//                             params: {
//                               collectionName: item.title,
//                               firmsList: JSON.stringify(getRestaurantsForCollection(item))
//                             }
//                           })}
//                         >
//                           <ImageBackground
//                             source={require('@/assets/images/newintown.jpg')}
//                             style={styles.collectionImage}
//                             imageStyle={styles.collectionImageStyle}
//                           >
//                             <View style={styles.collectionOverlay}>
//                               <Text style={styles.collectionTitle} numberOfLines={1}>
//                                 {item.title}
//                               </Text>
//                             </View>
//                           </ImageBackground>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </>
//              )}  */}
//                   <View className="flex-row items-center mt-2.5 mb-2.5">
//                     <View className="flex-1 h-px bg-primary" />
//                     <Text className="font-outfit text-xs text-textprimary mx-2">COLLECTIONS</Text>
//                     <View className="flex-1 h-px bg-primary" />
//                   </View>
//                   <View>
//                     <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
//                       <View>
//                         <FlatList
//                           data={collections}
//                           keyExtractor={(item) => item._id}
//                           horizontal={true}
//                           showsHorizontalScrollIndicator={false}
//                           contentContainerStyle={{ paddingHorizontal: 10 }}
//                           renderItem={({ item }) => (
//                             <TouchableOpacity
//                               className="flex-1 m-1.5 rounded-2.5 overflow-hidden"
//                               onPress={() =>
//                                 router.push({
//                                   pathname: 'screens/Collections',
//                                   params: {
//                                     collectionName: item.title,
//                                     // firmsList: JSON.stringify(getRestaurantsForCollection(item)),
//                                   },
//                                 })
//                               }
//                             >
//                               <ImageBackground
//                                 source={{ uri: item.photoApp }}
//                                 className="w-40 h-32 justify-end p-2.5 rounded-3xl overflow-hidden"
//                                 imageStyle={{ borderRadius: 10 }}
//                               >
//                                 <View className="bg-black/50 p-2.5 items-center flex-wrap w-full">
//                                   <Text className="text-white text-sm font-outfit-bold text-center" numberOfLines={1}>
//                                     {item.title}
//                                   </Text>
//                                   <Text className="text-white">{item.restaurants.length} Places <Ionicons name="chevron-forward" size={18} color="#fff" /></Text>
//                                 </View>
//                               </ImageBackground>
//                             </TouchableOpacity>
//                           )}
//                         />
//                       </View>
//                     </ScrollView>
//                   </View>


//                   <View className="flex mt-2.5 mb-4">
//                     <View className="flex-row items-center mt-2.5 mb-2.5">
//                       <View className="flex-1 h-px bg-primary" />
//                       <Text className="font-outfit text-xs text-textprimary mx-2">
//                         RECENTLY VIEWED
//                       </Text>
//                       <View className="flex-1 h-px bg-primary" />
//                     </View>

//                     <FlatList
//                       showsHorizontalScrollIndicator={false}
//                       data={recentlyViewData}
//                       horizontal
//                       keyExtractor={(item, index) => item._id + '-' + index}
//                       renderItem={({ item, index }) => (
//                         <MiniRecommendedCard
//                           key={item._id}
//                           name={item.restaurantInfo?.name}
//                           address={item.restaurantInfo?.address}
//                           image={item.restaurantInfo?.image_urls}
//                           rating={item.restaurantInfo?.ratings?.overall}
//                           onPress={() => {
//                             router.push({
//                               pathname: '/screens/FirmDetailsDining',
//                               params: { firmId: item._id }
//                             });
//                           }}
//                           onFavoriteToggle={() => {
//                             setFavoriteServices(prevState =>
//                               prevState.includes(item._id)
//                                 ? prevState.filter(id => id !== item._id)
//                                 : [...prevState, item._id]
//                             );
//                           }}
//                           isFavorite={favoriteServices.includes(item._id)}
//                         />
//                       )}
//                     />


//                   </View>


//                   <View className="flex mt-1 mb-4">
//                     <View className="flex-row items-center mt-2.5 mb-2.5">
//                       <View className="flex-1 h-px bg-primary" />
//                       <Text className="font-outfit text-xs text-textprimary mx-2">POPULAR</Text>
//                       <View className="flex-1 h-px bg-primary" />
//                     </View>
//                     <FlatList
//                       showsHorizontalScrollIndicator={false}
//                       data={popularData}
//                       horizontal
//                       renderItem={({ item, index }) => (
//                         <View>
//                           <MiniRecommendedCard
//                             key={getItemKey(item, index)}
//                             tiffinId={item._id}
//                             name={item.restaurantInfo.name}
//                             address={item.restaurantInfo.address}
//                             image={item.image_urls}
//                             rating={item.restaurantInfo.ratings.overall}
//                             onPress={() => {
//                               if (!item._id) {
//                                 console.error('No ID found for item:', item);
//                                 return;
//                               }
//                               router.push({
//                                 pathname: '/screens/FirmDetailsTakeAway',
//                                 params: {
//                                   firmId: item._id
//                                 }
//                               });
//                             }}
//                             onFavoriteToggle={() => {
//                               if (!item._id) return;
//                               setFavoriteServices(prevState =>
//                                 prevState.includes(item._id)
//                                   ? prevState.filter(id => id !== item._id)
//                                   : [...prevState, item._id]
//                               );
//                             }}
//                             isFavorite={item._id ? favoriteServices.includes(item._id) : false}
//                           />
//                         </View>
//                       )}
//                       keyExtractor={(item, index) => item._id ? `${item._id}` : `rec-item-${index}`}
//                     />
//                   </View>
//                   <View className="flex-row items-center mt-2.5 mb-2.5">
//                     <View className="flex-1 h-px bg-primary" />
//                     <Text className="font-outfit text-xs text-textprimary mx-2">
//                       ALL RESTAURANTS
//                     </Text>
//                     <View className="flex-1 h-px bg-primary" />
//                   </View>
//                   <View className="mb-2.5">
//                     <FlatList
//                       data={quickFilters}
//                       horizontal
//                       showsHorizontalScrollIndicator={false}
//                       keyExtractor={(item) => item.name}
//                       renderItem={({ item }) => {
//                         const isSelected = activeQuickFilters.includes(item.name);
//                         return (
//                           <TouchableOpacity
//                             className={`flex-row items-center px-3 py-2 mr-2 rounded-full border border-primary ${isSelected ? 'bg-primary' : ''
//                               }`}
//                             onPress={() => handleQuickFilterPress(item.name)}
//                             activeOpacity={0.7}
//                           >
//                             {item.name === 'Pure Veg' ? (
//                               <MaterialCommunityIcons
//                                 name={item.icon}
//                                 size={16}
//                                 color={isSelected ? "white" : "#02757A"}
//                                 style={{ marginRight: 4 }}
//                               />
//                             ) : (
//                               <MaterialIcons
//                                 name={item.icon}
//                                 size={16}
//                                 color={isSelected ? "white" : "#02757A"}
//                                 style={{ marginRight: 4 }}
//                               />
//                             )}
//                             <Text className={`text-sm font-outfit-medium ${isSelected ? 'text-white' : 'text-textprimary'
//                               }`}>
//                               {item.name}
//                             </Text>
//                           </TouchableOpacity>
//                         );
//                       }}
//                     />
//                   </View>
//                 </View>
//               ) : null
//             }
//             renderItem={({ item }) => {
//               if (!item || !item.restaurantInfo) {
//                 console.warn('Invalid restaurant item:', item);
//                 return null;
//               }

//               return (
//                 <DiningCard
//                   firmId={item._id}
//                   restaurantInfo={{
//                     ...item.restaurantInfo,
//                     // isBookMarked: isBookmarked(item._id, 'restaurants')
//                   }}
//                   firmName={item.restaurantInfo.name}
//                   area={item.restaurantInfo.address}
//                   rating={item.restaurantInfo.ratings?.overall}
//                   cuisines={item.restaurantInfo.cuisines}
//                   price={item.restaurantInfo.priceRange}
//                   image={item.restaurantInfo.image_urls || item.image_urls}
//                   promoted={item.promoted || false}
//                   time={item.time || "N/A"}
//                   offB={item.offB || false}
//                   proExtraB={item.proExtraB || false}
//                   off={item.off || "No offer"}
//                   proExtra={item.proExtra || "N/A"}
//                   onPress={() => router.push({
//                     pathname: "screens/FirmDetailsDining",
//                     params: { firmId: item._id }
//                   })}
//                   distance={item.distance}
//                   offer={item.offer}
//                   addtoFavorite={addtoFavorite}
//                   handleFavoriteClick={handleFavoriteClick}
//                 // isBookmarked={isBookmarked(item._id, 'restaurants')}
//                 />
//               );
//             }}
//             keyExtractor={(item) => item._id}
//             onEndReached={handleLoadMore}
//             onEndReachedThreshold={0.5}
//             ListFooterComponent={
//               isLoadingMore ? (
//                 <View className="flex-1 justify-center items-center">
//                   <ActivityIndicator size="large" color="#02757A" />
//                 </View>
//               ) : null
//             }
//           />
//           <Modal
//             transparent={true}
//             visible={isSortVisible}
//             animationType="slide"
//             onRequestClose={() => setSortVisible(false)}
//           >
//             <View className="flex-1 bg-black/50 justify-end">
//               <View className="bg-white rounded-t-4xl p-6">
//                 <Text className="text-xl font-outfit-bold text-textprimary mb-4">Sort Options</Text>
//                 <RadioButtonRN
//                   data={sortOptions}
//                   selectedBtn={applySort}
//                   initial={selectedSortOption ? sortOptions.findIndex(opt => opt.value === selectedSortOption.value) + 1 : null}
//                   box={false}
//                   textStyle={{ fontSize: 16, color: '#333' }}
//                   circleSize={16}
//                   activeColor='#02757A'
//                 />
//                 <TouchableOpacity
//                   className="bg-primary p-4 rounded-2.5 items-center mt-4"
//                   onPress={() => setSortVisible(false)}
//                 >
//                   <Text className="text-white font-outfit-bold text-base">Apply</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>

//           <Filterbox
//             isOpen={isFiltersVisible}
//             setIsOpen={setFiltersVisible}
//             handleChange={handleFilterboxChange}
//             filters={filterboxFilters}
//             onApplyFilters={handleApplyFilterboxFilters}
//             sortMapping={sortMapping}
//           />
//         </>
//       )}
//     </View>
//   )
// }



import { View, Text, FlatList, Image, TouchableOpacity, Modal, ImageBackground, ActivityIndicator, ScrollView, RefreshControl, Switch, Dimensions } from 'react-native'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import SearchBar from '@/components/SearchBar'
import MiniRecommendedCard from '@/components/MiniRecommendedCard'
import RadioButtonRN from 'radio-buttons-react-native'
import Filterbox from '@/components/Filterbox'
import LocationHeader from '@/components/HomeHeader'
import DiningCard from '@/components/DaningCard'
import { API_CONFIG } from '../../config/apiConfig'
import { useSafeNavigation } from "@/hooks/navigationPage";


const Api_url = API_CONFIG.BACKEND_URL;
const { width: screenWidth } = Dimensions.get('window');

export default function TakeAway() {
  const [firms, setFirms] = useState([])
  const [isSortVisible, setSortVisible] = useState(false)
  const [isFiltersVisible, setFiltersVisible] = useState(false)
  const [selectedSortOption, setSelectedSortOption] = useState(null)
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [selectedDietary, setSelectedDietary] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [minRatingFilter, setMinRatingFilter] = useState(null)
  const [maxRatingFilter, setMaxRatingFilter] = useState(null)
  const [priceRangeFilter, setPriceRangeFilter] = useState([])
  const [openNowFilter, setOpenNowFilter] = useState(false)
  const [offersFilter, setOffersFilter] = useState(false)
  const [alcoholFilter, setAlcoholFilter] = useState(null)
  const { safeNavigation } = useSafeNavigation();

  const [searchResults, setSearchResults] = useState([])
  const [cursor, setCursor] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const showcaseRef = useRef(null)
  const [profileData, setProfileData] = useState("")
  const [randomData, setRandomData] = useState([])
  const [favoriteServices, setFavoriteServices] = useState([])
  const [recentlyViewData, setRecentlyViewdData] = useState([])
  const [popularData, setPopularData] = useState([])
  const [vegData, setVegData] = useState([])
  const [loadingVegData, setLoadingVegData] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVegOnly, setIsVegOnly] = useState(false)
  const [collections, setCollections] = useState([])
  const isFetchingRef = useRef(false)
  const collectionsFetchedRef = useRef(false)

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
  })

  const isMountedRef = useRef(false)
  const pendingTimeoutsRef = useRef(new Set())
  const restaurantsRequestRef = useRef(null)
  const restaurantsRequestIdRef = useRef(0)
  const searchRequestRef = useRef(null)
  const searchRequestIdRef = useRef(0)
  const vegRequestRef = useRef(null)
  const vegRequestIdRef = useRef(0)
  const initialLoadRequestRef = useRef(null)

  const safeTimeout = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current.delete(id)
      fn()
    }, ms)
    pendingTimeoutsRef.current.add(id)
    return id
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false

      pendingTimeoutsRef.current.forEach((id) => clearTimeout(id))
      pendingTimeoutsRef.current.clear()

      if (restaurantsRequestRef.current) {
        restaurantsRequestRef.current.abort()
        restaurantsRequestRef.current = null
      }
      if (searchRequestRef.current) {
        searchRequestRef.current.abort()
        searchRequestRef.current = null
      }
      if (vegRequestRef.current) {
        vegRequestRef.current.abort()
        vegRequestRef.current = null
      }
      if (initialLoadRequestRef.current) {
        initialLoadRequestRef.current.abort()
        initialLoadRequestRef.current = null
      }
    }
  }, [safeTimeout])
  const campaigns = [
    { id: 1, title: 'Get $5 cashback on order $50' },
    { id: 2, title: 'Buy 1 Get 1 Free' },
    { id: 3, title: 'Free Delivery on First Order' }
  ]
  const sortOptions = useMemo(() => ([
    { id: 1, label: 'Price Low to High', value: 'default' },
    { id: 2, label: 'Rating', value: 'HighToLow' },
    { id: 3, label: 'Price Low to High', value: 'lowToHigh' },
    { id: 4, label: 'Price High to Low', value: 'highToLow' },
    { id: 5, label: 'Distance', value: 'deliveryTime' }
  ]), [])
  const quickFilters = [
    { name: 'Filters', icon: 'filter-list' },
    { name: 'Rating 4.0+', icon: 'star' },
    { name: 'Pure Veg', icon: 'leaf' },
    { name: 'Offers', icon: 'local-offer' },
    { name: 'Open Now', icon: 'access-time' }
  ]

  const router = useRouter()
  const [query, setQuery] = useState('')
  const [randomItems, setRandomItems] = useState([])
  const [activeQuickFilters, setActiveQuickFilters] = useState([])
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
  })

  const sortMapping = {
    popularity: "default",
    ratingHighToLow: "HighToLow",
    costLowToHigh: "lowToHigh",
    costHighToLow: "highToLow",
    deliveryTime: "deliveryTime",
  }
  const handleFav = async (firmId) => {
    const saved = await AsyncStorage.getItem("userProfileData")
    if (saved) {
      setProfileData(JSON.parse(saved))
    }
    console.log(saved)
    const url = `${Api_url}/firm/fav/${firmId}`
    console.log("Fetching URL:", url)

    const response = await axios.post(url, {}, { withCredentials: true })
    alert("updated successfull")
    console.log("Response:", response.data)
  }

  const checkIfFavorite = async (firmId) => {
    try {
      const url = `${Api_url}/firm/favCheck/${firmId}`
      const response = await axios.get(url, { withCredentials: true })
      console.log("Response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error checking favorite status:", error.response?.data || error.message)
    }
  }

  const removeFavorite = async (firmId) => {
    try {
      const url = `${Api_url}/firm/favRemove/${firmId}`
      const response = await axios.post(url, {}, { withCredentials: true })
      console.log("Response:", response.data)
      alert(response.data.message)
    } catch (error) {
      console.error("Error removing favorite:", error.response?.data || error.message)
    }
  }

  const handleFavoriteClick = async (firmId) => {
    try {
      const { isFavorite } = await checkIfFavorite(firmId)
      console.log(isFavorite)

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
                await removeFavorite(firmId)
              }
            }
          ]
        )
      } else {
        await handleFav(firmId)
      }
    } catch (error) {
      console.error("Error handling favorite click:", error)
      Alert.alert("Error", "Failed to update favorites")
    }
  }

  const addtoFavorite = async (firmId) => {
    try {
      await axios.post(
        `${Api_url}/firm/users/${firmId}/liked`,
        {},
        {
          withCredentials: true,
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
  const getRandomItems = (arr, n) => {
    if (!arr || arr.length === 0) return []
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(n, shuffled.length))
  }

  const fetchRestaurants = async (params = {}, isLoadMore = false) => {
    // 🚫 STOP duplicate calls
    if (isFetchingRef.current) return []
    if (isLoadMore && !hasMore) return []

    isFetchingRef.current = true
    setLoading(true)

    if (isLoadMore) {
      setIsLoadingMore(true)
    } else {
      setShowProgress(true)
      setProgress(0)
    }

    const interval = setInterval(() => {
      if (!isMountedRef.current) return
      setProgress(prev => (prev >= 90 ? prev : prev + 10))
    }, 100)

    try {
      const baseParams = {
        lat: userLocation.latitude,
        lon: userLocation.longitude,
        radius: 5,
        limit: 20,
        cursor: isLoadMore ? cursor : null,
        features: 'Booking',
      }

      if (selectedCuisines.length) baseParams.cuisines = selectedCuisines.join(',')
      if (isVegOnly) baseParams.Dietary = 'vegetarian'
      else if (selectedDietary.length) baseParams.Dietary = selectedDietary.join(',')
      if (selectedFeatures.length) baseParams.features = selectedFeatures.join(',')
      if (minRatingFilter) baseParams.minRating = minRatingFilter
      if (maxRatingFilter) baseParams.maxRating = maxRatingFilter
      if (priceRangeFilter.length) baseParams.priceRange = priceRangeFilter.join(',')
      if (openNowFilter) baseParams.openNow = true
      if (offersFilter) baseParams.offers = true
      if (alcoholFilter !== null) baseParams.Alcohol = alcoholFilter
      if (selectedSortOption) baseParams.sortBy = selectedSortOption.value

      const response = await axios.get(
        `${Api_url}/firm/getnearbyrest?feature=Booking`,
        { params: { ...baseParams, ...params }, withCredentials: true }
      )

      if (response.data?.success) {
        const newData = response.data.data || []

        setRandomData(newData)

        setFirms(prev =>
          isLoadMore ? [...prev, ...newData] : newData
        )

        setCursor(response.data.nextCursor)
        setHasMore(Boolean(response.data.nextCursor))
        setNotFound(false)

        return newData
      } else {
        if (!isLoadMore) setNotFound(true)
        return []
      }
    } catch (error) {
      if (error?.name === 'CanceledError' || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
        return []
      }
      console.error('Error fetching firms:', error)
      if (!isLoadMore) setNotFound(true)
      return []
    } finally {
      clearInterval(interval)
      setLoading(false)
      setShowProgress(false)
      setRefreshing(false)
      setIsLoadingMore(false)
      isFetchingRef.current = false
    }
  }


  const removeNotFound = async () => {
    safeTimeout(async () => {
      if (!isMountedRef.current) return
      setNotFound(false)
      await fetchRestaurants({}, false, false)
    }, 1500)
  }

  const fetchCollections = useCallback(async () => {
    if (collectionsFetchedRef.current) return

    try {
      const response = await axios.get(
        `${Api_url}/api/marketing-dashboard/collections/active`
      )
      setCollections(response.data)
      collectionsFetchedRef.current = true
    } catch (error) {
      console.error('Error fetching collections:', error)
      if (isMountedRef.current) {
        setCollections([])
      }
    }
  }, [])

  const fetchInitialData = async () => {
    setIsInitialLoading(true)
    setCursor(null)
    setHasMore(true)

    try {
      await fetchRestaurants({}, false)

      // 👇 ONLY ONCE
      fetchCollections()

      FetchRecentlyViewData()
    } catch (error) {
      console.error('Initial load error:', error)
    } finally {
      if (isMountedRef.current) {
        setIsInitialLoading(false)
      }
    }
  }


  const onRefresh = useCallback(() => {
    if (isMountedRef.current) {
      setRefreshing(true)
      setCursor(null)
      setHasMore(true)
    }
    fetchInitialData()
  }, [])


  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setCursor(null)
      setHasMore(true)
      fetchRestaurants({}, false)
    }, 300)

    return () => clearTimeout(debounce)
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
    isVegOnly,
  ])


  const FetchRecentlyViewData = useCallback(async () => {
    try {
      const response = await axios.get(`${Api_url}/firm/getrecently-viewed`, {
        withCredentials: true
      })
      const firmItems = response.data.recentlyViewed
        ?.filter(item => item.itemType === "Firm")
        ?.map(item => ({
          _id: item.itemId,
          restaurantInfo: {
            name: item.firmInfo?.name,
            address: item.firmInfo?.address,
            ratings: item.firmInfo?.ratings,
            image_urls: item.firmInfo?.image_urls
          }
        })) || []

      if (isMountedRef.current) {
        setRecentlyViewdData(firmItems)
      }
    } catch (error) {
      console.error('Error fetching recently viewed data:', error)
      if (isMountedRef.current) {
        setRecentlyViewdData([])
      }
    }
  }, [])

  const sortPopularData = useCallback(() => {
    const sorted = randomData.filter(
      (item) => item.restaurantInfo?.ratings?.overall >= 4
    )
    if (isMountedRef.current) {
      setPopularData(sorted)
    }
  }, [randomData])

  const handleSearch = useCallback((text) => {
    setQuery(text)
  }, [])

  useEffect(() => {
    const searchRestaurants = async () => {
      if (query.trim() === '') {
        if (searchRequestRef.current) {
          searchRequestRef.current.abort()
          searchRequestRef.current = null
        }
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      const requestId = ++searchRequestIdRef.current
      if (searchRequestRef.current) {
        searchRequestRef.current.abort()
      }
      const controller = new AbortController()
      searchRequestRef.current = controller
      try {
        const response = await axios.get(`${Api_url}/search`, {
          params: { query },
          withCredentials: true,
          signal: controller.signal,
        })

        let results = []

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
          }))
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
          }))

          results = [...results, ...recommended]
        }

        const uniqueResults = results.filter((v, i, a) =>
          a.findIndex(t => (t._id === v._id)) === i
        )

        if (!isMountedRef.current || requestId !== searchRequestIdRef.current) return
        setSearchResults(uniqueResults)
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return
        console.error('Error searching restaurants:', error)
        if (!isMountedRef.current || requestId !== searchRequestIdRef.current) return
        setSearchResults([])
      } finally {
        if (!isMountedRef.current || requestId !== searchRequestIdRef.current) return
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchRestaurants, 500)
    return () => {
      clearTimeout(debounceTimer)
      if (searchRequestRef.current) {
        searchRequestRef.current.abort()
        searchRequestRef.current = null
      }
    }
  }, [query])
  useEffect(() => {
    const applyFilters = async () => {
      const firmsData = await fetchRestaurants()
      if (!isMountedRef.current) return
      setFirms(firmsData)
    }
    const debounceTimer = setTimeout(applyFilters, 300)
    return () => clearTimeout(debounceTimer)
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
  ])

  const handleQuickFilterPress = (filterName) => {
    if (filterName === 'Filters') {
      setFiltersVisible(true)
      return
    }

    setActiveQuickFilters(prev => {
      const newFilters = prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
      if (filterName === 'Rating 4.0+') {
        setMinRatingFilter(newFilters.includes(filterName) ? 4 : null)
      }
      if (filterName === 'Pure Veg') {
        setSelectedDietary(newFilters.includes(filterName) ? ['vegetarian'] : [])
      }
      if (filterName === 'Offers') {
        setOffersFilter(newFilters.includes(filterName))
      }
      if (filterName === 'Open Now') {
        setOpenNowFilter(newFilters.includes(filterName))
      }

      return newFilters
    })
  }

  const handleFilterboxChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilterboxFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleApplyFilterboxFilters = (filters) => {
    const selectedOption = sortOptions.find(opt =>
      opt.value === filters.sortBy ||
      opt.label.toLowerCase().includes(filters.sortBy?.toLowerCase())
    )

    setSelectedSortOption(selectedOption || null)
    setSelectedCuisines(filters.cuisines ? filters.cuisines.split(',') : [])
    setMinRatingFilter(filters.minRating || null)
    setMaxRatingFilter(filters.maxRating || null)
    setPriceRangeFilter(filters.priceRange ? [filters.priceRange] : [])
    setOpenNowFilter(filters.openNow || false)
    setOffersFilter(filters.offers || false)
    setAlcoholFilter(filters.Alcohol || null)
    setSelectedFeatures(filters.feature ? filters.feature.split(',') : [])
    setIsVegOnly(filters.Dietary?.includes('vegetarian') || false)
    setFiltersVisible(false)
  }

  const filteredFirms = useMemo(() => {
    if (query.trim() !== '' && searchResults.length > 0) {
      return searchResults
    }

    if (query.trim() !== '') {
      return []
    }

    return firms
  }, [firms, query, searchResults])

  const applySort = (option) => {
    setSelectedSortOption(option)
    setSortVisible(false)
  }

  const handleLoadMore = () => {
    if (
      !hasMore ||
      isLoadingMore ||
      isSearching ||
      query.trim() !== ''
    ) {
      return
    }

    fetchRestaurants({}, true)
  }


  const getItemKey = (item, index) => {
    return item?.id ? `${item.id}` : `item-${index}`
  }
  useEffect(() => {
    FetchRecentlyViewData()
    sortPopularData()
  }, [FetchRecentlyViewData, sortPopularData])

  const sortVegData = useCallback(async () => {
    if (isVegOnly) {
      const requestId = ++vegRequestIdRef.current
      if (vegRequestRef.current) {
        vegRequestRef.current.abort()
      }
      const controller = new AbortController()
      vegRequestRef.current = controller

      if (isMountedRef.current) {
        setLoadingVegData(true)
      }
      const MIN_LOADING_TIME = 1000
      const startTime = Date.now()

      try {
        const response = await axios.get(`${Api_url}/firm/getnearbyrest?cuisines=Vegetarian`, {
          withCredentials: true,
          signal: controller.signal,
        })

        if (!isMountedRef.current || requestId !== vegRequestIdRef.current) return
        setVegData(response.data.data)

        const elapsed = Date.now() - startTime
        const remaining = MIN_LOADING_TIME - elapsed

        if (remaining > 0) {
          safeTimeout(() => {
            if (!isMountedRef.current || requestId !== vegRequestIdRef.current) return
            setLoadingVegData(false)
          }, remaining)
        } else {
          if (isMountedRef.current && requestId === vegRequestIdRef.current) {
            setLoadingVegData(false)
          }
        }
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
          return
        }
        console.error('Error fetching vegetarian data:', error)

        const elapsed = Date.now() - startTime
        const remaining = MIN_LOADING_TIME - elapsed

        if (remaining > 0) {
          safeTimeout(() => {
            if (!isMountedRef.current || requestId !== vegRequestIdRef.current) return
            setLoadingVegData(false)
          }, remaining)
        } else {
          if (isMountedRef.current && requestId === vegRequestIdRef.current) {
            setLoadingVegData(false)
          }
        }
      }
    }
    else {
      if (vegRequestRef.current) {
        vegRequestRef.current.abort()
        vegRequestRef.current = null
      }
      if (isMountedRef.current) {
        setLoadingVegData(false)
        setVegData([])
      }
    }


  }, [isVegOnly, safeTimeout])

  const HandleUploadVegMode = async () => {
    try {
      await fetch(`${Api_url}/api/updateVegMode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vegMode: isVegOnly }),
      })
    } catch (error) {
      console.error("Error updating vegMode", error)
    }
  }
  const handleGetVegMode = async () => {
    try {
      const response = await axios.get(`${Api_url}/api/getVegMode`, {
        withCredentials: true
      })

      if (isMountedRef.current) {
        setIsVegOnly(response.data.vegMode)
      }
    } catch (error) {
      console.error("Error fetching vegMode", error)
    }
  }

  useEffect(() => {
    sortVegData()
  }, [isVegOnly])

  useEffect(() => {
    handleGetVegMode()
  }, [])

  useEffect(() => {
    HandleUploadVegMode()
  }, [isVegOnly])


  const handleKeepUsing = () => {
    setIsModalVisible(false)
    setIsVegOnly(true)
    setSelectedDietary(['vegetarian'])
  }

  return (
    <View className="flex-1 bg-white p-4">
      {isInitialLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#02757A" />
        </View>
      ) : (
        <>
          <View className="flex-row justify-between items-center mr-1 ml-0.5">
            <LocationHeader />
            <View className="flex-row pr-4 items-center">
              <TouchableOpacity className="ml-20"
                onPress={() => safeNavigation('/screens/NoficationsPage')}
              >
                <Ionicons name='notifications-circle-outline' color='#02757A' size={42} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => safeNavigation('/screens/User')}
              >
                <Ionicons name='person-circle-outline' size={42} color='#02757A' />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-between mr-1.5 ml-1.5">
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
                  setIsVegOnly(newValue)
                  setSelectedDietary(newValue ? ['vegetarian'] : [])
                  if (!newValue) {
                    setIsModalVisible(true)
                  }
                }}
                className="-mt-1.5"
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
                      className="h-16 w-16"
                      source={require('../../assets/images/error2.jpeg')}
                    />
                  </View>
                  <Text className="text-textprimary font-outfit-bold text-xl mt-1">Switch off Veg Mode?</Text>
                  <Text className="text-textprimary font-outfit-medium text-base mt-2.5">You'll see all restaurants, including those</Text>
                  <Text className="text-textprimary font-outfit-medium">serving non-veg dishes</Text>

                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Text className="text-red-500 text-base font-outfit-bold mt-5">Switch off</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleKeepUsing()} className="p-2.5 mx-2.5 bg-white rounded-lg mt-2.5 justify-center items-center">
                    <Text className="text-textprimary text-base font-medium">keep using it</Text>
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
                colors={['#02757A']}
                tintColor={'#02757A'}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-4">
              </View>
            }
            ListHeaderComponent={
              query.trim() === '' ? (
                <View className='mr-1.5 ml-1.5'>
                  <FlatList
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{ width: screenWidth - 32, marginHorizontal: 16 }}
                        className="h-auto"
                      >
                        <Image
                          source={require('@/assets/images/campaign.webp')}
                          className="h-32"
                          style={{ marginLeft: '-20', marginRight: 0, width: '100%' }}
                        />
                        <Text className="text-textprimary font-outfit">{item.title}</Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ flexGrow: 0 }}
                  />
                  <View className="flex-row items-center mt-2.5 mb-4">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">COLLECTIONS</Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                  <View className='ml-0'>
                    <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                      <View>
                        <FlatList
                          data={collections}
                          keyExtractor={(item) => item._id}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingLeft: 0, paddingRight: 10 }}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              className="flex-1 mr-5 rounded-2.5 overflow-hidden"
                              onPress={() =>
                                safeNavigation({
                                  pathname: 'screens/Collections',
                                  params: {
                                    collectionName: item.title,
                                  },
                                })
                              }
                            >
                              <ImageBackground
                                source={{ uri: item.photoApp }}
                                className="w-40 h-32 justify-end p-2.5 rounded-3xl overflow-hidden"
                                imageStyle={{ borderRadius: 10 }}
                              >
                                <View className="bg-black/50 p-2.5 items-center flex-wrap w-full">
                                  <Text className="text-white text-sm font-outfit-bold text-center" numberOfLines={1}>
                                    {item.title}
                                  </Text>
                                  <Text className="text-white">{item.restaurants.length} Places <Ionicons name="chevron-forward" size={18} color="#fff" /></Text>
                                </View>
                              </ImageBackground>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </ScrollView>
                  </View>


                  <View className="flex">
                    <View className="flex-row items-center mt-4 mb-7">
                      <View className="flex-1 h-px bg-primary" />
                      <Text className="font-outfit text-xs text-textprimary mx-2">
                        RECENTLY VIEWED
                      </Text>
                      <View className="flex-1 h-px bg-primary" />
                    </View>

                    {recentlyViewData.length > 0 ? (
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
                              safeNavigation({
                                pathname: '/screens/FirmDetailsDining',
                                params: { firmId: item._id }
                              })
                            }}
                            onFavoriteToggle={() => {
                              setFavoriteServices(prevState =>
                                prevState.includes(item._id)
                                  ? prevState.filter(id => id !== item._id)
                                  : [...prevState, item._id]
                              )
                            }}
                            isFavorite={favoriteServices.includes(item._id)}
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
                          Surf the restaurants to start building your recently viewed list.
                        </Text>
                      </View>
                    )}


                  </View>


                  <View className="flex mt-1">
                    <View className="flex-row items-center mt-2.5 mb-7">
                      <View className="flex-1 h-px bg-primary" />
                      <Text className="font-outfit text-xs text-textprimary mx-2">POPULAR</Text>
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
                                console.error('No ID found for item:', item)
                                return
                              }
                              safeNavigation({
                                pathname: '/screens/FirmDetailsTakeAway',
                                params: {
                                  firmId: item._id
                                }
                              })
                            }}
                            onFavoriteToggle={() => {
                              if (!item._id) return
                              setFavoriteServices(prevState =>
                                prevState.includes(item._id)
                                  ? prevState.filter(id => id !== item._id)
                                  : [...prevState, item._id]
                              )
                            }}
                            isFavorite={item._id ? favoriteServices.includes(item._id) : false}
                          />
                        </View>
                      )}
                      keyExtractor={(item, index) => item._id ? `${item._id}` : `rec-item-${index}`}
                    />
                  </View>
                  <View className="flex-row items-center mt-4 mb-4">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="font-outfit text-xs text-textprimary mx-2">
                      ALL RESTAURANTS
                    </Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                  <View className="mb-4">
                    <FlatList
                      data={quickFilters}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.name}
                      renderItem={({ item }) => {
                        const isSelected = activeQuickFilters.includes(item.name)
                        return (
                          <TouchableOpacity
                            className={`flex-row items-center px-3 py-2 mr-2 rounded-full border border-primary ${isSelected ? 'bg-primary' : ''
                              }`}
                            onPress={() => handleQuickFilterPress(item.name)}
                            activeOpacity={0.7}
                          >
                            {item.name === 'Pure Veg' ? (
                              <MaterialCommunityIcons
                                name={item.icon}
                                size={16}
                                color={isSelected ? "white" : "#02757A"}
                                style={{ marginRight: 4 }}
                              />
                            ) : (
                              <MaterialIcons
                                name={item.icon}
                                size={16}
                                color={isSelected ? "white" : "#02757A"}
                                style={{ marginRight: 4 }}
                              />
                            )}
                            <Text className={`text-sm font-outfit-medium ${isSelected ? 'text-white' : 'text-textprimary'
                              }`}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  </View>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              if (!item || !item.restaurantInfo) {
                console.warn('Invalid restaurant item:', item)
                return null
              }

              return (
                <DiningCard
                  firmId={item._id}
                  restaurantInfo={{
                    ...item.restaurantInfo,
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
                  onPress={() => safeNavigation({
                    pathname: "screens/FirmDetailsDining",
                    params: { firmId: item._id }
                  })}
                  distance={item.distance}
                  offer={item.offer}
                  addtoFavorite={addtoFavorite}
                  handleFavoriteClick={handleFavoriteClick}
                />
              )
            }}
            keyExtractor={(item) => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#02757A" />
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
                  activeColor='#02757A'
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