import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';

const CollectionCard = ({ collection, onPress }) => (
  <TouchableOpacity
    className="bg-white rounded-xl mb-4 overflow-hidden shadow-md"
    onPress={() => onPress(collection)}
    activeOpacity={0.7}
  >
    <Image source={collection.image} className="w-full h-35" />
    <View className="p-3">
      <Text className="text-base font-outfit-bold text-textprimary mb-1">{collection.title}</Text>
      {'dishes' in collection && (
        <Text className="text-xs font-outfit text-textsecondary">
          {collection.dishes} dish{collection.dishes !== 1 ? 'es' : ''} • {collection.restaurants} restaurant{collection.restaurants !== 1 ? 's' : ''}
        </Text>
      )}
      {'date' in collection && (
        <Text className="text-xs font-outfit text-textsecondary">
          📅 {collection.date} • 📍 {collection.location}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

export default CollectionCard;
