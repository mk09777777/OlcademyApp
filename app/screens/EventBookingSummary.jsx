import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import { getEventById } from "@/Data/EventData";

export default function EventBookingSummary() {
  const {
    eventId,
    event,
    attendees = '1',
    section = 'General Admission',
    total,
    buyerName,
    buyerEmail,
  } = useGlobalSearchParams();
  const { safeNavigation } = useSafeNavigation();

  const parsedEvent = React.useMemo(() => {
    if (eventId) {
      return getEventById(eventId) ?? null;
    }

    if (event) {
      try {
        return JSON.parse(event);
      } catch (parseError) {
        console.warn('Unable to parse event payload:', parseError);
        return null;
      }
    }

    return null;
  }, [event, eventId]);

  if (!parsedEvent) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-base font-outfit text-textsecondary text-center">
          We could not load the booking details for this event.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-xl"
          onPress={() => safeNavigation('/home/Events')}
        >
          <Text className="text-white font-outfit-bold">Back to Events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const attendeeCount = Math.max(parseInt(attendees, 10) || 1, 1);
  const sectionKey = section === 'VIP' ? 'vip' : 'general';
  const ticketPrice = parsedEvent.pricing?.[sectionKey] ?? 799;
  const parsedTotal = Number(total);
  const totalCost = Number.isFinite(parsedTotal) && parsedTotal > 0
    ? parsedTotal
    : attendeeCount * ticketPrice;
  const formattedTotal = totalCost.toLocaleString('en-IN');
  const ticketLabel = ticketPrice.toLocaleString('en-IN');

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-outfit-bold mb-6 text-textprimary">
        Booking Summary
      </Text>

      <View className="bg-gray-100 rounded-2xl p-5 mb-6">
        <Text className="text-lg font-outfit-bold text-textprimary">
          {parsedEvent.title}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          {parsedEvent.date} • {parsedEvent.startTime}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          Category: {parsedEvent.category?.toUpperCase()}
        </Text>
        <Text className="text-sm text-textsecondary mt-1">
          Location: {parsedEvent.location}
        </Text>
      </View>

      <View className="border-y border-gray-300 py-4 mb-6">
        <Text className="text-base font-outfit text-textsecondary mb-2">
          Number of Attendees:{" "}
          <Text className="font-outfit-bold">{attendeeCount}</Text>
        </Text>
        <Text className="text-base font-outfit text-textsecondary">
          Ticket Price:{" "}
          <Text className="font-outfit-bold">₹{ticketLabel}</Text>
        </Text>
        <Text className="text-base font-outfit text-textsecondary mt-2">
          Section:{" "}
          <Text className="font-outfit-bold">{section}</Text>
        </Text>
      </View>

      <Text className="text-xl font-outfit-bold text-textprimary mb-6">
        Total: ₹{formattedTotal}
      </Text>

      {buyerName || buyerEmail ? (
        <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          {buyerName ? (
            <Text className="text-sm font-outfit text-textsecondary">
              Booking under:{" "}
              <Text className="font-outfit-bold text-textprimary">{buyerName}</Text>
            </Text>
          ) : null}
          {buyerEmail ? (
            <Text className="text-sm font-outfit text-textsecondary mt-1">
              Confirmation will be sent to:{" "}
              <Text className="font-outfit-bold text-textprimary">{buyerEmail}</Text>
            </Text>
          ) : null}
        </View>
      ) : null}

      <TouchableOpacity
        className="bg-primary rounded-xl py-4"
        onPress={() => safeNavigation({
          pathname: '/screens/BookingSuccess',
          params: {
            eventId: parsedEvent.id,
            eventName: parsedEvent.title,
            attendees: String(attendeeCount),
            buyerEmail,
            autoRedirect: 'true',
          },
        })}
      >
        <Text className="text-white text-center text-lg font-outfit-bold">
          Confirm Booking
        </Text>
      </TouchableOpacity>
    </View>
  );
}
