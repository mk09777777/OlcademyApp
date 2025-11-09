import React, { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MotiView, MotiText } from "moti";
import { MaterialIcons } from "@expo/vector-icons";
import { getEventById } from "@/Data/EventData";

export default function BookingSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { eventName, attendees, autoRedirect, eventId, buyerEmail } = params;

  const resolvedEventName = useMemo(() => {
    if (eventName) {
      return eventName;
    }
    if (eventId) {
      const found = getEventById(eventId);
      return found?.title ?? "the event";
    }
    return "the event";
  }, [eventId, eventName]);

  const attendeeLabel = attendees ?? "1";

  useEffect(() => {
    if (autoRedirect === "true") {
      const timer = setTimeout(() => {
        router.replace("/home/Events");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoRedirect, router]);

  const handleOkClick = () => {
    router.replace("/home/Events");
  };

  return (
    <MotiView
      className="flex-1 bg-white justify-center items-center p-5"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 500 }}
    >
      {/* ✅ Success Icon */}
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1.4 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 10,
          delay: 200,
        }}
      >
        <MaterialIcons name="check-circle" size={90} color="#4CAF50" />
      </MotiView>

      {/* ✅ Title */}
      <MotiText
        className="text-2xl font-outfit-bold text-textprimary mt-6 mb-2"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 500 }}
      >
        Booking Confirmed!
      </MotiText>

      {/* ✅ Message */}
      <MotiText
        className="text-base text-textsecondary text-center font-outfit mb-4"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 700 }}
      >
        Your tickets for{" "}
        <Text className="font-outfit-bold text-textprimary">
          {resolvedEventName}
        </Text>{" "}
        have been successfully booked.
      </MotiText>

      {/* ✅ Attendee Count */}
      <MotiText
        className="text-sm text-textsecondary font-outfit mb-2"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400, delay: 900 }}
      >
        Number of Attendees:{" "}
        <Text className="font-outfit-bold text-textprimary">
          {attendeeLabel}
        </Text>
      </MotiText>

      {buyerEmail ? (
        <MotiText
          className="text-xs text-textsecondary font-outfit"
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 400, delay: 1100 }}
        >
          Confirmation sent to {buyerEmail}.
        </MotiText>
      ) : null}

      {/* ✅ Auto-redirect Info */}
      {autoRedirect === "true" && (
        <MotiText
          className="text-xs text-textsecondary mt-2 font-outfit"
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 400, delay: 1400 }}
        >
          Redirecting you back to Events...
        </MotiText>
      )}

      {/* ✅ OK Button */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 300, delay: 1600 }}
      >
        <TouchableOpacity
          className="bg-primary py-3 px-8 rounded-full mt-8 shadow-sm"
          onPress={handleOkClick}
        >
          <Text className="text-white font-outfit-bold text-base">OK</Text>
        </TouchableOpacity>
      </MotiView>
    </MotiView>
  );
}
