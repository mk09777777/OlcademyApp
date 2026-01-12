import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CollectionCard({ collection, onPress }) {
  const renderInfo = () => {
    switch (collection.type) {
      case 'tiffin':
      case 'dining':
        return (
          <Text className="text-xs font-outfit text-textsecondary">
            {collection.dishes} dishes • {collection.restaurants} restaurants
          </Text>
        );
      case 'events':
        return (
          <Text className="text-xs font-outfit text-textsecondary">
            <MaterialCommunityIcons name="calendar" size={14} color="#666" />
            {' '}{collection.date} • {collection.location}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(collection)} activeOpacity={0.7}>
      <View className="bg-white rounded-xl mb-4 overflow-hidden shadow-md">
        <Image 
          source={collection.image || require('@/assets/images/placeholder.png')} 
          className="w-full h-35"
        />
        <View className="p-3">
          <Text className="text-base font-outfit-bold text-textprimary mb-1">{collection.title}</Text>
          <Text className="text-xs font-outfit text-textsecondary mb-1">{collection.description}</Text>
          {renderInfo()}
        </View>

        {collection.featured && (
          <View className="absolute top-2 left-2 bg-primary px-2 py-1 rounded">
            <Text className="text-white text-xs font-bold">Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
