// SearchBar.jsx
import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet,} from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function SearchBar({ query, setQuery, isLoading, placeholder, onVoicePress }) {
  return (
    <View style={styles.searchContainer}>
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
                color="#6B7280" 
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
                  color="#6B7280" 
                />
              )}
            />
          ) : query ? (
            <TextInput.Icon
              icon="close"
              onPress={() => setQuery('')}
              color="#6B7280"
            />
          ) : (
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity 
                  onPress={onVoicePress}
                  style={styles.voiceButton}
                >
                  <MaterialIcons 
                    name="keyboard-voice" 
                    size={24} 
                    color="#3B82F6" 
                  />
                </TouchableOpacity>
              )}
            />
          )
        }
        style={styles.searchInput}
        outlineColor="#E5E7EB"
        activeOutlineColor="#3B82F6"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        theme={{
          roundness: 12,
          colors: {
            primary: '#3B82F6',
            background: '#FFFFFF',
            text: '#1F2937',
            placeholder: '#9CA3AF',
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 10,
    width: '80%',
    paddingHorizontal: 7,
  },
  searchInput: {
    backgroundColor: '#fff',
    fontFamily: 'outfit',
    fontSize: 14,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});