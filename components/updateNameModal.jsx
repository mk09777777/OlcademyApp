import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import InputBoxStyles from "../styles/InputBox";

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
    <View style={InputBoxStyles.background}>
      <View style={InputBoxStyles.inputContainer}>
        <View style={InputBoxStyles.headingContainer}>
          <Text style={InputBoxStyles.headingText}>Enter your details</Text>
        </View>

        <TextInput
          style={InputBoxStyles.inputBox}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={InputBoxStyles.inputBox}
          placeholder="Enter your contact"
          keyboardType="numeric"
          value={contact}
          onChangeText={setContact}
        />

        <TouchableOpacity onPress={handleSubmit} style={InputBoxStyles.ConfirmButton}>
          <Text style={InputBoxStyles.ConfirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
