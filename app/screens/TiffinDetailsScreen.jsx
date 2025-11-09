import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Image, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeNavigation } from "@/hooks/navigationPage";

const RestaurantDetailsScreen = () => {
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();

  const params = useLocalSearchParams();
  const restaurant = params.restaurant ? JSON.parse(params.restaurant) : null;

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-100">
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg;font-semibold text-gray-900">
            Tiffin Service Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base text-gray-600">No tiffin service data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDeliveryCities = () => {
    if (!restaurant?.deliveryCity || !Array.isArray(restaurant.deliveryCity)) {
      return 'Delivery areas not specified';
    }
    const cities = restaurant.deliveryCity[0].split(', ').slice(0, 3);
    return `Serves: ${cities.join(', ')}${restaurant.deliveryCity[0].split(', ').length > 3 ? ' and more...' : ''}`;
  };

  const formatInstructions = () => {
    if (!restaurant.menu?.instructions) return 'No terms available';
    return restaurant.menu.instructions.map((inst) => `• ${inst.title}: ${inst.details}`).join('\n\n');
  };

  const formatMealPlans = () => {
    if (!restaurant.menu?.plans) return 'No meal plans available';
    return restaurant.menu.plans.map((plan) => `${plan.label} Day${plan.label === '1' ? '' : 's'}`).join(', ');
  };

  const formatMealPrices = () => {
    if (!restaurant.menu?.mealTypes) return [];

    return restaurant.menu.mealTypes.map((meal) => {
      const prices = [];
      if (meal.prices) {
        for (const [planId, price] of Object.entries(meal.prices)) {
          const plan = restaurant.menu.plans.find((p) => p._id === planId);
          if (plan) {
            prices.push(`${plan.label} Day${plan.label === '1' ? '' : 's'}: $${price.toFixed(2)}`);
          }
        }
      }
      return {
        label: meal.label,
        description: meal.description || 'No description available',
        prices: prices.join(' | '),
      };
    });
  };

  const formatReviewsCount = () => {
    if (!restaurant.reviews) return 'No reviews yet';
    return `${restaurant.reviews.length} reviews`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-5 pb-28">
          <View className="flex-row items-center py-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-100">
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-lg;font-semibold text-gray-900">
              Tiffin Service Details
            </Text>
            <View className="w-8" />
          </View>

          {restaurant.images && restaurant.images.length > 0 ? (
            <Image
              source={{ uri: restaurant.images[0] }}
              className="h-48 w-full rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <View className="h-48 w-full items-center justify-center rounded-2xl bg-gray-300">
              <FontAwesome name="cutlery" size={50} color="#fff" />
            </View>
          )}

          <Text className="mt-4 text-2xl font-bold text-gray-900">{restaurant.kitchenName}</Text>

          <View className="mt-3 flex-row items-center">
            <FontAwesome name="star" size={14} color="#ffcc00" />
            <Text className="ml-2 text-base;font-semibold text-gray-900">
              {restaurant.ratings?.toFixed(1) || '4.4'}
            </Text>
            <Text className="ml-1 text-sm text-gray-500">({formatReviewsCount()})</Text>
            <TouchableOpacity
              className="ml-auto rounded-full border border-primary px-3 py-1"
              onPress={() =>
                safeNavigation({
                  pathname: '/screens/Reviewsall',
                  params: {
                    firmId: restaurant.id,
                    restaurantName: restaurant.kitchenName,
                    averageRating: restaurant.ratings?.toFixed(1) || '4.4',
                    reviewCount: restaurant.reviews?.length || 0,
                  },
                })
              }
            >
              <Text className="text-xs font-semibold text-primary">View Reviews</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row items-center">
            <MaterialCommunityIcons name="calendar-range" size={16} color="#555" />
            <Text className="ml-2 text-sm text-gray-600">Available Plans: {formatMealPlans()}</Text>
          </View>

          <View className="mt-2 flex-row items-start">
            <MaterialIcons name="delivery-dining" size={16} color="#555" />
            <Text className="ml-2 flex-1 text-sm text-gray-700">{formatDeliveryCities()}</Text>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-3">
            {restaurant.ownerPhoneNo?.fullNumber && (
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-green-50 px-4 py-2"
                onPress={() => Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`)}
              >
                <Ionicons name="call-outline" size={20} color="#007f3f" />
                <Text className="ml-2 text-xs;font-semibold text-green-700">Call</Text>
              </TouchableOpacity>
            )}

            {restaurant.deliveryCity && restaurant.deliveryCity.length > 0 && (
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-green-50 px-4 py-2"
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.deliveryCity[0].split(',')[0]}`)}
              >
                <MaterialIcons name="directions" size={20} color="#007f3f" />
                <Text className="ml-2 text-xs;font-semibold text-green-700">Directions</Text>
              </TouchableOpacity>
            )}

            {restaurant.websiteURL && (
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-green-50 px-4 py-2"
                onPress={() => Linking.openURL(restaurant.websiteURL)}
              >
                <MaterialCommunityIcons name="web" size={20} color="#007f3f" />
                <Text className="ml-2 text-xs;font-semibold text-green-700">Website</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-row items-center rounded-2xl bg-green-50 px-4 py-2"
              onPress={() => {
                Share.share({
                  message: `Check out ${restaurant.kitchenName} on TiffinStash!`,
                  url: restaurant.websiteURL || 'https://tiffinstash.com',
                  title: restaurant.kitchenName,
                });
              }}
            >
              <Ionicons name="share-social-outline" size={20} color="#007f3f" />
              <Text className="ml-2 text-xs;font-semibold text-green-700">Share</Text>
            </TouchableOpacity>
          </View>

          <View className="my-6 h-px bg-gray-200" />

          <View className="mb-5">
            <Text className="text-lg font-semibold text-gray-900">About This Service</Text>
            <Text className="mt-2 text-sm text-gray-700 leading-5">
              {restaurant.additionalInfo || 'Premium home-style tiffin service with multiple meal options.'}
            </Text>
          </View>

          {restaurant.deliveryTimeSlots && restaurant.deliveryTimeSlots.length > 0 && (
            <View className="mb-5">
              <Text className="text-lg font-semibold text-gray-900">Delivery Time Slots</Text>
              {restaurant.deliveryTimeSlots.map((slot, index) => (
                <View key={index} className="mt-2 flex-row items-center">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
                  <Text className="ml-2 text-sm text-gray-700">{slot}</Text>
                </View>
              ))}
            </View>
          )}

          <View className="mb-5">
            <Text className="text-lg font-semibold text-gray-900">Terms & Conditions</Text>
            <Text className="mt-2 text-sm text-gray-700 leading-5">{restaurant.termsAndConditions}</Text>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-semibold text-gray-900">Additional Information</Text>
            <View className="mt-2 flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#555" />
              <Text className="ml-2 text-sm text-gray-700">Order Cut-off: 9:00 PM previous day</Text>
            </View>
            {restaurant.ownerPhoneNo?.fullNumber && (
              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="phone" size={16} color="#555" />
                <Text className="ml-2 text-sm text-gray-700">Contact: {restaurant.ownerPhoneNo.fullNumber}</Text>
              </View>
            )}
            {restaurant.address && (
              <View className="mt-2 flex-row items-center">
                <MaterialCommunityIcons name="map-marker" size={16} color="#555" />
                <Text className="ml-2 text-sm text-gray-700">Address: {restaurant.address}</Text>
              </View>
            )}
          </View>

          <View className="my-6 h-px bg-gray-200" />

          <View className="mb-5">
            <Text className="text-lg font-semibold text-gray-900">Feedback</Text>
            <Text className="mt-2 text-sm text-gray-600">Have questions or feedback about this service?</Text>
            <TouchableOpacity
              className="mt-3 items-center rounded-lg bg-primary py-3"
              onPress={() => {
                if (restaurant.ownerPhoneNo?.fullNumber) {
                  Linking.openURL(`tel:${restaurant.ownerPhoneNo.fullNumber.replace(/\s/g, '')}`);
                }
              }}
            >
              <Text className="text-base;font-semibold text-white">Contact Provider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <TouchableOpacity
          className="items-center rounded-lg bg-primary py-4"
          onPress={() => router.back()}
        >
          <Text className="text-base;font-semibold text-white">Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RestaurantDetailsScreen;
