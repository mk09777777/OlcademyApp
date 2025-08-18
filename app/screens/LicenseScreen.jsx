import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackRouting from '@/components/BackRouting';

export default function LicenseScreen() {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleOptionPress = (path) => {
        setMenuVisible(false);
        router.push(path);
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <BackRouting />
            </View>
            {/* Navbar/Menu Icon */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={28} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>
                📜 <Text style={{ fontWeight: 'bold' }}>License, Registration & Certificate</Text>
            </Text>

            {/* Sections */}
            <Text style={styles.subtitle}>
                <Text style={{ fontWeight: 'bold' }}>EmojiOne</Text>
            </Text>
            <Text style={styles.paragraph}>Emoji artwork provided by EmojiOne</Text>

            <Text style={styles.subtitle}>
                <Text style={{ fontWeight: 'bold' }}>FSSAI</Text>
            </Text>
            <Text style={styles.paragraph}>License No: 10019064001810</Text>

            <Text style={styles.subtitle}>
                <Text style={{ fontWeight: 'bold' }}>StateWise GSTIN - Regular</Text>
            </Text>
            <Text style={styles.paragraph}>
                Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited)
            </Text>

            {/* 📄 Table Section */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell]}>State</Text>
                    <Text style={[styles.cell, styles.headerCell]}>GSTIN</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Address</Text>
                </View>

                {/* Example Rows */}
                <View style={styles.row}>
                    <Text style={styles.cell}>Karnataka</Text>
                    <Text style={styles.cell}>29ABCDE1234F2Z5</Text>
                    <Text style={styles.cell}>Bangalore</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cell}>Maharashtra</Text>
                    <Text style={styles.cell}></Text>
                    <Text style={styles.cell}></Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cell}>Telangana</Text>
                    <Text style={styles.cell}></Text>
                    <Text style={styles.cell}></Text>
                </View>
            </View>

            {/* Sidebar Menu Modal */}
            <Modal visible={menuVisible} animationType="slide" transparent={true}>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <Text style={styles.menuTitle}>Menu</Text>

                        <TouchableOpacity onPress={() => handleOptionPress('/general')}>
                            <Text style={styles.menuItem}>General</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleOptionPress('/home/TakeAway')}>
                            <Text style={styles.menuItem}>Takeaway</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleOptionPress('/home/Dining')}>
                            <Text style={styles.menuItem}>Dining</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleOptionPress('/language')}>
                            <Text style={styles.menuItem}>Language</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0, 
        zIndex: 10,
    },
    navbar: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 40,
    },
    title: {
        marginTop: 90,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
    },
    subtitle: {
        fontSize: 20,
        marginTop: 20,
        fontWeight: '600',
    },
    paragraph: {
        padding: 10,
        fontSize: 14,
    },
    // 🧾 Table styles
    table: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
    },
    headerRow: {
        backgroundColor: '#f2f2f2',
    },
    cell: {
        flex: 1,
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 13,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        width: 220,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
});
