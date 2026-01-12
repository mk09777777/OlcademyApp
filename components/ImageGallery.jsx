import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ImageGallery = ({ 
  images = [], 
  currentIndex = 0, 
  onIndexChange = () => {},
  autoScrollInterval = 500,
  showIndicators = true
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const flatListRef = useRef(null);
  const autoScrollTimerRef = useRef(null);
  const touchStartTimeRef = useRef(0);
  
  const defaultImage = require('../assets/images/food_placeholder.jpg');
  const galleryImages = images.length > 0 ? images : [defaultImage];

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (galleryImages.length <= 1 || !isAutoScrolling) return;

    autoScrollTimerRef.current = setInterval(() => {
      const newIndex = (currentIndex + 1) % galleryImages.length;
      onIndexChange(newIndex);
      scrollToIndex(newIndex);
    }, autoScrollInterval);

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [currentIndex, galleryImages.length, isAutoScrolling, autoScrollInterval, onIndexChange]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [startAutoScroll]);

  const handleTouchStart = useCallback(() => {
    touchStartTimeRef.current = Date.now();
    setIsAutoScrolling(false);
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const touchDuration = Date.now() - touchStartTimeRef.current;
    // Only resume auto-scroll if the touch was brief (not a long press)
    if (touchDuration < 500) {
      setIsAutoScrolling(true);
      startAutoScroll();
    }
  }, [startAutoScroll]);

  const handleImagePress = useCallback((index) => {
    setIsAutoScrolling(false);
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
    setSelectedImageIndex(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedImageIndex(null);
    setIsAutoScrolling(true);
    startAutoScroll();
  }, [startAutoScroll]);

  const handleNext = useCallback(() => {
    const newIndex = selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, galleryImages.length]);

  const handlePrev = useCallback(() => {
    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, galleryImages.length]);

  const handleScroll = useCallback((event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  }, [currentIndex, onIndexChange]);

  const scrollToIndex = useCallback((index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < galleryImages.length) {
      scrollToIndex(currentIndex);
    }
  }, [currentIndex, galleryImages.length, scrollToIndex]);

  const handleImageLoad = useCallback((index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: false }));
  }, []);

  const handleImageError = useCallback((index) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: true }));
  }, []);

  const renderImageItem = useCallback(({ item, index }) => {
    const isLoading = loadingStates[index] !== false;
    const isError = errorStates[index] === true;

    return (
      // <TouchableOpacity
      //   onPress={() => handleImagePress(index)}
      //   activeOpacity={0.8}
      //   style={styles.imageContainer}
      // >
      <View className="bg-gray-100 justify-center items-center" style={{ width, height: 350 }}>
        {isLoading && (
          <ActivityIndicator className="absolute" size="large" color="#fff" />
        )}
        {isError ? (
          <View className="justify-center items-center">
            <MaterialIcons name="broken-image" size={50} color="#ccc" />
            <Text className="mt-2.5 color-gray-500 font-outfit">Failed to load image</Text>
          </View>
        ) : (
          <Image
            source={typeof item === 'string' ? { uri: item } : item}
            className="w-full h-full"
            resizeMode="cover"
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
          />
        )}
        </View>
    );
  }, [handleImageError, handleImageLoad, handleImagePress, errorStates, loadingStates]);

  const renderIndicator = useCallback((_, index) => (
    <View 
      key={index}
      className={`w-2 h-2 rounded-full mx-1 ${
        index === currentIndex ? 'bg-white' : 'bg-white/50'
      }`}
    />
  ), [currentIndex]);

  return (
    <View 
      className="flex-1"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={galleryImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImageItem}
        onMomentumScrollEnd={handleScroll}
        initialScrollIndex={currentIndex}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        className="h-87.5"
      />

      {showIndicators && galleryImages.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
          {galleryImages.map(renderIndicator)}
        </View>
      )}

      <Portal>
        <Modal
          visible={selectedImageIndex !== null}
          onDismiss={handleModalClose}
          contentContainerClassName="flex-1 bg-black/90"
        >
          <TouchableOpacity
            className="absolute top-12 right-4 z-10 p-2"
            onPress={handleModalClose}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedImageIndex !== null && (
            <View className="flex-1 justify-center items-center">
              <Image
                source={
                  typeof galleryImages[selectedImageIndex] === 'string' 
                    ? { uri: galleryImages[selectedImageIndex] } 
                    : galleryImages[selectedImageIndex]
                }
                className="w-full h-4/5"
                resizeMode="contain"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <TouchableOpacity 
                    className="absolute left-4 top-1/2 -mt-5 p-2" 
                    onPress={handlePrev}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="absolute right-4 top-1/2 -mt-5 p-2" 
                    onPress={handleNext}
                  >
                    <MaterialCommunityIcons name="chevron-right" size={40} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    height: 350,
  },
  imageContainer: {
    width: width,
    height: 350,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    zIndex: 1,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 12,
  },
});
*/

export default ImageGallery;