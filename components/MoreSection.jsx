import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Colors from '../components/constants/Colors';
import styles from '../styles/MoreSection';
import { router } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
const MoreSection = () => {
  const [isModalVisible, setModalVisible] = useState(false);
 const { safeNavigation } = useSafeNavigation();
  const MoreItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.section}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={Colors.textLight} />
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {chevron && <MaterialIcons name="chevron-right" size={24} color={Colors.textLight} style={styles.chevron} />}
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

     
      <MoreItem icon="info" title="About" chevron onPress={() => safeNavigation('screens/About')} />
      <MoreItem icon="edit" title="Send feedback" chevron onPress={() => safeNavigation('screens/SendFeedback')} />
      <MoreItem icon="settings" title="Settings" chevron onPress={() => safeNavigation('/screens/Settings')} />
      <MoreItem icon="chat" title="Frequently asked questions" chevron onPress={() => safeNavigation('screens/FQA')} />
      <MoreItem icon="logout" title="Logout" chevron onPress={() => setModalVisible(true)} />
      {/* Custom Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={modalStyles.modal}
      >
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.title}>Log out from?</Text>

          <TouchableOpacity onPress={() => router.replace("/screens/Logout")} style={modalStyles.optionButton}>
            <Text style={modalStyles.optionText}>Current Device</Text>
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
  optionText: {
    textAlign: 'center',
    color: '#d32f2f', // red like in the screenshot
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