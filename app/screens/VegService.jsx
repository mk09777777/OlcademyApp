import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TiffinCard from '../../components/TiffinCard';
import tiffinData from '../../Data/tiffin.json';
import SearchBar from '../../components/SearchBar';
import { useSafeNavigation } from '@/hooks/navigationPage';
export default function VegService() {
  const [query, setQuery] = useState('');
  const [vegTiffins, setVegTiffins] = useState([]);
  const router = useRouter();
 const { safeNavigation } = useSafeNavigation();
  useEffect(() => {
    const filtered = tiffinData.filter(tiffin => 
      tiffin.Title.toLowerCase().includes('veg') && 
      !tiffin.Title.toLowerCase().includes('non-veg')
    );
    setVegTiffins(filtered);
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      const filtered = tiffinData.filter(tiffin => 
        tiffin.Title.toLowerCase().includes('veg') && 
        !tiffin.Title.toLowerCase().includes('non-veg')
      );
      setVegTiffins(filtered);
    } else {
      const searchQuery = text.toLowerCase();
      const filtered = tiffinData.filter(tiffin => 
        tiffin.Title.toLowerCase().includes('veg') && 
        !tiffin.Title.toLowerCase().includes('non-veg') &&
        (tiffin.Title.toLowerCase().includes(searchQuery) ||
        (tiffin['Meal Types'] && tiffin['Meal Types'].some(type => 
          type.toLowerCase().includes(searchQuery)
        )))
      );
      setVegTiffins(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vegetarian Tiffin Services</Text>
      </View>

      <SearchBar
        query={query}
        setQuery={handleSearch}
        placeholder="Search vegetarian tiffins..."
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {vegTiffins.length > 0 ? (
          vegTiffins.map((tiffin) => (
            <View key={tiffin.Title} style={styles.cardContainer}>
              <TiffinCard
                firm={{
                  id: tiffin.Title,
                  name: tiffin.Title,
                  rating: tiffin.Rating,
                  cuisineType: tiffin['Meal Types']?.[0] || 'Various',
                  image: tiffin.Images?.[0] || require('../../assets/images/food.jpg'),
                  priceRange: Object.values(tiffin.Prices)[0] || 'N/A',
                }}
                onPress={() => safeNavigation({
                  pathname: '/screens/TiffinDetails',
                  params: { title: tiffin.Title }
                })}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vegetarian tiffin services found</Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
