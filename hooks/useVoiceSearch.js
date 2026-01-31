import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

// Detect if running in Expo Go (where native modules aren't available)
const isExpoGo = Constants.appOwnership === 'expo';

/**
 * Voice search hook using @react-native-voice/voice
 * 
 * Works in development builds and production.
 * Shows helpful Alert when voice is unavailable (Expo Go).
 */
export function useVoiceSearch({ onTranscript } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [error, setError] = useState(null);

  const VoiceRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);
  const initializedRef = useRef(false);

  // Keep callback ref current
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Initialize voice module once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Skip in Expo Go
    if (isExpoGo) {
      setVoiceAvailable(false);
      return;
    }

    const initVoice = async () => {
      try {
        const Voice = require('@react-native-voice/voice').default;

        if (!Voice) {
          setVoiceAvailable(false);
          return;
        }

        // Check if voice recognition is available
        const available = await Voice.isAvailable();

        if (!available) {
          setVoiceAvailable(false);
          return;
        }

        // Set up event handlers
        Voice.onSpeechStart = () => {
          setIsListening(true);
          setError(null);
        };

        Voice.onSpeechEnd = () => {
          setIsListening(false);
        };

        Voice.onSpeechResults = (e) => {
          setIsListening(false);
          if (e.value?.[0] && onTranscriptRef.current) {
            onTranscriptRef.current(e.value[0]);
          }
        };

        Voice.onSpeechError = (e) => {
          setIsListening(false);
          setError(e.error?.message || 'Voice recognition failed');
        };

        VoiceRef.current = Voice;
        setVoiceAvailable(true);

        if (__DEV__) {
          console.log('[Voice] Initialized successfully');
        }
      } catch (e) {
        // Native module not available
        setVoiceAvailable(false);
      }
    };

    initVoice();

    // Cleanup
    return () => {
      if (VoiceRef.current) {
        try {
          VoiceRef.current.destroy();
          VoiceRef.current.removeAllListeners();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    if (!voiceAvailable || !VoiceRef.current) {
      Alert.alert(
        'Voice Search Unavailable',
        isExpoGo
          ? 'Voice search requires a development build.\n\nRun: npx expo run:android'
          : 'Voice recognition is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setError(null);
      await VoiceRef.current.start('en-US');
    } catch (e) {
      setError(e.message);
      setIsListening(false);
    }
  }, [voiceAvailable]);

  // Stop listening
  const stopListening = useCallback(async () => {
    if (!VoiceRef.current) return;

    try {
      await VoiceRef.current.stop();
      setIsListening(false);
    } catch (e) {
      // Ignore stop errors
    }
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    toggleListening,
    startListening,
    stopListening,
    error,
    isVoiceAvailable: voiceAvailable,
    // Aliases for backward compatibility
    isRecording: isListening,
    toggleRecording: toggleListening,
    isBusy: false,
  };
}
