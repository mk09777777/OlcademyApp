import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, StyleSheet, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState, useRef } from 'react'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import axios from 'axios'
import { API_CONFIG } from '../../config/apiConfig';
const Api_url = API_CONFIG.BACKEND_URL;
export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otpArray, setOtpArray] = useState(Array(6).fill(''))
  const [otpError, setOtpError] = useState('')
  const [timer, setTimer] = useState(60)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const otpRefs = useRef([])

  const clearError = () => {
    if (error) setError('')
    if (otpError) setOtpError('')
  }

  // Timer effect for OTP
  useEffect(() => {
    let interval
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setResendDisabled(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showOtp, timer])

  const handleOtpChange = (index, text) => {
    if (text.length > 1) return
    
    const newOtpArray = [...otpArray]
    newOtpArray[index] = text
    setOtpArray(newOtpArray)
    
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    
    clearError()
  }

  const handleOtpKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const resendOtp = async () => {
    setOtpLoading(true)
    try {
      const normalizedEmail = formData.email.trim().toLowerCase()
      if (!validateEmail(normalizedEmail)) {
        setOtpLoading(false)
        setOtpError('Enter a valid email address before resending OTP.')
        return
      }

      await axios.post(`${Api_url}/api/send-email-otp`, { 
        email: normalizedEmail 
      })
      setTimer(60)
      setResendDisabled(true)
      setOtpArray(Array(6).fill(''))
      setOtpError('')
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    clearError()
  }

const handleLogin = async () => {
  clearError();
  if (!formData.email || !formData.password) {
    setError('Please enter both email and password.');
    return;
  }

  setLoading(true);
  try {
    console.log('Attempting login with:', { email: formData.email, rememberMe });
    
    const response = await axios.post(
      `${Api_url}/api/login`, 
      {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe
      },
      {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Login response:', response.data);

    if (response.data.success || response.data.message === "Login successful!") {
      const userData = response.data.user || response.data.data;
      if (userData) {
        await login(userData);
      } else {
        setError('Login successful but user data not received');
      }
    } else {
      setError(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      setError('Invalid email or password. Please check your credentials.');
    } else if (error.response?.status === 400) {
      setError(error.response?.data?.message || 'Invalid request. Please check your input.');
    } else if (error.response?.status >= 500) {
      setError('Server error. Please try again later.');
    } else {
      setError(error.response?.data?.message || 'Login error. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
    clearError()
    if (!formData.email) {
      setError('Please enter your email to reset password.')
      return
    }

    const normalizedEmail = formData.email.trim().toLowerCase()
    if (!validateEmail(normalizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    setOtpLoading(true)
    try {
      await axios.post(`${Api_url}/api/send-email-otp`, { 
        email: normalizedEmail 
      })
      setShowOtp(true)
      setTimer(60)
      setResendDisabled(true)
      setOtpArray(Array(6).fill(''))
      setIsOtpVerified(false)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    const enteredOtp = otpArray.join('')
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP.')
      return
    }
    setOtpLoading(true)
    try {
      const normalizedEmail = formData.email.trim().toLowerCase()
      const response = await axios.post(`${Api_url}/api/verify-otp`, {
        email: normalizedEmail,
        otp: enteredOtp
      })
      if (response.data.success) {
        setIsOtpVerified(true)
        setShowOtp(false)
        setOtpError('')
      } else {
        setOtpError(response.data.message || 'Invalid OTP')
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Verification failed')
    } finally {
      setOtpLoading(false)
    }
  }

  const resetPassword = async () => {
    clearError()
    if (!newPassword) {
      setError('Please enter a new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setResetLoading(true)
    try {
      const normalizedEmail = formData.email.trim().toLowerCase()
      const response = await axios.post(`${Api_url}/api/reset-password`, {
        email: normalizedEmail,
        newPassword
      })
      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully!')
        setShowOtp(false)
        setIsOtpVerified(false)
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(response.data.message || 'Password reset failed')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed')
    } finally {
      setResetLoading(false)
    }
  }

  const launchOAuthFlow = (provider) => {
    const targetUrl = `${Api_url}/api/${provider}?rememberMe=${rememberMe}`
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = targetUrl
      return
    }

    router.push({
      pathname: '/auth/OAuthWebView',
      params: {
        provider,
        rememberMe: rememberMe ? 'true' : 'false',
      },
    })
  }

  const LoginWithGoogle = () => {
    launchOAuthFlow('google')
  }

  const LoginWithFacebook = () => {
    launchOAuthFlow('facebook')
  }

  const LoginWithTwitter = () => {
    launchOAuthFlow('twitter')
  }

  let currentView = 'login'
  if (showOtp) {
    currentView = 'otp'
  } else if (isOtpVerified) {
    currentView = 'resetPassword'
  }

  return (
    <SafeAreaView className="flex-1 justify-center p-5 bg-white" style={styles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.card} className="w-full bg-white">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-textprimary">
              {currentView === 'login' && 'Login'}
              {currentView === 'otp' && 'Verify Email'}
              {currentView === 'resetPassword' && 'Reset Password'}
            </Text>
          </View>

          {currentView === 'login' && (
            <View className="w-full">
              {error ? <Text className="text-red-500 text-sm mb-2.5">{error}</Text> : null}

              <TextInput
                className="border border-border rounded-2.5 p-4 mb-4 text-base bg-white text-green-600"
                placeholder="Email Address"
                placeholderTextColor="#047857"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View className="flex-row items-center border border-border rounded-2.5 mb-4 bg-white px-2">
                <TextInput
                  className="flex-1 py-4 pl-2 pr-3 text-base text-green-600"
                  placeholder="Password"
                  placeholderTextColor="#047857"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  className="px-2 py-2"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#047857"
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mb-5">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <View className={`w-5 h-5 rounded border border-border mr-2 items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'bg-white'}`}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text className="text-sm text-textsecondary">Remember Me</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={loading || otpLoading}
                >
                  {otpLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text className="text-sm text-primary">
                      Forgot password?
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-2xl items-center mb-5"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base font-bold">Log In</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-2.5 text-textsecondary text-sm">or</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              <TouchableOpacity
                className="border border-border p-4 rounded-2xl items-center mb-2.5 bg-white"
                onPress={LoginWithGoogle}
                disabled={loading}
                style={styles.socialButton}
              >
                <View className="flex-row items-center justify-center">
                  <FontAwesome name="google" size={18} color="#DB4437" style={styles.socialIcon} />
                  <Text className="text-base text-textsecondary font-medium">
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-border p-4 rounded-2xl items-center mb-2.5 bg-white"
                onPress={LoginWithTwitter}
                disabled={loading}
                style={styles.socialButton}
              >
                <View className="flex-row items-center justify-center">
                  <FontAwesome name="twitter" size={18} color="#1DA1F2" style={styles.socialIcon} />
                  <Text className="text-base text-textsecondary font-medium">
                    Continue with Twitter
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-border p-4 rounded-2xl items-center mb-2.5 bg-white"
                onPress={LoginWithFacebook}
                disabled={loading}
                style={styles.socialButton}
              >
                <View className="flex-row items-center justify-center">
                  <FontAwesome name="facebook" size={18} color="#1877F2" style={styles.socialIcon} />
                  <Text className="text-base text-textsecondary font-medium">
                    Continue with Facebook
                  </Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-2.5">
                <Text className="text-sm text-textsecondary">
                  Don&apos;t have an Account?{' '}
                  <Text
                    className="text-sm text-primary font-bold"
                    onPress={() => router.push('/auth/Signup')}
                  >
                    Register
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {currentView === 'otp' && (
            <View className="w-full items-center">
              <Text className="text-sm text-textsecondary mb-5 text-center">
                Enter the 6-digit code sent to{' '}
                <Text className="font-bold">{formData.email}</Text>.
              </Text>

              {otpError ? (
                <Text className="text-red-500 text-sm mb-2.5 text-center">
                  {otpError}
                </Text>
              ) : null}

              <View className="flex-row justify-between mb-5 w-full">
                {otpArray.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => (otpRefs.current[index] = el)}
                    className="w-11 h-11 border border-border rounded-2xl text-center text-lg bg-slate-50 text-textprimary"
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(index, text)}
                    onKeyPress={(e) => handleOtpKeyPress(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-2xl items-center mb-5 w-full"
                onPress={verifyOtp}
                disabled={otpLoading || otpArray.join('').length !== 6}
              >
                {otpLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base font-bold">Verify Code</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-2.5">
                <Text className="text-sm text-textsecondary mr-1">Didn&apos;t receive code?</Text>
                <TouchableOpacity
                  onPress={resendOtp}
                  disabled={resendDisabled || otpLoading}
                >
                  {otpLoading && !resendDisabled ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text className="text-sm text-primary font-bold">
                      {resendDisabled
                        ? `Resend in ${formatTime(timer)}`
                        : 'Resend Code'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {currentView === 'resetPassword' && (
            <View className="w-full">
              <Text className="text-sm text-textsecondary mb-5 text-center">Create a new secure password.</Text>

              {error ? <Text className="text-red-500 text-sm mb-2.5">{error}</Text> : null}

              <View className="flex-row items-center border-border rounded-2.5 mb-4">
                <TextInput
                  className="flex-1 border border-border rounded-2.5 p-4 text-base bg-slate-50 text-textprimary"
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
              </View>

              <View className="flex-row items-center border-border rounded-2.5 mb-4">
                <TextInput
                  className="flex-1 border border-border rounded-2.5 p-4 text-base bg-slate-50 text-textprimary"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-2xl items-center mb-5"
                onPress={resetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base font-bold">Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
  },
  socialButton: {
    borderRadius: 20,
  },
  socialIcon: {
    marginRight: 12,
  },
})
