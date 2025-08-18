import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '@/styles/Collection';

export default function CreateCollectionForm({ visible, onClose, onSubmit, collectionType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    const collection = {
      title: title.trim(),
      description: description.trim(),
      type: collectionType.toLowerCase()
    };

    if (collectionType === 'Events') {
      collection.date = date.trim();
      collection.location = location.trim();
    }

    onSubmit(collection);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setDate('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Collection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            mode="outlined"
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor="#E41E3F"
          />

          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor="#E41E3F"
            multiline
          />

          {collectionType === 'Events' && (
            <>
              <TextInput
                mode="outlined"
                label="Date"
                value={date}
                onChangeText={setDate}
                style={styles.input}
                outlineColor="#ddd"
                activeOutlineColor="#E41E3F"
                placeholder="e.g., March 25-27, 2025"
              />

              <TextInput
                mode="outlined"
                label="Location"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                outlineColor="#ddd"
                activeOutlineColor="#E41E3F"
                placeholder="e.g., City Center"
              />
            </>
          )}

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              labelStyle={styles.submitButtonText}
              disabled={!title.trim()}
            >
              Create
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
