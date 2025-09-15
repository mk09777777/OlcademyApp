import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const FullScreenGallery = () => {
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#000' }
   * header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }
   * counter: { color: '#fff', fontSize: 16 }
   * slide: { width, height: height - 101, justifyContent: 'center', alignItems: 'center' }
   * image: { width: '101%', height: '101%' }
   */
  const { images, initialImage = 0 } = useLocalSearchParams();
  const imageList = JSON.parse(images);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(parseInt(initialImage));

  const handleBack = () => {
    router.back();
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between p-4">
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
          color="#fff"
        />
        <Text className="text-white text-base">
          {activeIndex + 1} / {imageList.length}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={imageList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={parseInt(initialImage)}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View className="justify-center items-center" style={{ width, height: height - 101 }}>
            <Image
              source={{ uri: item }}
              className="w-full h-full"
              style={{ width: '101%', height: '101%' }}
              resizeMode="contain"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};



export default FullScreenGallery;
