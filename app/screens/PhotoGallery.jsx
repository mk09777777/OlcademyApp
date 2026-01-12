import React, { useState } from 'react';
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
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#fff' }
   * header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }
   * gridContainer: { padding: 4 }
   * imageContainer: { flex: 1, margin: 4 }
   * image: { width: (width - 24) / 2, height: (width - 24) / 2, borderRadius: 8 }
   * emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
   * emptyText: { fontSize: 16, color: '#666' }
   */
  const { image_urls } = useLocalSearchParams();
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  let imageList = [];
  try {
    imageList = image_urls ? JSON.parse(image_urls) : [];
  } catch (error) {
    console.error('Failed to parse images:', error);
  }

  const handleBack = () => {
    router.back();
  };

  const handleImagePress = (image) => {
    safeNavigation({
      pathname: '/screens/FullScreenGallery',
      params: {
        images: JSON.stringify(imageList),
        initialImage: imageList.indexOf(image),
      },
    });
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-1"
      onPress={() => handleImagePress(item)}
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
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
        />
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


