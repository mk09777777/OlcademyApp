import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ErrorState = ({ message, onRetry }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="alert-circle" size={48} color="#FF4B3A" />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Retry
        </Button>
      ) : (
        <Button 
          mode="contained" 
          onPress={() => router.replace('/home')}
          style={styles.button}
        >
          Return Home
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF4B3A',
  },
});

export default ErrorState;
