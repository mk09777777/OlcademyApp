import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";

export default function EventBookingSummary() {
  const { event, attendees } = useGlobalSearchParams();
  const eventDetails = JSON.parse(event);
  const { safeNavigation } = useSafeNavigation();

  const ticketPrice = 799;
  const totalCost = ticketPrice * parseInt(attendees || 1);

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-outfit-bold mb-6 text-textprimary">
        Booking Summary
      </Text>

      <View className="bg-gray-100 rounded-2xl p-5 mb-6">
        <Text className="text-lg font-outfit-bold text-textprimary">
          {eventDetails.title}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          {eventDetails.startingTime}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          Type: {eventDetails.type}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          Location: Rogers Center
        </Text>
      </View>

      <View className="border-y border-gray-300 py-4 mb-6">
        <Text className="text-base font-outfit text-textsecondary mb-2">
          Number of Attendees:{" "}
          <Text className="font-outfit-bold">{attendees}</Text>
        </Text>
        <Text className="text-base font-outfit text-textsecondary">
          Ticket Price:{" "}
          <Text className="font-outfit-bold">₹{ticketPrice}</Text>
        </Text>
      </View>

      <Text className="text-xl font-outfit-bold text-textprimary mb-6">
        Total: ₹{totalCost}
      </Text>

      <TouchableOpacity
        className="bg-primary rounded-xl py-4"
        onPress={() => safeNavigation("screens/BookingSuccess")}
      >
        <Text className="text-white text-center text-lg font-outfit-bold">
          Confirm Booking
        </Text>
      </TouchableOpacity>
    </View>
  );
}
