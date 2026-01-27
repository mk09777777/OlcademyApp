import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ReportIssueScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [issueText, setIssueText] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const restaurantName = params.restaurantName || "Restaurant";

  const issueTypes = [
    { id: 'menu', label: 'Incorrect Menu/Prices', icon: 'restaurant-menu' },
    { id: 'hours', label: 'Wrong Opening Hours', icon: 'access-time' },
    { id: 'phone', label: 'Phone Number Invalid', icon: 'phone' },
    { id: 'other', label: 'Other', icon: 'error-outline' },
  ];

  const handleSubmit = () => {
    console.log("Reporting Issue:", { restaurant: restaurantName, type: selectedIssue, details: issueText });
    
    Alert.alert("Thank You", "Your report has been submitted and will be reviewed.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center p-4 bg-white border-b border-gray-200 ">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Report an Issue</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        
        <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <Text className="text-gray-800 text-xl font-bold mb-2">What's wrong?</Text>
          <Text className="text-gray-600 text-sm leading-5">
            Help us improve our data for <Text className="font-bold">{restaurantName}</Text>. 
            Let us know if you found incorrect information.
          </Text>
        </View>

        <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <Text className="text-gray-800 text-base font-bold mb-3">Select Issue Type</Text>
          <View className="flex-row flex-wrap justify-between">
            {issueTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedIssue(type.id)}
                className={`w-[48%] mb-3 p-3 rounded-lg border flex-row items-center justify-center ${
                  selectedIssue === type.id 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <MaterialIcons 
                  name={type.icon} 
                  size={18} 
                  color={selectedIssue === type.id ? '#E03546' : '#666'} 
                />
                <Text 
                  className={`ml-2 text-xs font-medium ${
                    selectedIssue === type.id ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

       <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <Text className="text-gray-800 text-base font-bold mb-3">Provide Details</Text>
          <TextInput
            className="bg-gray-50 rounded-lg border border-gray-200 text-gray-800 min-h-[120px] p-4 text-start"
            placeholder="Please describe the issue in detail..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            value={issueText}
            onChangeText={setIssueText}
          />
        </View>

        <View className="flex-row bg-white p-4 rounded-lg border border-gray-200 mb-6 items-center">
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
                <MaterialIcons name="support-agent" size={28} color="#02757A" />
            </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-bold text-base mb-1">Urgent Issue?</Text>
            <Text className="text-gray-500 text-sm">
              If this is regarding an active order, please contact support directly.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className={`p-4 rounded-lg mb-8 ${
            (issueText.trim() && selectedIssue) ? 'bg-red-500' : 'bg-gray-300'
          }`}
          disabled={!issueText.trim() || !selectedIssue}
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-center text-base">Submit Report</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default ReportIssueScreen;