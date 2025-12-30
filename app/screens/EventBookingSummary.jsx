import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useSafeNavigation } from "@/hooks/navigationPage";
import { fetchEventById } from "@/services/eventService";
import { transformEventPayload } from "@/utils/eventUtils";

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
  const [keyboardOffset, setKeyboardOffset] = React.useState(0);
  const [eventDetails, setEventDetails] = React.useState(null);
  const [loadingEvent, setLoadingEvent] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  React.useEffect(() => {
    const handleShow = (event) => {
      setKeyboardOffset(event.endCoordinates?.height ?? 0);
    };

    const handleHide = () => {
      setKeyboardOffset(0);
    };

    const showListener = Keyboard.addListener('keyboardDidShow', handleShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', handleHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const assignEvent = (payload) => {
      if (!isMounted) {
        return;
      }
      const normalized = transformEventPayload(payload);
      setEventDetails(normalized ?? null);
      setLoadError(normalized ? null : new Error('Event not found'));
    };

    const hydrate = async () => {
      if (eventId) {
        setLoadingEvent(true);
        try {
          const fetched = await fetchEventById(eventId);
          assignEvent(fetched);
        } catch (error) {
          console.warn('Unable to load event summary', error);
          if (isMounted) {
            setEventDetails(null);
            setLoadError(error);
          }
        } finally {
          if (isMounted) {
            setLoadingEvent(false);
          }
        }
        return;
      }

      if (event) {
        try {
          const parsed = JSON.parse(event);
          assignEvent(parsed);
        } catch (parseError) {
          console.warn('Unable to parse event payload:', parseError);
          if (isMounted) {
            setEventDetails(null);
            setLoadError(parseError);
          }
        }
      }

      if (isMounted) {
        setLoadingEvent(false);
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [event, eventId]);

  if (loadingEvent) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <ActivityIndicator size="large" color="#02757A" />
        <Text className="text-base font-outfit text-textsecondary mt-3">
          Loading booking details...
        </Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-base font-outfit text-textsecondary text-center">
          {loadError ? 'We could not load the booking details for this event.' : 'Event not found.'}
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
  const ticketPrice = eventDetails.pricing?.[sectionKey] ?? 799;
  const parsedTotal = Number(total);
  const totalCost = Number.isFinite(parsedTotal) && parsedTotal > 0
    ? parsedTotal
    : attendeeCount * ticketPrice;
  const formattedTotal = totalCost.toLocaleString('en-IN');
  const ticketLabel = ticketPrice.toLocaleString('en-IN');

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 40 + keyboardOffset,
          }}
        >
          <View className="bg-white">
            <Text className="text-2xl font-outfit-bold mb-6 text-textprimary">
              Booking Summary
            </Text>

            <View className="bg-gray-100 rounded-2xl p-5 mb-6">
              <Text className="text-lg font-outfit-bold text-textprimary">
                {eventDetails.title}
              </Text>
              <Text className="text-sm text-textsecondary mt-1">
                {(eventDetails.dateLabel || eventDetails.date) ?? ''} • {eventDetails.startTime}
              </Text>
              <Text className="text-sm text-textsecondary mt-1">
                Category: {eventDetails.category?.toUpperCase()}
              </Text>
              <Text className="text-sm text-textsecondary mt-1">
                Location: {eventDetails.location || eventDetails.venue}
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
                  eventId: eventDetails.id,
                  eventName: eventDetails.title,
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
