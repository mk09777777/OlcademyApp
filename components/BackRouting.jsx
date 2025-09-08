import React from 'react';
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BackRouting({ tittle }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-center p-2.5 bg-white relative">
      <TouchableOpacity onPress={() => router.back()} className="absolute left-2.5 p-1">
        <Ionicons name="chevron-back" size={30} color="#000000" />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-textprimary">{tittle}</Text>
    </View>
  );
}
