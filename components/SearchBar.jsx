// SearchBar.jsx
import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet,} from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function SearchBar({ query, setQuery, isLoading, placeholder, onVoicePress }) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color="#6B7280" 
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder || "Search restaurants..."}
          value={query}
          onChangeText={setQuery}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <View style={styles.divider} />
        <TouchableOpacity 
          onPress={onVoicePress}
          style={styles.micButton}
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

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'outfit',
    minHeight: 40,
    paddingVertical: 8,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  micButton: {
    padding: 4,
  },
});