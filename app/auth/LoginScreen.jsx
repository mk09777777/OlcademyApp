import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '@/styles/LoginScreenStyles'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Api_url='http://192.168.0.101:3000';
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
    const response = await axios.post(
      `${Api_url}/api/login`, 
      {
        email: formData.email,
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

    if (response.data.message === "Login successful!") {
      // Ensure we have the user data before navigating
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      login(response.data.user);
    } else {
      setError(response.data.message || 'Login failed');
    }
  } catch (error) {
    if (error.response?.status === 401) {
      setError('Invalid credentials. Please try again.');
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
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {currentView === 'login' && 'Login'}
              {currentView === 'otp' && 'Verify Email'}
              {currentView === 'resetPassword' && 'Reset Password'}
            </Text>
          </View>

          {currentView === 'login' && (
            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TextInput
                style={styles.inputField}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.inputField, { flex: 1 }]}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsRow}>
                <View style={styles.rememberMeContainer}>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </View>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={loading || otpLoading}
                >
                  {otpLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.forgotPasswordLink}>
                      Forgot password?
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={LoginWithGoogle}
                disabled={loading}
              >
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={LoginWithTwitter}
                disabled={loading}
              >
                <Text style={styles.socialButtonText}>
                  Continue with Twitter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={LoginWithFacebook}
                disabled={loading}
              >
                <Text style={styles.socialButtonText}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              <View style={styles.signupPrompt}>
                <Text style={styles.detailsText}>
                  Don't have an Account? 
                  <Text
                    style={styles.registerButton}
                    onPress={() => router.navigate('/auth/Signup')}
                  >
                    Register
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {currentView === 'otp' && (
            <View style={styles.otpSection}>
              <Text style={styles.subtext}>
                Enter the 6-digit code sent to{' '}
                <Text style={{ fontWeight: 'bold' }}>{formData.email}</Text>.
              </Text>

              {otpError ? (
                <Text style={[styles.errorText, { textAlign: 'center' }]}>
                  {otpError}
                </Text>
              ) : null}

              <View style={styles.otpInputContainer}>
                {otpArray.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => (otpRefs.current[index] = el)}
                    style={styles.otpInput}
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
                style={styles.submitButton}
                onPress={verifyOtp}
                disabled={otpLoading || otpArray.join('').length !== 6}
              >
                {otpLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Verify Code</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive code?</Text>
                <TouchableOpacity
                  onPress={resendOtp}
                  disabled={resendDisabled || otpLoading}
                >
                  {otpLoading && !resendDisabled ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.resendLink}>
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
            <View style={styles.resetPasswordSection}>
              <Text style={styles.subtext}>Create a new secure password.</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.inputField, { flex: 1 }]}
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.inputField, { flex: 1 }]}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={resetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}