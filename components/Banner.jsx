import React, { useState, useEffect, useRef } from "react"; 
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  ActivityIndicator,
  Text
} from "react-native";
import axios from "axios";
import ErrorHandler from './ErrorHandler';

const API = 'https://project-z-backend-apis.onrender.com';

const BannerCarousel = ({ page }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}/banners/active`,
          { withCredentials: true }
        );
        
        // Process banners to fix malformed arrays and filter by page
        const processedBanners = response.data.map(banner => {
          // Fix malformed arrays in cities and pages
          const fixArray = (field) => {
            if (!banner[field]) return [];
            if (Array.isArray(banner[field])) return banner[field];
            
            try {
              // Handle cases where arrays are stored as JSON strings
              const parsed = JSON.parse(banner[field].replace(/\\"/g, '"'));
              return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              return [];
            }
          };

          return {
            ...banner,
            cities: fixArray('cities'),
            pages: fixArray('pages')
          };
        });

        // Filter banners for current page
        const pageBanners = processedBanners.filter(banner => 
          banner.pages.includes(page)
        );

        setBanners(pageBanners);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [page]);

  useEffect(() => {
    // Auto-scroll functionality
    const startAutoScroll = () => {
      if (validBanners.length <= 1) return;
      
      autoScrollInterval.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % validBanners.length;
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
      }, 5000); // Change slide every 5 seconds
    };

    startAutoScroll();
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, banners]);

  const validBanners = banners.filter(banner => 
    banner?.photoApp?.trim() && 
    (!banner.startDate || new Date(banner.startDate) <= new Date()) &&
    (!banner.endDate || new Date(banner.endDate) >= new Date())
  );

  const handleClick = async (banner) => {
    if (!banner?._id) return;
    try {
      await axios.post(`${API}/banners/banner-click/${banner._id}`);
    } catch (err) {
      console.log("Error counting click:", err);
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / (windowWidth - 40));
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => handleClick(item)}
      className="justify-center items-center bg-transparent h-25"
      style={{ width: windowWidth }}
    >
      <Image
        source={{ uri: item.photoApp }}
        className="w-full h-full rounded-lg"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (validBanners.length <= 1) return null;
    
    return (
      <View className="absolute bottom-2 flex-row self-center">
        {validBanners.map((_, index) => (
          <View 
            key={index}
            className={`w-2 h-2 rounded-full m-1 ${
              index === currentIndex ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    );
  };

  if (loading) return <ActivityIndicator className="h-25 justify-center items-center" size="large" />;
  if (error) return (
    <ErrorHandler
      error={error}
      onRetry={() => {
        setError(null);
        // Retry fetching banners
        const fetchBanners = async () => {
          try {
            setLoading(true);
            const response = await axios.get(
              `${API}/banners/active`,
              { withCredentials: true }
            );
            
            const processedBanners = response.data.map(banner => {
              const fixArray = (field) => {
                if (!banner[field]) return [];
                if (Array.isArray(banner[field])) return banner[field];
                
                try {
                  const parsed = JSON.parse(banner[field].replace(/\\"/g, '"'));
                  return Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                  return [];
                }
              };

              return {
                ...banner,
                cities: fixArray('cities'),
                pages: fixArray('pages')
              };
            });

            const pageBanners = processedBanners.filter(banner => 
              banner.pages.includes(page)
            );

            setBanners(pageBanners);
          } catch (err) {
            console.error("Error fetching banners:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchBanners();
      }}
      title="Unable to load banners"
      message="Failed to load promotional banners. Please try again."
      style={{ height: 100 }}
    />
  );
  if (validBanners.length === 0) return null;

  return (
    <View className="my-2 relative">
      <FlatList
        ref={flatListRef}
        data={validBanners}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        snapToInterval={windowWidth - 40}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: windowWidth - 40,
          offset: (windowWidth - 40) * index,
          index,
        })}
      />
      {renderPagination()}
    </View>
  );
};



export default BannerCarousel;