// SearchBar.jsx
import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, TextInput} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function SearchBar({
  query,
  setQuery,
  isLoading,
  placeholder,
  onVoicePress,
  fullWidth = false,
  widthClass,
}) {
  const baseClasses = fullWidth
    ? 'w-full self-stretch'
    : widthClass || 'w-4/5 self-center';
  const containerClasses = `${baseClasses} my-2.5`.trim();

  return (
    <View className={containerClasses}>
      <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-3 py-2" style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color="#6B7280" 
          className="mr-2"
        />
        <TextInput
          placeholder={placeholder || "Search restaurants..."}
          value={query}
          onChangeText={setQuery}
          className="flex-1 text-base text-black min-h-[40px] py-2"
          style={{ fontFamily: 'outfit' }}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          placeholderTextColor="#9CA3AF"
        />
        <View className="w-px h-7.5 bg-gray-200 mx-2" />
        <TouchableOpacity 
          onPress={onVoicePress}
          className="p-1"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Feather name="mic" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
