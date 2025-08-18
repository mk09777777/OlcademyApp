import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const MenuImage = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const defaultImage = require('../assets/images/food1.jpg');
  
  const galleryImages = images.length > 0 ? images : [defaultImage];

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex < galleryImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : galleryImages.length - 1
    );
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.container}
      >
        {galleryImages.map((image, index) => (
          <TouchableOpacity
            key={`gallery-${index}`}
            onPress={() => handleImagePress(index)}
          >
            <Image
              source={typeof image === 'string' ? { uri: image } : image}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={selectedImageIndex !== null}
          onDismiss={() => setSelectedImageIndex(null)}
          contentContainerStyle={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImageIndex(null)}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {selectedImageIndex !== null && (
            <>
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
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
   flex:1,
  },
  image: {
    width: windowWidth*0.4,
    height: windowHeight*0.2,
    borderRadius:20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
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
});

export default MenuImage;