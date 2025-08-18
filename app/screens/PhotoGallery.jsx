import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
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
      style={styles.imageContainer}
      onPress={() => handleImagePress(item)}
    >
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
        />
      </View>

      {imageList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images to display</Text>
        </View>
      ) : (
        <FlatList
          data={imageList}
          renderItem={renderImage}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gridContainer: {
    padding: 4,
  },
  imageContainer: {
    flex: 1,
    margin: 4,
  },
  image: {
    width: (width - 24) / 2,
    height: (width - 24) / 2,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
