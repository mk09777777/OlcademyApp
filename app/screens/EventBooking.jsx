import { View, Text, ScrollView, ImageBackground, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { getEventById } from '@/Data/EventData';

export default function EventBooking() {
  const { eventId, event } = useGlobalSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSection, setSelectedSection] = useState('General Admission');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { safeNavigation } = useSafeNavigation();

  useEffect(() => {
    if (eventId) {
      const found = getEventById(eventId);
      setEventDetails(found ?? null);
      return;
    }

    if (event) {
      try {
        setEventDetails(JSON.parse(event));
      } catch (parseError) {
        console.warn('Unable to parse event payload:', parseError);
        setEventDetails(null);
      }
    }
  }, [event, eventId]);

  useEffect(() => {
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

  const pricing = useMemo(() => ({
    general: eventDetails?.pricing?.general ?? 799,
    vip: eventDetails?.pricing?.vip ?? 1499,
  }), [eventDetails]);

  const ticketPrice = selectedSection === 'VIP' ? pricing.vip : pricing.general;
  const totalPrice = ticketCount * ticketPrice;
  const formattedTotal = totalPrice.toLocaleString('en-IN');
  const scheduleLabel = eventDetails
    ? `${eventDetails.date}${eventDetails.startTime ? ` | ${eventDetails.startTime}${eventDetails.endTime ? ` - ${eventDetails.endTime}` : ''}` : ''}`
    : '';

  const handleBooking = () => {
    if (!eventDetails) {
      return;
    }
    if (!buyerName.trim() || !buyerEmail.trim()) {
      Alert.alert('Please fill in your name and email before booking.');
      return;
    }
    // Mock payment success
    safeNavigation({
      pathname: '/screens/EventBookingSummary',
      params: {
        eventId: eventDetails.id,
        attendees: String(ticketCount),
        section: selectedSection,
        total: String(totalPrice),
        buyerName,
        buyerEmail,
      },
    });
  };

  if (!eventDetails) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          className="flex-1 bg-background"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 24 + keyboardOffset,
            paddingHorizontal: 16,
          }}
        >
          {/* Header Image */}
          <ImageBackground
            source={eventDetails.bannerImage || eventDetails.image}
            className="h-60 justify-end rounded-3xl overflow-hidden"
            imageStyle={{ borderRadius: 24 }}
          >
            <View className="p-4 pb-6 bg-black bg-opacity-40">
              <Text className="text-white text-2xl font-outfit-bold">{eventDetails.title}</Text>
              <Text className="text-white text-base font-outfit">{scheduleLabel}</Text>
            </View>
          </ImageBackground>

          {/* Booking Form */}
          <View className="pt-6 pb-10">
            <Text className="text-textprimary text-lg font-outfit-bold mb-3">
              Booking Details
            </Text>

            {/* Ticket Section */}
            <Text className="text-textsecondary font-outfit mb-1">Ticket Type</Text>
            {['General Admission', 'VIP'].map((type) => (
              <TouchableOpacity
                key={type}
                className={`py-3 px-4 border rounded-lg mb-2 ${
                  selectedSection === type ? 'border-primary' : 'border-border'
                }`}
                onPress={() => setSelectedSection(type)}
              >
                <Text
                  className={`font-outfit ${
                    selectedSection === type ? 'text-primary' : 'text-textprimary'
                  }`}
                >
                  {type} — ₹{type === 'VIP' ? pricing.vip : pricing.general}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Ticket Count */}
            <View className="mb-4 mt-4">
              <Text className="text-textsecondary font-outfit mb-1">Tickets</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="px-4 py-2 border rounded-l-lg"
                  onPress={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                >
                  <Text className="text-lg">−</Text>
                </TouchableOpacity>
                <View className="px-6 py-2 border-t border-b">
                  <Text className="text-lg">{ticketCount}</Text>
                </View>
                <TouchableOpacity
                  className="px-4 py-2 border rounded-r-lg"
                  onPress={() => setTicketCount((prev) => prev + 1)}
                >
                  <Text className="text-lg">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buyer Info */}
            <View className="mb-6">
              <Text className="text-textsecondary font-outfit mb-1">Full Name</Text>
              <TextInput
                className="border p-3 rounded-lg mb-3"
                placeholder="Enter your name"
                value={buyerName}
                onChangeText={setBuyerName}
              />
              <Text className="text-textsecondary font-outfit mb-1">Email</Text>
              <TextInput
                className="border p-3 rounded-lg"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={buyerEmail}
                onChangeText={setBuyerEmail}
              />
            </View>

            {/* Summary */}
            <View className="mb-6">
              <Text className="text-textprimary font-outfit">Section: {selectedSection}</Text>
              <Text className="text-textprimary font-outfit">Tickets: {ticketCount}</Text>
              <Text className="text-primary font-outfit-bold text-lg mt-2">
                Total: ₹{formattedTotal}
              </Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-lg items-center"
              onPress={handleBooking}
            >
              <Text className="text-white font-outfit-bold text-lg">Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
