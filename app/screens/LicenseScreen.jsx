import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import BackRouting from '@/components/BackRouting';

export default function LicenseScreen() {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleOptionPress = (path) => {
        setMenuVisible(false);
        router.push(path);
    };

    return (
        <>
            {/* Hide default header */}
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-white">

                {/* MAIN CONTENT WITH HEADER ROW */}
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 20,
                        paddingBottom: 50,
                    }}
                >
                    {/* ----------- HEADER ROW (BACK + TITLE) ----------- */}
                    {/* ----------- FIXED HEADER ROW (BACK LEFT + TITLE CENTER + MENU RIGHT) ----------- */}
                    <View className="flex-row items-center justify-between mb-4">
                        
                        {/* LEFT: BACK BUTTON */}
                        <View style={{ width: 40 }}>
                            <BackRouting />
                        </View>

                        {/* CENTER: TITLE */}
                        <Text className="text-lg font-extrabold text-gray-900 text-center flex-1">
                            License, Registration & Certification
                        </Text>

                        {/* RIGHT: MENU BUTTON */}
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ width: 40, alignItems: "flex-end" }}>
                            <Ionicons name="menu" size={28} color="#222" />
                        </TouchableOpacity>

                    </View>

                    {/* Divider */}
                    <View className="h-0.5 bg-gray-200 mb-6 mt-2" />

                    {/* ---------- CONTENT ---------- */}

                    <Text className="text-xl font-semibold mt-2 text-gray-900">
                        Brand Assets & Logo Usage
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                        All brand assets, icons, and design elements used within this application
                        are protected under intellectual property laws. Unauthorized reuse,
                        modification, or redistribution is strictly prohibited.
                    </Text>

                    <Text className="text-xl font-semibold mt-6 text-gray-900">
                        FSSAI Certification
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                        FSSAI License No: 10019064001810
                    </Text>

                    <Text className="text-xl font-semibold mt-6 text-gray-900">
                        State-wise GSTIN Information
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                        Applicable GSTIN details for operations across different Indian states.
                    </Text>

                    {/* TABLE */}
                    <View className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
                        {/* HEADER */}
                        <View className="flex-row bg-gray-100">
                            <Text className="flex-1 p-3 border-r border-gray-300 text-sm font-bold text-gray-800">
                                State
                            </Text>
                            <Text className="flex-1 p-3 border-r border-gray-300 text-sm font-bold text-gray-800">
                                GSTIN
                            </Text>
                            <Text className="flex-1 p-3 text-sm font-bold text-gray-800">
                                Address
                            </Text>
                        </View>

                        {/* ROWS */}
                        <View className="flex-row">
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                Karnataka
                            </Text>
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                29ABCDE1234F2Z5
                            </Text>
                            <Text className="flex-1 p-3 border-t border-gray-300 text-xs text-gray-700">
                                Bangalore
                            </Text>
                        </View>

                        <View className="flex-row">
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                Maharashtra
                            </Text>
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                Pending
                            </Text>
                            <Text className="flex-1 p-3 border-t border-gray-300 text-xs text-gray-700">
                                —
                            </Text>
                        </View>

                        <View className="flex-row">
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                Telangana
                            </Text>
                            <Text className="flex-1 p-3 border-r border-t border-gray-300 text-xs text-gray-700">
                                Pending
                            </Text>
                            <Text className="flex-1 p-3 border-t border-gray-300 text-xs text-gray-700">
                                —
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* ------- RIGHT SIDE DRAWER ------- */}
                <Modal visible={menuVisible} animationType="fade" transparent>
                    <View className="flex-1 flex-row bg-black/30">

                        {/* OVERLAY (LEFT SIDE) */}
                        <TouchableOpacity
                            className="flex-1"
                            onPress={() => setMenuVisible(false)}
                        />

                        {/* DRAWER ON RIGHT SIDE */}
                        <View className="w-56 bg-white p-5 pt-12 shadow-xl">
                            <Text className="text-lg font-bold mb-5">Menu</Text>

                            <TouchableOpacity onPress={() => handleOptionPress('/general')}>
                                <Text className="text-base py-2.5 border-b border-gray-200">General</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleOptionPress('/home/TakeAway')}>
                                <Text className="text-base py-2.5 border-b border-gray-200">Takeaway</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleOptionPress('/home/Dining')}>
                                <Text className="text-base py-2.5 border-b border-gray-200">Dining</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleOptionPress('/language')}>
                                <Text className="text-base py-2.5 border-b border-gray-200">Language</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
}
