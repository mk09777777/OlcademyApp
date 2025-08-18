import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/TakewayCollection';
const DishCard = ({ dish }) => {
  const { 
    name, 
    price, 
    originalPrice, 
    rating, 
    reviews, 
    isVeg, 
    customizable, 
    quantity,
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
        {quantity && <Text style={styles.quantityText}>{quantity}</Text>}
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
        <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => toggleBookmark(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={item.isBookmarked ? "bookmark" : "bookmark-border"} 
                size={24} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD{customizable ? ' +' : ''}</Text>
        </TouchableOpacity>
        {customizable && (
          <Text style={styles.customizableText}>customizable</Text>
        )}
      </View>
    </View>
  );
};
export default DishCard;