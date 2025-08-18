import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "@/styles/ProductCardStyles";

export default function ProductCard ({ productName, price, description, diatry }) {
  return (
    <View style={styles.card}>
      <Image 
        source={require('@/assets/images/food_placeholder.jpg')}
        style={styles.image}
      />
      <View>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.price}>Price: ₹{price}</Text>
        <Text style={styles.description}>{description}</Text>
        <View
          style={styles.diatryContainer}
        >
          { diatry &&
            diatry == 'veg' ? 
            <Image source={require('@/assets/images/veg.jpg')} style={styles.diatryIcon}/> : 
            <Image source={require('@/assets/images/non-veg.jpg')} style={styles.diatryIcon}/>
          }
          <Text
            style={styles.allergens}
          >
            No Allergens
          </Text>
        </View>
      </View>
    </View>
  )
}
