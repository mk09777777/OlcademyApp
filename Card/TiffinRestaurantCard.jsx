import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/TiffinCollection';
const TiffinRestaurantCard = ({ restaurant, onPress }) => {
  const { 
    rating, 
    deliveryTime, 
    distance, 
    speciality, 
    pricePerDay, 
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
      <View style={styles.restaurantInfo}>
        <View style={styles.timeDistance}>
          <Text style={styles.timeDistanceText}>
            {deliveryTime} mins • {distance}
          </Text>
        </View>
        <Text style={styles.restaurantName}>{name}</Text>
        <View style={styles.typePrice}>
          <Text style={styles.typeText}>{speciality}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.priceText}>₹{pricePerDay} per day</Text>
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

export default TiffinRestaurantCard;