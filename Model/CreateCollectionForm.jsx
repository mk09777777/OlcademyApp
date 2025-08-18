import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles/CreateCollectionForm';

const CreateCollectionForm = ({ visible, onClose, onSubmit, collectionType }) => {
  const [title, setTitle] = useState('');
  const [dishes, setDishes] = useState('0');
  const [restaurants, setRestaurants] = useState('0');
  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a collection title');
      return;
    }

    let newCollection = {
      id: Date.now().toString(),
      title: title.trim(),
      image: require('../assets/images/food.jpg'),
    };

    if (collectionType === 'LiveEvents') {
      if (!date.trim() || !location.trim()) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      newCollection = { ...newCollection, date: date.trim(), location: location.trim() };
    } else {
      newCollection = { ...newCollection, dishes: parseInt(dishes) || 0, restaurants: parseInt(restaurants) || 0 };
    }

    onSubmit(newCollection);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDishes('0');
    setRestaurants('0');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create New Collection</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Collection Title*</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter collection title"
            />
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { resetForm(); onClose(); }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateCollectionForm;
