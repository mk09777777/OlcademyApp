// SearchBar.jsx
import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons,Feather } from '@expo/vector-icons';

export default function SearchBar({ query, setQuery, isLoading, placeholder, onVoicePress }) {
  return (
    <View className="w-4/5 self-center my-2.5">
      <View className="flex-row items-center bg-white rounded-3xl border border-border px-3 py-2 shadow-sm">
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
          className="flex-1 text-base text-textprimary font-outfit min-h-10 py-2"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <View className="w-px h-8 bg-border mx-2" />
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