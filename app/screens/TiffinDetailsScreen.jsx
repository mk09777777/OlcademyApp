import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RestaurantDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const restaurant = params.restaurant ? JSON.parse(params.restaurant) : null;

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tiffin Service Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No tiffin service data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format delivery cities for display
  const formatDeliveryCities = () => {
    if (!restaurant?.deliveryCity || !Array.isArray(restaurant.deliveryCity)) {
      return 'Delivery areas not specified';
    }
    const cities = restaurant.deliveryCity[0].split(', ').slice(0, 3);
    return `Serves: ${cities.join(', ')}${restaurant.deliveryCity[0].split(', ').length > 3 ? ' and more...' : ''}`;
  };

  // Format instructions for display
  const formatInstructions = () => {
    if (!restaurant.menu?.instructions) return 'No terms available';
    return restaurant.menu.instructions.map(inst => `• ${inst.title}: ${inst.details}`).join('\n\n');
  };

  // Format meal plans for display
  const formatMealPlans = () => {
    if (!restaurant.menu?.plans) return 'No meal plans available';
    return restaurant.menu.plans.map(plan => `${plan.label} Day${plan.label === '1' ? '' : 's'}`).join(', ');
  };

  // Format meal types with prices
  const formatMealPrices = () => {
    if (!restaurant.menu?.mealTypes) return [];
    
    return restaurant.menu.mealTypes.map(meal => {
      const prices = [];
      if (meal.prices) {
        for (const [planId, price] of Object.entries(meal.prices)) {
          const plan = restaurant.menu.plans.find(p => p._id === planId);
          if (plan) {
            prices.push(`${plan.label} Day${plan.label === '1' ? '' : 's'}: $${price.toFixed(2)}`);
          }
        }
      }
      return {
        label: meal.label,
        description: meal.description || 'No description available',
        prices: prices.join(' | ')
      };
    });
  };

  // Format reviews count
  const formatReviewsCount = () => {
    if (!restaurant.reviews) return 'No reviews yet';
    return `${restaurant.reviews.length} reviews`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tiffin Service Details</Text>
        </View>

        {/* Restaurant Image */}
        {restaurant.images && restaurant.images.length > 0 ? (
          <Image 
            source={{ uri: restaurant.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome name="cutlery" size={50} color="#fff" />
          </View>
        )}

        <Text style={styles.title}>{restaurant.kitchenName}</Text>

        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={14} color="#ffcc00" />
          <Text style={styles.ratingText}>{restaurant.ratings?.toFixed(1) || '4.4'}</Text>
          <Text style={styles.ratingCount}>({formatReviewsCount()})</Text>
          
          <TouchableOpacity 
            style={styles.viewReviewsButton}
            onPress={() => router.push({
              pathname: '/screens/Reviewsall',
              params: {
                firmId: restaurant.id,
                restaurantName: restaurant.kitchenName,
                averageRating: restaurant.ratings?.toFixed(1) || '4.4',
                reviewCount: restaurant.reviews?.length || 0
              }
            })}
          >
            <Text style={styles.viewReviewsText}>View Reviews</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          <MaterialCommunityIcons name="calendar-range" size={14} color="#555" />
          Available Plans: {formatMealPlans()}
        </Text>

        <View style={styles.addressContainer}>
          <MaterialIcons name="delivery-dining" size={16} color="#555" />
          <Text style={styles.address}>{formatDeliveryCities()}</Text>
        </View>

        {/* Action Icons */}
        <View style={styles.actionsRow}>
          {restaurant.ownerPhoneNo?.fullNumber && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`)}
            >
              <Ionicons name="call-outline" size={20} color="#007f3f" />
              <Text style={styles.iconButtonText}>Call</Text>
            </TouchableOpacity>
          )}

          {restaurant.deliveryCity && restaurant.deliveryCity.length > 0 && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.deliveryCity[0].split(',')[0]}`)}
            >
              <MaterialIcons name="directions" size={20} color="#007f3f" />
              <Text style={styles.iconButtonText}>Directions</Text>
            </TouchableOpacity>
          )}
          
          {restaurant.websiteURL && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL(restaurant.websiteURL)}
            >
              <MaterialCommunityIcons name="web" size={20} color="#007f3f" />
              <Text style={styles.iconButtonText}>Website</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
              Share.share({
                message: `Check out ${restaurant.kitchenName} on TiffinStash!`,
                url: restaurant.websiteURL || 'https://tiffinstash.com',
                title: restaurant.kitchenName
              });
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#007f3f" />
            <Text style={styles.iconButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.infoText}>
            {restaurant.additionalInfo || 'Premium home-style tiffin service with multiple meal options.'}
          </Text>
        </View>

        {/* Delivery Times */}
        {restaurant.deliveryTimeSlots && restaurant.deliveryTimeSlots.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Time Slots</Text>
            {restaurant.deliveryTimeSlots.map((slot, index) => (
              <View key={index} style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
                <Text style={styles.infoText}>{slot}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text style={styles.infoText}>{restaurant.termsAndConditions}</Text>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
            <Text style={styles.infoText}>Order Cut-off: 9:00 PM previous day</Text>
          </View>
          {restaurant.ownerPhoneNo?.fullNumber && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={16} color="#555" />
              <Text style={styles.infoText}>Contact: {restaurant.ownerPhoneNo.fullNumber}</Text>
            </View>
          )}
          {restaurant.address && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#555" />
              <Text style={styles.infoText}>Address: {restaurant.address}</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <Text style={styles.feedbackText}>Have questions or feedback about this service?</Text>
          <TouchableOpacity 
            style={styles.feedbackButton}
            onPress={() => {
              if (restaurant.ownerPhoneNo?.fullNumber) {
                Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`);
              }
            }}
          >
            <Text style={styles.feedbackButtonText}>Contact Provider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-border">
        <TouchableOpacity
          className="bg-primary py-4 items-center rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white text-base font-outfit-bold">Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default RestaurantDetailsScreen;