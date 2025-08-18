import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import BackRouting from '@/components/BackRouting';
const messages = [
  { id: '1', date: '10 April 2025', time: '7:10 PM', text: 'Hi Shrija, please select the order for which you seek support.', inactive: true },
  { id: '2', date: '10 April 2025', time: '7:38 PM', text: 'Hi Shrija, please select the order for which you seek support.', inactive: true },
  { id: '3', date: '16 April 2025', time: '8:15 PM', text: 'Hi Shrija, please select the order for which you seek support.', inactive: true },
  { id: '4', date: 'Today', time: '9:10 PM', text: 'Hi Shrija, please select the order for which you seek support.', order: true }
];

export default function OrderSupportChat() {
  const [input, setInput] = useState('');

  const renderMessage = ({ item }) => (
    <View style={styles.messageBlock}>
      <Text style={styles.date}>{item.date}</Text>

      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{item.text}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {item.inactive && (
        <View style={styles.inactiveNotice}>
          <Text style={styles.inactiveText}>The conversation has been closed due to inactivity</Text>
        </View>
      )}

      {item.order && (
        <View style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order from Santosh Dhaba</Text>
          <Text style={styles.orderDetails}>22nd Mar at 7:50 PM | Paneer Butter Masala</Text>
          <Text style={styles.orderStatus}>Your order was delivered</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <BackRouting tittle="Support Chat"/>
      {/* Chat */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={styles.chatArea}
      />

      {/* Chat Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputArea}
      >
        <TextInput
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatArea: {
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  messageBlock: { marginTop: 20 },
  date: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  bubble: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 12,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  bubbleText: {
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 11,
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  inactiveNotice: {
    marginTop: 5,
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
  },
  inactiveText: {
    color: '#856404',
    fontSize: 13,
  },
  orderCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c00',
  },
  orderDetails: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  orderStatus: {
    fontSize: 13,
    color: '#28a745',
    marginTop: 5,
    fontWeight: '600',
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});
