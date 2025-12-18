import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-gray-900">
            Tiffin Service Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base text-gray-600">
            No tiffin service data available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDeliveryCities = () => {
    if (!restaurant?.deliveryCity || !Array.isArray(restaurant.deliveryCity)) {
      return "Delivery areas not specified";
    }
    const cities = restaurant.deliveryCity[0].split(", ").slice(0, 3);
    return `Serves: ${cities.join(", ")}${
      restaurant.deliveryCity[0].split(", ").length > 3 ? " and more..." : ""
    }`;
  };

  const formatMealPlans = () => {
    if (!restaurant.menu?.plans) return "No meal plans available";
    return restaurant.menu.plans
      .map((plan) => `${plan.label} Day${plan.label === "1" ? "" : "s"}`)
      .join(", ");
  };

  const formatReviewsCount = () => {
    if (!restaurant.reviews) return "No reviews yet";
    return `${restaurant.reviews.length} reviews`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-32">
          {/* HEADER */}
          <View className="flex-row items-center py-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full bg-white shadow"
            >
              <Ionicons name="chevron-back" size={22} color="#111" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-lg font-semibold text-gray-900">
              Tiffin Service Details
            </Text>
            <View className="w-8" />
          </View>

          {/* IMAGE */}
          <View className="bg-white rounded-2xl shadow mb-5 overflow-hidden">
            {restaurant.images && restaurant.images.length > 0 ? (
              <Image
                source={{ uri: restaurant.images[0] }}
                className="h-56 w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-56 items-center justify-center bg-gray-300">
                <FontAwesome name="cutlery" size={50} color="#fff" />
              </View>
            )}
          </View>

          {/* BASIC INFO */}
          <View className="bg-white rounded-2xl p-5 shadow mb-5">
            <Text
              className="text-xl font-bold text-gray-900 text-center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {restaurant.kitchenName}
            </Text>

            <View className="mt-3 flex-row items-center">
              <FontAwesome name="star" size={14} color="#FFC107" />
              <Text className="ml-2 text-base font-semibold text-gray-900">
                {restaurant.ratings?.toFixed(1) || "4.4"}
              </Text>
              <Text className="ml-1 text-sm text-gray-500">
                ({formatReviewsCount()})
              </Text>

              <TouchableOpacity
                className="ml-auto border border-primary rounded-full px-4 py-1"
                onPress={() =>
                  safeNavigation({
                    pathname: "/screens/Reviewsall",
                    params: {
                      firmId: restaurant.id,
                      restaurantName: restaurant.kitchenName,
                      averageRating: restaurant.ratings?.toFixed(1) || "4.4",
                      reviewCount: restaurant.reviews?.length || 0,
                    },
                  })
                }
              >
                <Text className="text-xs font-semibold text-primary">
                  View Reviews
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 space-y-2">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="calendar-range"
                  size={16}
                  color="#666"
                />
                <Text className="ml-2 text-sm text-gray-700">
                  Available Plans: {formatMealPlans()}
                </Text>
              </View>

              <View className="flex-row items-start">
                <MaterialIcons name="delivery-dining" size={16} color="#666" />
                <Text className="ml-2 flex-1 text-sm text-gray-700">
                  {formatDeliveryCities()}
                </Text>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View className="flex-row flex-wrap justify-center gap-4 mb-6">
            {restaurant.ownerPhoneNo?.fullNumber && (
              <TouchableOpacity
                className="flex-row items-center justify-center bg-primary/10 px-5 py-3 rounded-full min-w-[110]"
                onPress={() =>
                  Linking.openURL(
                    `tel:${restaurant.ownerPhoneNo.fullNumber.replace(
                      /\s/g,
                      ""
                    )}`
                  )
                }
              >
                <Ionicons name="call-outline" size={18} color="#02757A" />
                <Text className="ml-2 text-sm font-semibold text-primary">
                  Call
                </Text>
              </TouchableOpacity>
            )}

            {restaurant.deliveryCity && restaurant.deliveryCity.length > 0 && (
              <TouchableOpacity
                className="flex-row items-center justify-center bg-primary/10 px-5 py-3 rounded-full min-w-[110]"
                onPress={() =>
                  Linking.openURL(
                    `https://maps.google.com/?q=${
                      restaurant.deliveryCity[0].split(",")[0]
                    }`
                  )
                }
              >
                <MaterialIcons name="directions" size={18} color="#02757A" />
                <Text className="ml-2 text-sm font-semibold text-primary">
                  Directions
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-row items-center justify-center bg-primary/10 px-5 py-3 rounded-full min-w-[110]"
              onPress={() =>
                Share.share({
                  message: `Check out ${restaurant.kitchenName} on TiffinStash!`,
                })
              }
            >
              <Ionicons name="share-social-outline" size={18} color="#02757A" />
              <Text className="ml-2 text-sm font-semibold text-primary">
                Share
              </Text>
            </TouchableOpacity>
          </View>

          {/* ABOUT */}
          <View className="bg-white rounded-2xl p-5 shadow mb-5">
            <Text className="text-lg font-semibold text-gray-900">
              About This Service
            </Text>
            <Text className="mt-2 text-sm text-gray-700 leading-6">
              {restaurant.additionalInfo ||
                "Premium home-style tiffin service with multiple meal options."}
            </Text>
          </View>

          {/* DELIVERY SLOTS */}
          {restaurant.deliveryTimeSlots &&
            restaurant.deliveryTimeSlots.length > 0 && (
              <View className="bg-white rounded-2xl p-5 shadow mb-5">
                <Text className="text-lg font-semibold text-gray-900">
                  Delivery Time Slots
                </Text>
                {restaurant.deliveryTimeSlots.map((slot, index) => (
                  <View key={index} className="mt-2 flex-row items-center">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color="#666"
                    />
                    <Text className="ml-2 text-sm text-gray-700">{slot}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* TERMS */}
          <View className="bg-white rounded-2xl p-5 shadow mb-5">
            <Text className="text-lg font-semibold text-gray-900">
              Terms & Conditions
            </Text>
            <Text className="mt-2 text-sm text-gray-700 leading-6">
              {restaurant.termsAndConditions}
            </Text>
          </View>

          {/* ADDITIONAL INFO */}
          <View className="bg-white rounded-2xl p-5 shadow mb-5">
            <Text className="text-lg font-semibold text-gray-900">
              Additional Information
            </Text>

            {/* Order Cut-off */}
            <View className="mt-2 flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#666"
              />
              <Text className="ml-2 text-sm text-gray-700">
                Order Cut-off: 9:00 PM previous day
              </Text>
            </View>

            {/* Contact */}
            {restaurant.ownerPhoneNo?.fullNumber && (
              <TouchableOpacity
                className="mt-2 flex-row items-center"
                activeOpacity={0.6}
                onPress={() =>
                  Linking.openURL(
                    `tel:${restaurant.ownerPhoneNo.fullNumber.replace(
                      /\s/g,
                      ""
                    )}`
                  )
                }
              >
                <MaterialCommunityIcons name="phone" size={16} color="#000" />
                <Text className="ml-2 text-sm text-black">
                  Contact:{" "}
                  <Text className="text-primary">
                    {restaurant.ownerPhoneNo.fullNumber}
                  </Text>
                </Text>
              </TouchableOpacity>
            )}

            {/* Address */}
            {restaurant.address && (
              <TouchableOpacity
                className="mt-2 flex-row items-center"
                activeOpacity={0.6}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      restaurant.address
                    )}`
                  )
                }
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#000"
                />
                <Text className="ml-2 text-sm text-black">
                  Address:{" "}
                  <Text className="text-primary">{restaurant.address}</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* FEEDBACK */}
          <View className="bg-white rounded-2xl p-5 shadow">
            <Text className="text-lg font-semibold text-gray-900">
              Feedback
            </Text>
            <Text className="mt-2 text-sm text-gray-600">
              Have questions or feedback about this service?
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary py-3 rounded-xl items-center"
              onPress={() => {
                if (restaurant.ownerPhoneNo?.fullNumber) {
                  Linking.openURL(
                    `tel:${restaurant.ownerPhoneNo.fullNumber.replace(
                      /\s/g,
                      ""
                    )}`
                  );
                }
              }}
            >
              <Text className="text-base font-semibold text-white">
                Contact Provider
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          className="bg-primary py-4 rounded-xl items-center"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-white">
            Back to Menu
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RestaurantDetailsScreen;
