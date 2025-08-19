import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const ITEM_WIDTH = (width - 40) / NUM_COLUMNS;

const foodData = [
  { id: '1', name: 'Dosa', image: require('@/assets/images/dish.jpg') },
  { id: '2', name: 'Idli', image: require('@/assets/images/dish1.jpg') },
  { id: '3', name: 'Vada', image: require('@/assets/images/food5.jpg') },
  { id: '4', name: 'Sandwich', image: require('@/assets/images/food.jpg') },
  { id: '5', name: 'Wraps', image: require('@/assets/images/food1.jpg') },
  { id: '6', name: 'Puri', image: require('@/assets/images/food2.jpg') },
  { id: '7', name: 'Bonda', image: require('@/assets/images/food3.jpg') },
  { id: '8', name: 'Fries', image: require('@/assets/images/food4.jpg') },
];

const Whatsonyou = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.label}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What You Mind in SPICE TIFFINS</Text>
        <View style={styles.underline} />
      </View>
      <FlatList
        data={foodData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
    </View>
  );
};

export default Whatsonyou;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#3333',
    letterSpacing: 1,
    textTransform: 'uppercase',
    
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: '#FF6B6B', // You can change this color
    borderRadius: 3,
  },
  list: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});