import React, { useState, useCallback, memo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeNavigation } from "@/hooks/navigationPage";

const COUPONS = [
  {
    id: "c1",
    code: "WELCOME50",
    discountLabel: "Flat ₹50 OFF",
    description: "On minimum booking of ₹299",
    validity: "Valid till 31 Jan 2026",
    terms: [
      "Applicable only on first booking.",
      "Minimum order value ₹299.",
      "Not valid with other offers.",
    ],
  },
  {
    id: "c2",
    code: "EVENT15",
    discountLabel: "15% OFF",
    description: "Up to ₹150 on event tickets",
    validity: "Valid till 15 Feb 2026",
    terms: [
      "Minimum booking ₹499.",
      "Maximum discount ₹150.",
      "Valid only on selected events.",
    ],
  },
  {
    id: "c3",
    code: "WEEKEND99",
    discountLabel: "Flat ₹99 OFF",
    description: "This weekend special on bookings ₹799+",
    validity: "Valid Sat and Sun only",
    terms: [
      "Valid only on Saturday and Sunday.",
      "Minimum order value ₹799.",
      "Limited redemptions per user.",
    ],
  },
];

export const CouponSectionCard = memo(function CouponSectionCard({
  appliedCouponCode,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white border border-primary/30 rounded-3xl p-4"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mr-3">
          <MaterialCommunityIcons
            name="ticket-percent"
            size={24}
            color="#02757A"
          />
        </View>

        <View className="flex-1">
          <Text className="text-base font-outfit-bold text-textprimary">
            Coupons
          </Text>
          <Text className="text-xs font-outfit text-textsecondary mt-1">
            {appliedCouponCode
              ? `Applied: ${appliedCouponCode}`
              : "Tap to view coupon codes"}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
});

export default function CouponScreen() {
  const { safeNavigation } = useSafeNavigation();

  const renderCoupon = useCallback(
    ({ item }) => {
      return (
        <View className="bg-white rounded-3xl border border-primary/25 p-4 mb-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center">
                <View className="px-3 py-1 rounded-full bg-primary/10 mr-2">
                  <Text className="text-xs font-outfit-bold text-primary">
                    {item.code}
                  </Text>
                </View>

                <Text className="text-xs font-outfit text-textsecondary">
                  {item.validity}
                </Text>
              </View>

              <Text className="text-lg font-outfit-bold text-textprimary mt-2">
                {item.discountLabel}
              </Text>
              <Text className="text-sm font-outfit text-textsecondary mt-1">
                {item.description}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-xs font-outfit-bold text-textprimary mb-2">
              Terms
            </Text>
            {item.terms.map((t, idx) => (
              <View key={`${item.id}-t-${idx}`} className="flex-row mb-1">
                <Text className="text-xs font-outfit text-textsecondary mr-2">
                  •
                </Text>
                <Text className="text-xs font-outfit text-textsecondary flex-1">
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    },
    []
  );

  return (
    <View className="flex-1 bg-white px-4">
      {/* Header */}
      <View className="pt-4 pb-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => safeNavigation("/")}
          activeOpacity={0.8}
          className="w-10 h-10 items-center justify-center rounded-full bg-primary/10"
        >
          <Ionicons name="arrow-back" size={20} color="#02757A" />
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <Text className="text-xl font-outfit-bold text-textprimary">
            Coupons
          </Text>
          <Text className="text-xs font-outfit text-textsecondary mt-1">
            View available coupon codes
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View className="mb-3">
            <View className="flex-row items-center bg-primary/5 border border-primary/15 rounded-3xl p-4">
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#02757A"
              />
              <Text className="text-xs font-outfit text-textsecondary ml-2 flex-1">
                Use these coupon codes during checkout to get discounts.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
