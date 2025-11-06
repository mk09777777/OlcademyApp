import { View, Text, ScrollView, ImageBackground, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { Ionicons } from '@expo/vector-icons';

export default function EventBooking() {
  const { event } = useGlobalSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSection, setSelectedSection] = useState('General Admission');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const { safeNavigation } = useSafeNavigation();

  useEffect(() => {
    if (event) {
      setEventDetails(JSON.parse(event));
    }
  }, [event]);

  const ticketPrice = selectedSection === 'VIP' ? 1499 : 799;
  const totalPrice = ticketCount * ticketPrice;

  const handleBooking = () => {
    if (!buyerName.trim() || !buyerEmail.trim()) {
      Alert.alert('Please fill in your name and email before booking.');
      return;
    }
    // Mock payment success
    Alert.alert(
      'Proceed to Payment',
      `Amount: ₹${totalPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => {
            setPaymentDone(true);
            Alert.alert('Payment Successful!', 'Your booking has been confirmed.');
          } 
        }
      ]
    );
  };

  if (!eventDetails) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header Image */}
      <ImageBackground
        source={eventDetails.image}
        className="h-60 justify-end"
      >
        <View className="p-4 pb-6 bg-black bg-opacity-40">
          <Text className="text-white text-2xl font-outfit-bold">{eventDetails.title}</Text>
          <Text className="text-white text-base font-outfit">Sat, Feb 8 | 6PM onwards</Text>
        </View>
      </ImageBackground>

      {/* Booking Form */}
      {!paymentDone ? (
        <View className="p-4">
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
                {type} — ₹{type === 'VIP' ? '1499' : '799'}
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
              Total: ₹{totalPrice}
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
      ) : (
        // Confirmation View after payment
        <View className="p-6 items-center">
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
          <Text className="text-2xl font-outfit-bold text-green-600 mt-4">
            Booking Confirmed!
          </Text>
          <Text className="text-textsecondary text-center mt-2">
            Your tickets for {eventDetails.title} have been successfully booked.
          </Text>
          <Text className="text-primary font-outfit mt-2">
            You will receive confirmation at {buyerEmail}.
          </Text>

          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg mt-6"
            onPress={() => safeNavigation('/home/LiveShows')}
          >
            <Text className="text-white font-outfit-bold">Back to Events</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
