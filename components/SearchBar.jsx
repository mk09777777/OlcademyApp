// SearchBar.jsx
import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import styles from '@/styles/Collection';

export default function SearchBar({ query, setQuery, isLoading, placeholder, onVoicePress }) {
  return (
    <View style={[styles.searchContainer, { alignSelf: 'stretch' }]}>
      <TextInput
        mode="outlined"
        placeholder={placeholder || "Search restaurants..."}
        value={query}
        onChangeText={setQuery}
        left={
          <TextInput.Icon 
            icon={() => (
              <MaterialCommunityIcons 
                name="magnify" 
                size={24} 
                color="#666" 
              />
            )} 
          />
        }
        right={
          isLoading ? (
            <TextInput.Icon
              icon={() => (
                <ActivityIndicator 
                  size="small" 
                  color="#666" 
                />
              )}
            />
          ) : query ? (
            <TextInput.Icon
              icon="close"
              onPress={() => setQuery('')}
              color="#666"
            />
          ) : (
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity onPress={onVoicePress}>
                  <MaterialIcons name="keyboard-voice" size={24} color="black" />
                </TouchableOpacity>
              )}
            />
          )
        }
        style={[styles.searchInput, { flexGrow: 1, flexShrink: 1, minWidth: 0 }]}
        outlineColor="#ddd"
        activeOutlineColor="#E41E3F"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}