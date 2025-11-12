import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
// import { StyleSheet } from 'react-native';
import { IconButton, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export const ServiceInfo = ({ service, isFavorite, onFavoriteToggle }) => {
  if (!service) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${service.name} on our app! They offer amazing tiffin services.`,
        title: service.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View className="p-4 bg-white">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-4">
          <Text className="text-2xl font-bold mb-1">{service.name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-600">
              {service.rating.toFixed(1)} ({service.reviewCount} ratings)
            </Text>
          </View>
        </View>
        <View className="flex-row">
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            iconColor={isFavorite ? '#FF4500' : '#000'}
            size={24}
            onPress={onFavoriteToggle}
          />
          <IconButton
            icon="share-variant"
            size={24}
            onPress={handleShare}
          />
        </View>
      </View>

      <Text className="text-base text-gray-600 leading-6 mb-4">{service.description}</Text>

      <View className="flex-row flex-wrap mb-4 gap-2">
        {service.tags.map((tag, index) => (
          <Chip
            key={index}
            className="bg-transparent border-gray-300"
            textStyle={{ color: '#666' }}
            mode="outlined"
          >
            {tag}
          </Chip>
        ))}
      </View>

      <View className="flex-row items-center mb-4">
        <View className="flex-row items-center mr-4">
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text className="ml-1 text-gray-600">{service.deliveryTime}</Text>
        </View>
        {service.isVerified && (
          <View className="flex-row items-center mr-4">
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text className="ml-1 text-gray-600">Verified</Text>
          </View>
        )}
        {service.isPopular && (
          <View className="flex-row items-center mr-4">
            <Ionicons name="trending-up" size={20} color="#FF4500" />
            <Text className="ml-1 text-gray-600">Popular</Text>
          </View>
        )}
      </View>

      {service.category && (
        <View className="mt-2">
          <Chip
            icon={service.category.toLowerCase().includes('veg') ? 'leaf' : 'food'}
            className="self-start"
            style={{
              backgroundColor: service.category.toLowerCase().includes('veg')
                ? '#4CAF50'
                : '#FF4500',
            }}
            textStyle={{ color: '#fff', fontWeight: 'bold' }}
          >
            {service.category}
          </Chip>
        </View>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rating: {
//     marginLeft: 4,
//     color: '#666',
//   },
//   actions: {
//     flexDirection: 'row',
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 24,
//     marginBottom: 16,
//   },
//   tags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//     gap: 8,
//   },
//   tag: {
//     backgroundColor: 'transparent',
//     borderColor: '#ddd',
//   },
//   tagText: {
//     color: '#666',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   infoText: {
//     marginLeft: 4,
//     color: '#666',
//   },
//   categoryContainer: {
//     marginTop: 8,
//   },
//   categoryChip: {
//     alignSelf: 'flex-start',
//   },
//   categoryText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });