import { Stack } from 'expo-router'
import React from 'react'

export default function AuthLayout() {
  return (
    <Stack>
        <Stack.Screen name='LoginScreen' options={{headerShown: false}}/>
        <Stack.Screen name='Signup' options={{headerShown: false}}/>
        <Stack.Screen name='OTP' options={{headerShown: false}}/>
        <Stack.Screen name='SearchCountryCode' options={{headerShown: false}}/>
        <Stack.Screen name='OAuthWebView' options={{headerShown: false}}/>

    </Stack>
  )
}