import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
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

  const resendOtp = async () => {
    setOtpLoading(true)
    try {
      await axios.post(`${Api_url}/api/send-email-otp`, { 
        email: formData.email 
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
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        login(userData);
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
    setOtpLoading(true)
    try {
      await axios.post(`${Api_url}/api/send-email-otp`, { 
        email: formData.email 
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
      const response = await axios.post(`${Api_url}/api/verify-otp`, {
        email: formData.email,
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
      const response = await axios.post(`${Api_url}/api/reset-password`, {
        email: formData.email,
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

  const LoginWithGoogle = () => {
    router.push(`${Api_url}/api/google?rememberMe=` + rememberMe);
  }

  const LoginWithFacebook = () => {
    router.push(`${Api_url}/api/facebook?rememberMe=` + rememberMe);
  }

  const LoginWithTwitter = () => {
    router.push(`${Api_url}/api/twitter?rememberMe=` + rememberMe);
  }

  let currentView = 'login'
  if (showOtp) {
    currentView = 'otp'
  } else if (isOtpVerified) {
    currentView = 'resetPassword'
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-textsecondary">
              {currentView === 'login' && 'Login'}
              {currentView === 'otp' && 'Verify Email'}
              {currentView === 'resetPassword' && 'Reset Password'}
            </Text>
          </View>

          {currentView === 'login' && (
            <View className="w-full">
              {error ? <Text className="text-red-500 text-sm mb-2.5">{error}</Text> : null}

              <TextInput
                className="border border-border rounded-2.5 p-4 mb-4 text-base"
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View className="flex-row items-center border-border rounded-2.5 mb-4">
                <TextInput
                  className="flex-1 border border-border rounded-2.5 p-4 text-base"
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  className="p-2.5"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mb-5">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 border border-border rounded justify-center items-center mr-2 ${rememberMe ? 'bg-primary border-primary' : ''}`}
                  >
                    {rememberMe && <Text className="text-white text-xs">✓</Text>}
                  </TouchableOpacity>
                  <Text className="text-sm text-textsecondary">Remember Me</Text>
                </View>
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
                className="bg-primary p-4 rounded-2.5 items-center mb-5"
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
                className="border border-border p-4 rounded-2.5 items-center mb-2.5"
                onPress={LoginWithGoogle}
                disabled={loading}
              >
                <Text className="text-base text-textsecondary">
                  Continue with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-border p-4 rounded-2.5 items-center mb-2.5"
                onPress={LoginWithTwitter}
                disabled={loading}
              >
                <Text className="text-base text-textsecondary">
                  Continue with Twitter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-border p-4 rounded-2.5 items-center mb-2.5"
                onPress={LoginWithFacebook}
                disabled={loading}
              >
                <Text className="text-base text-textsecondary">
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-2.5">
                <Text className="text-sm text-textsecondary">
                  Don't have an Account? 
                  <Text
                    className="text-sm text-primary font-bold"
                    onPress={() => router.navigate('/auth/Signup')}
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
                    className="w-11 h-11 border border-border rounded-2.5 text-center text-lg"
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
                className="bg-primary p-4 rounded-2.5 items-center mb-5 w-full"
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
                <Text className="text-sm text-textsecondary mr-1">Didn't receive code?</Text>
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
                  className="flex-1 border border-border rounded-2.5 p-4 text-base"
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
              </View>

              <View className="flex-row items-center border-border rounded-2.5 mb-4">
                <TextInput
                  className="flex-1 border border-border rounded-2.5 p-4 text-base"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-2.5 items-center mb-5"
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