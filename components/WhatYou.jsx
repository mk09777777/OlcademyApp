import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 80; // Fixed width for each item
const ITEM_MARGIN = 10; // Margin between items

const foodData = [
  { id: '1', name: 'Punjabi', image: require('@/assets/images/dish.jpg') },
  { id: '2', name: 'Gujarati', image: require('@/assets/images/dish1.jpg') },
  { id: '3', name: 'South Indian', image: require('@/assets/images/food5.jpg') },
  { id: '4', name: 'Indian', image: require('@/assets/images/food.jpg') },
  { id: '5', name: 'Marathi', image: require('@/assets/images/food1.jpg') },
  { id: '6', name: 'Jain', image: require('@/assets/images/food2.jpg') },
  { id: '7', name: 'Swaminarayan', image: require('@/assets/images/food3.jpg') },
];

const Whatsonyou = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WHAT'S ON YOUR MIND?</Text>
        <View style={styles.underline} />
      </View>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {foodData.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer}
            onPress={() => router.push({
              pathname: '/screens/tiffinonmind',
              params: { name: item?.name }
            })}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.label}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Whatsonyou;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: 'outfit-Bold',
    fontSize: 14,
    color: '#3333',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 5,
    fontFamily: 'outfit',
		fontSize: 16,
		color: '#222222',
    marginHorizontal: 7
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: '#FF6B6B', 
    borderRadius: 3,
  },
  horizontalList: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    // marginRight: ITEM_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});