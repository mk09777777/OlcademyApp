import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-20">
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-outfit-bold color-gray-900 flex-1 text-center">Tiffin Service Details</Text>
          <View className="w-10" />
        </View>

        {/* Restaurant Image */}
        {restaurant.images && restaurant.images.length > 0 ? (
          <Image 
            source={{ uri: restaurant.images[0] }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-gray-400 items-center justify-center">
            <FontAwesome name="cutlery" size={50} color="#fff" />
          </View>
        )}

        <Text className="text-2xl font-outfit-bold color-gray-900 px-4 mt-4">{restaurant.kitchenName}</Text>

        <View className="flex-row items-center px-4 mt-2">
          <FontAwesome name="star" size={14} color="#ffcc00" />
          <Text className="text-base font-outfit-semibold color-gray-800 ml-1">{restaurant.ratings?.toFixed(1) || '4.4'}</Text>
          <Text className="text-sm font-outfit color-gray-600 ml-1">({formatReviewsCount()})</Text>
          
          <TouchableOpacity 
            className="ml-4 px-3 py-1 bg-primary rounded-full"
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
            <Text className="text-white text-sm font-outfit-semibold">View Reviews</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center px-4 mt-2">
          <MaterialCommunityIcons name="calendar-range" size={14} color="#555" />
          <Text className="text-sm font-outfit color-gray-600 ml-1">Available Plans: {formatMealPlans()}</Text>
        </View>

        <View className="flex-row items-center px-4 mt-2">
          <MaterialIcons name="delivery-dining" size={16} color="#555" />
          <Text className="text-sm font-outfit color-gray-600 ml-1 flex-1">{formatDeliveryCities()}</Text>
        </View>

        {/* Action Icons */}
        <View className="flex-row justify-around px-4 py-4 bg-gray-50 mx-4 mt-4 rounded-lg">
          {restaurant.ownerPhoneNo?.fullNumber && (
            <TouchableOpacity
              className="items-center py-2 px-3"
              onPress={() => Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`)}
            >
              <Ionicons name="call-outline" size={20} color="#007f3f" />
              <Text className="text-xs font-outfit color-gray-700 mt-1">Call</Text>
            </TouchableOpacity>
          )}

          {restaurant.deliveryCity && restaurant.deliveryCity.length > 0 && (
            <TouchableOpacity
              className="items-center py-2 px-3"
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.deliveryCity[0].split(',')[0]}`)}
            >
              <MaterialIcons name="directions" size={20} color="#007f3f" />
              <Text className="text-xs font-outfit color-gray-700 mt-1">Directions</Text>
            </TouchableOpacity>
          )}
          
          {restaurant.websiteURL && (
            <TouchableOpacity
              className="items-center py-2 px-3"
              onPress={() => Linking.openURL(restaurant.websiteURL)}
            >
              <MaterialCommunityIcons name="web" size={20} color="#007f3f" />
              <Text className="text-xs font-outfit color-gray-700 mt-1">Website</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            className="items-center py-2 px-3"
            onPress={() => {
              Share.share({
                message: `Check out ${restaurant.kitchenName} on TiffinStash!`,
                url: restaurant.websiteURL || 'https://tiffinstash.com',
                title: restaurant.kitchenName
              });
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#007f3f" />
            <Text className="text-xs font-outfit color-gray-700 mt-1">Share</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-px bg-border mx-4 my-4" />

        {/* About Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-outfit-bold color-gray-900 mb-3">About This Service</Text>
          <Text className="text-sm font-outfit color-gray-600 leading-5">
            {restaurant.additionalInfo || 'Premium home-style tiffin service with multiple meal options.'}
          </Text>
        </View>

        {/* Delivery Times */}
        {restaurant.deliveryTimeSlots && restaurant.deliveryTimeSlots.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Delivery Time Slots</Text>
            {restaurant.deliveryTimeSlots.map((slot, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
                <Text className="text-sm font-outfit color-gray-600 ml-2 flex-1">{slot}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Terms and Conditions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Terms & Conditions</Text>
          <Text className="text-sm font-outfit color-gray-600 leading-5">{restaurant.termsAndConditions}</Text>
        </View>

        {/* Additional Info */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Additional Information</Text>
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
            <Text className="text-sm font-outfit color-gray-600 ml-2 flex-1">Order Cut-off: 9:00 PM previous day</Text>
          </View>
          {restaurant.ownerPhoneNo?.fullNumber && (
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="phone" size={16} color="#555" />
              <Text className="text-sm font-outfit color-gray-600 ml-2 flex-1">Contact: {restaurant.ownerPhoneNo.fullNumber}</Text>
            </View>
          )}
          {restaurant.address && (
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="map-marker" size={16} color="#555" />
              <Text className="text-sm font-outfit color-gray-600 ml-2 flex-1">Address: {restaurant.address}</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View className="h-px bg-border mx-4 my-4" />

        {/* Feedback */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-outfit-bold color-gray-900 mb-3">Feedback</Text>
          <Text className="text-sm font-outfit color-gray-600 mb-4">Have questions or feedback about this service?</Text>
          <TouchableOpacity 
            className="bg-primary py-3 px-6 rounded-lg items-center"
            onPress={() => {
              if (restaurant.ownerPhoneNo?.fullNumber) {
                Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`);
              }
            }}
          >
            <Text className="text-white text-sm font-outfit-semibold">Contact Provider</Text>
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