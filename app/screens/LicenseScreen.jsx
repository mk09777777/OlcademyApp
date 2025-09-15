import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackRouting from '@/components/BackRouting';

export default function LicenseScreen() {
    /* Original CSS Reference:
     * container: { flex: 1, paddingTop: 0, paddingHorizontal: 20, backgroundColor: '#fff' }
     * backButton: { position: 'absolute', top: 0, left: 0, zIndex: 10 }
     * navbar: { position: 'absolute', top: 50, left: 20, zIndex: 40 }
     * title: { marginTop: 90, fontSize: 26, fontWeight: 'bold', color: '#222' }
     * subtitle: { fontSize: 20, marginTop: 20, fontWeight: '600' }
     * paragraph: { padding: 10, fontSize: 14 }
     * table: { marginTop: 20, borderWidth: 1, borderColor: '#ddd' }
     * row: { flexDirection: 'row' }
     * headerRow: { backgroundColor: '#f2f2f2' }
     * cell: { flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#ddd', borderBottomWidth: 1, borderBottomColor: '#ddd', fontSize: 13 }
     * headerCell: { fontWeight: 'bold', fontSize: 14 }
     * overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)' }
     * menuContainer: { width: 220, backgroundColor: '#fff', padding: 20, paddingTop: 50, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }
     * menuTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 }
     * menuItem: { fontSize: 16, paddingVertical: 10, borderBottomColor: '#eee', borderBottomWidth: 1 }
     */
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleOptionPress = (path) => {
        setMenuVisible(false);
        router.push(path);
    };

    return (
        <View className="flex-1 pt-0 px-5 bg-white">
            <View className="absolute top-0 left-0 z-10">
                <BackRouting />
            </View>
            {/* Navbar/Menu Icon */}
            <View className="absolute top-12 left-5 z-40">
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={28} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text className="mt-24 text-2xl font-bold text-gray-800">
                📜 <Text style={{ fontWeight: 'bold' }}>License, Registration & Certificate</Text>
            </Text>

            {/* Sections */}
            <Text className="text-xl mt-5 font-semibold">
                <Text style={{ fontWeight: 'bold' }}>EmojiOne</Text>
            </Text>
            <Text className="p-2.5 text-sm">Emoji artwork provided by EmojiOne</Text>

            <Text className="text-xl mt-5 font-semibold">
                <Text style={{ fontWeight: 'bold' }}>FSSAI</Text>
            </Text>
            <Text className="p-2.5 text-sm">License No: 10019064001810</Text>

            <Text className="text-xl mt-5 font-semibold">
                <Text style={{ fontWeight: 'bold' }}>StateWise GSTIN - Regular</Text>
            </Text>
            <Text className="p-2.5 text-sm">
                Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited)
            </Text>

            {/* 📄 Table Section */}
            <View className="mt-5 border border-gray-300">
                {/* Table Header */}
                <View className="flex-row bg-gray-100">
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-sm font-bold">State</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-sm font-bold">GSTIN</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-sm font-bold">Address</Text>
                </View>

                {/* Example Rows */}
                <View className="flex-row">
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs">Karnataka</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs">29ABCDE1234F2Z5</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs">Bangalore</Text>
                </View>

                <View className="flex-row">
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs">Maharashtra</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs"></Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs"></Text>
                </View>

                <View className="flex-row">
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs">Telangana</Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs"></Text>
                    <Text className="flex-1 p-2.5 border-r border-b border-gray-300 text-xs"></Text>
                </View>
            </View>

            {/* Sidebar Menu Modal */}
            <Modal visible={menuVisible} animationType="slide" transparent={true}>
                <TouchableOpacity
                    className="flex-1 flex-row bg-black/30"
                    activeOpacity={1}
                    onPressOut={() => setMenuVisible(false)}
                >
                    <View className="w-56 bg-white p-5 pt-12 shadow-lg">
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
                </TouchableOpacity>
            </Modal>
        </View>
    );
}


