import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// import InputBoxStyles from "../styles/InputBox";

export default function InputModalEdit({ name2, contact2, update, toggle }) {
  const [name, setName] = useState(name2 || "");
  const [contact, setContact] = useState(contact2 || "");

  useEffect(() => {

    setName(name2 || "");
    setContact(contact2 || "");
  }, [name2, contact2]);

  const handleSubmit = () => {
    if (!name.trim() || !contact.trim()) {
      Alert.alert("Please enter valid details");
      return;
    }
    update(name, contact); 
    toggle(); 
  };

  return (
    <View className="flex-1 bg-black/50 justify-center items-center">
      <View className="bg-white rounded-lg p-6 mx-4 w-80">
        <View className="mb-4">
          <Text className="text-xl font-bold text-center">Enter your details</Text>
        </View>

        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
          placeholder="Enter your contact"
          keyboardType="numeric"
          value={contact}
          onChangeText={setContact}
        />

        <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 py-3 rounded-lg items-center">
          <Text className="text-white font-semibold text-base">Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
