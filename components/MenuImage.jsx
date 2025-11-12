import React, { useState } from 'react';
import {
  View,
  Image,
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
        className="flex-1"
      >
        {galleryImages.map((image, index) => (
          <TouchableOpacity
            key={`gallery-${index}`}
            onPress={() => handleImagePress(index)}
          >
            <Image
              source={typeof image === 'string' ? { uri: image } : image}
              className="rounded-2xl"
              style={{ width: windowWidth * 0.4, height: windowHeight * 0.2 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={selectedImageIndex !== null}
          onDismiss={() => setSelectedImageIndex(null)}
          contentContainerClassName="flex-1 bg-black/90 justify-center items-center"
        >
          <TouchableOpacity
            className="absolute top-10 right-5 z-10 p-2 bg-black/50 rounded-lg"
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
                className="w-full h-full"
                resizeMode="contain"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <TouchableOpacity 
                    className="absolute left-5 top-1/2 -mt-5 p-4 bg-black/50 rounded-full z-10" 
                    onPress={handlePrev}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={40} color="#fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="absolute right-5 top-1/2 -mt-5 p-4 bg-black/50 rounded-full z-10" 
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

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
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
*/

export default MenuImage;