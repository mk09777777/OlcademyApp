import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
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
      <View activeOpacity={0.8}
       style={styles.imageContainer}>
        {isLoading && (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#fff" />
        )}
        {isError ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="broken-image" size={50} color="#ccc" />
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        ) : (
          <Image
            source={typeof item === 'string' ? { uri: item } : item}
            style={styles.image}
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
      style={[
        styles.indicator,
        index === currentIndex && styles.activeIndicator
      ]}
    />
  ), [currentIndex]);

  return (
    <View 
      style={styles.mainContainer}
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
        style={styles.container}
      />

      {showIndicators && galleryImages.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {galleryImages.map(renderIndicator)}
        </View>
      )}

      <Portal>
        <Modal
          visible={selectedImageIndex !== null}
          onDismiss={handleModalClose}
          contentContainerStyle={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleModalClose}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedImageIndex !== null && (
            <View style={styles.modalContent}>
              <Image
                source={
                  typeof galleryImages[selectedImageIndex] === 'string' 
                    ? { uri: galleryImages[selectedImageIndex] } 
                    : galleryImages[selectedImageIndex]
                }
                style={styles.modalImage}
                resizeMode="contain"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <TouchableOpacity 
                    style={[styles.navButton, styles.prevButton]} 
                    onPress={handlePrev}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.navButton, styles.nextButton]} 
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

export default ImageGallery;