import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";

export default function EventBooking() {
  const [attendees, setAttendees] = useState(1);
  const { event } = useGlobalSearchParams();
  const { safeNavigation } = useSafeNavigation();

  const increment = () => setAttendees(attendees + 1);
  const decrement = () => setAttendees(attendees > 1 ? attendees - 1 : 1);

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-outfit-bold text-textprimary mb-8">
        Book Your Tickets
      </Text>

      <View className="bg-gray-100 rounded-2xl p-5 mb-6 flex-row items-center justify-between">
        <Text className="text-lg font-outfit text-textprimary">
          Number of People
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={decrement}
            className="bg-primary rounded-full w-9 h-9 items-center justify-center"
          >
            <Text className="text-white text-lg font-outfit-bold">-</Text>
          </TouchableOpacity>

          <Text className="text-lg font-outfit-bold mx-4">{attendees}</Text>

          <TouchableOpacity
            onPress={increment}
            className="bg-primary rounded-full w-9 h-9 items-center justify-center"
          >
            <Text className="text-white text-lg font-outfit-bold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          safeNavigation({
            pathname: "screens/EventBookingSummary",
            params: { event, attendees: attendees.toString() },
          })
        }
        className="bg-primary rounded-xl py-4 mt-8"
      >
        <Text className="text-white text-center text-lg font-outfit-bold">
          Proceed
        </Text>
      </TouchableOpacity>
    </View>
  );
}
