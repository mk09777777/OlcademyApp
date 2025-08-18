import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define colors outside StyleSheet
const Colors = {
  primary: '#ff5252',
  black: '#000000',
  background: '#ffffff',
};

export default function BackRouting({ tittle }) {
  const router = useRouter();

  return (
    <View style={styles.titleContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color={Colors.black} />
      </TouchableOpacity>
      <Text style={styles.title}>{tittle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 10,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
