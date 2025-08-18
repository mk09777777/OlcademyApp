import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/TiffinCollection';

const TiffinDishCard = ({ dish }) => {
  const { 
    name, 
    price, 
    originalPrice, 
    rating, 
    reviews, 
    isVeg, 
    customizable,
    mealType,
    image 
  } = dish;

  const VegIcon = () => (
    <View style={styles.vegIcon}>
      <View style={styles.vegInner}>
        <View style={styles.vegDot} />
      </View>
    </View>
  );

  return (
    <View style={styles.dishCard}>
      <View style={styles.dishLeft}>
        {isVeg && <VegIcon />}
        <Text style={styles.dishName}>{name}</Text>
        <Text style={styles.quantityText}>{mealType}</Text>
        {rating && (
          <View style={styles.dishRating}>
            <Text style={styles.ratingStars}>{'★'.repeat(Math.floor(rating))}</Text>
            <Text style={styles.reviewCount}>({reviews})</Text>
          </View>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.dishPrice}>₹{price}</Text>
          {originalPrice && (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          )}
        </View>
      </View>
      <View style={styles.dishRight}>
        <Image source={image} style={styles.dishImage} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>SUBSCRIBE{customizable ? ' +' : ''}</Text>
        </TouchableOpacity>
        {customizable && (
          <Text style={styles.customizableText}>customizable</Text>
        )}
      </View>
    </View>
  );
};

export default TiffinDishCard;