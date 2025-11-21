import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/TakewayCollection';
import { Colors } from '../components/constants';

const RestaurantCard = ({ restaurant, onPress }) => {
  const { 
    name, 
    rating, 
    time, 
    distance, 
    type, 
    priceForOne, 
    image, 
    offer, 
    offers 
  } = restaurant;
  const RatingBadge = ({ rating }) => (
    <View style={styles.ratingBadge}>
      <Text style={styles.ratingText}>{rating}★</Text>
    </View>
  );  
  return (
    <TouchableOpacity style={styles.restaurantCard} onPress={onPress} activeOpacity={0.7}>
      <Image source={image} style={styles.restaurantImage} />
      <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={(e) => {
                e.stopPropagation();
                toggleBookmark(item.id);
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={item.isBookmarked ? "bookmark" : "bookmark-border"} 
                size={24} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
      <View style={styles.restaurantInfo}>
        <View style={styles.timeDistance}>
          <Text style={styles.timeDistanceText}>{time} mins • {distance}</Text>
        </View>
        <Text style={styles.restaurantName}>{name}</Text>
        <View style={styles.typePrice}>
          <Text style={styles.typeText}>{type}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.priceText}>₹{priceForOne} for one</Text>
        </View>
        {rating && <RatingBadge rating={rating} />}
        {(offer || offers) && (
          <View style={styles.offerContainer}>
            {offer && <Text style={styles.offerText}>{offer}</Text>}
            {offers && offers.map((offerText, index) => (
              <Text key={index} style={styles.offerText}>{offerText}</Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default RestaurantCard;