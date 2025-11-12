import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 mx-4 w-11/12 max-w-md">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-outfit-bold color-gray-900">Create New Collection</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            mode="outlined"
            label="Title"
            value={title}
            onChangeText={setTitle}
            className="mb-4"
            outlineColor="#ddd"
            activeOutlineColor="#E41E3F"
          />

          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            className="mb-4"
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
                className="mb-4"
                outlineColor="#ddd"
                activeOutlineColor="#E41E3F"
                placeholder="e.g., March 25-27, 2025"
              />

              <TextInput
                mode="outlined"
                label="Location"
                value={location}
                onChangeText={setLocation}
                className="mb-4"
                outlineColor="#ddd"
                activeOutlineColor="#E41E3F"
                placeholder="e.g., City Center"
              />
            </>
          )}

          <View className="flex-row justify-end gap-3 mt-6">
            <Button
              mode="outlined"
              onPress={onClose}
              className="flex-1"
              buttonColor="transparent"
              textColor="#666"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              className="flex-1"
              buttonColor="#E41E3F"
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
