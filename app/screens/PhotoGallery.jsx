import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeNavigation } from '@/hooks/navigationPage';

const { width } = Dimensions.get('window');

export default function PhotoGallery() {
  const { image_urls } = useLocalSearchParams();
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation() || {};

  const [imageList, setImageList] = useState([]);

  // Parse images safely
  useEffect(() => {
    try {
      let parsed = image_urls ? JSON.parse(image_urls) : [];

      // If a single image is passed, wrap it
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      setImageList(parsed);
    } catch (error) {
      console.error('Failed to parse images:', error);
      setImageList([]);
    }
  }, [image_urls]);

  const handleBack = () => {
    router.back();
  };

  const handleImagePress = (image) => {
    if (!safeNavigation) {
      console.warn("Navigation not ready yet");
      return;
    }

    const index = imageList.findIndex((img) => img === image);

    safeNavigation({
      pathname: "/screens/FullScreenGallery",
      params: {
        images: JSON.stringify(imageList),       // ALWAYS send full list
        initialImage: index >= 0 ? index : 0,    // Correct index
      },
    });
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-1"
      onPress={() => handleImagePress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item }}
        className="rounded-lg"
        style={{ width: (width - 24) / 2, height: (width - 24) / 2 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <IconButton icon="arrow-left" size={24} onPress={handleBack} />
      </View>

      {imageList.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">No images to display</Text>
        </View>
      ) : (
        <FlatList
          data={imageList}
          renderItem={renderImage}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 4 }}
        />
      )}
    </SafeAreaView>
  );
}
