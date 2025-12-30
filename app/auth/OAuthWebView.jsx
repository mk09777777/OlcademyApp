import React, { useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { API_CONFIG } from '../../config/apiConfig'

const PROVIDER_LABELS = {
  google: 'Google',
  facebook: 'Facebook',
  twitter: 'Twitter',
}

const APP_SCHEME = 'myapp://'

export default function OAuthWebView() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const providerParam = Array.isArray(params.provider) ? params.provider[0] : params.provider
  const rememberParam = Array.isArray(params.rememberMe) ? params.rememberMe[0] : params.rememberMe

  const providerKey = providerParam || 'google'
  const rememberMe = rememberParam === 'true'

  const [isLoading, setIsLoading] = useState(true)
  const [webError, setWebError] = useState('')
  const webViewRef = useRef(null)

  const targetUrl = useMemo(() => {
    return `${API_CONFIG.BACKEND_URL}/api/${providerKey}?rememberMe=${rememberMe}`
  }, [providerKey, rememberMe])

  const providerLabel = PROVIDER_LABELS[providerKey] || 'Account'

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/auth/LoginScreen')
    }
  }

  const handleShouldStart = (request) => {
    const nextUrl = request?.url || ''
    if (nextUrl.startsWith(APP_SCHEME)) {
      Linking.openURL(nextUrl).catch(() => {})
      handleClose()
      return false
    }
    return true
  }

  const handleNavChange = (navState) => {
    if (navState.url?.startsWith(APP_SCHEME)) {
      Linking.openURL(navState.url).catch(() => {})
      handleClose()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Continue with {providerLabel}</Text>
      </View> */}

      {webError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{webError}</Text>
        </View>
      ) : (
        <View style={styles.webviewContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#0ea5e9" />
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: targetUrl }}
            startInLoadingState
            onLoadStart={() => {
              setIsLoading(true)
              setWebError('')
            }}
            onLoadEnd={() => setIsLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              setWebError(nativeEvent.description || 'Unable to load login page.')
            }}
            onNavigationStateChange={handleNavChange}
            onShouldStartLoadWithRequest={handleShouldStart}
            javaScriptEnabled
            domStorageEnabled
            style={styles.webview}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: 'center',
    color: '#b91c1c',
  },
})
