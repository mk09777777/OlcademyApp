import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Colors from '../components/constants/Colors';
import styles from '../styles/MoreSection';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { useAuth } from '@/context/AuthContext';

const MoreSection = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { safeNavigation } = useSafeNavigation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout from MoreSection failed:', error);
      Alert.alert('Logout Error', 'Unable to complete logout. Please try again.');
    } finally {
      setIsProcessing(false);
      setModalVisible(false);
    }
  };

  const MoreItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.section}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={Colors.textLight} />
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={Colors.textLight}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <MoreItem icon="information-outline" title="About" chevron onPress={() => safeNavigation('screens/About')} />
      <MoreItem icon="pencil-outline" title="Send feedback" chevron onPress={() => safeNavigation('screens/SendFeedback')} />
      <MoreItem icon="cog-outline" title="Settings" chevron onPress={() => safeNavigation('/screens/Settings')} />
      <MoreItem icon="chat-outline" title="Frequently asked questions" chevron onPress={() => safeNavigation('screens/FQA')} />
      <MoreItem icon="logout" title="Logout" chevron onPress={() => setModalVisible(true)} />

      {/* Custom Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={modalStyles.modal}
      >
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.title}>Ready to log out?</Text>

          <TouchableOpacity
            onPress={handleLogout}
            style={[modalStyles.optionButton, modalStyles.logoutButton]}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#d32f2f" />
            ) : (
              <Text style={modalStyles.optionText}>Log Out</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.cancelButton}>
            <Text style={modalStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MoreSection;

const modalStyles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    alignItems: 'center',
  },
  optionText: {
    textAlign: 'center',
    color: '#d32f2f',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 15,
  },
  cancelText: {
    textAlign: 'center',
    color: '#6e6e6e',
    fontSize: 16,
  },
});
