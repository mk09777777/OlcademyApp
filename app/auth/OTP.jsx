import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Loader2 } from "lucide-react-native";
import { API_CONFIG } from '../../config/apiConfig';
import { useAuth } from "@/context/AuthContext";

const OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();

  const emailParam = params.email ?? "";
  const passwordParam = params.password ?? "";
  const usernameParam = params.username ?? "";
  const phoneParam = params.phone ?? "";

  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;
  const password = Array.isArray(passwordParam) ? passwordParam[0] : passwordParam;
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;
  const phone = Array.isArray(phoneParam) ? phoneParam[0] : phoneParam;
  
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false);
      return undefined;
    }

    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  useEffect(() => {
    if (!email) {
      setError("Missing signup details. Please start again.");
    }
  }, [email]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
    if (error) setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.nativeEvent.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

const verifyOtp = async () => {
  const enteredOtp = otpArray.join("");
  if (enteredOtp.length !== 6) {
    setError("Please enter the complete 6-digit OTP.");
    return;
  }
  if (!email) {
    setError("Missing signup details. Please start again.");
    return;
  }

  setOtpLoading(true);
  setError("");

  const normalizedEmail = email.trim().toLowerCase();

  try {
    await axios.post(
      `${API_CONFIG.BACKEND_URL}/api/verify`,
      {
        identifier: normalizedEmail,
        otp: Number(enteredOtp),
        password,
        username,
        phone,
      },
      { withCredentials: true }
    );

    let autoLoggedIn = false;

    if (password) {
      try {
        const loginResponse = await axios.post(
          `${API_CONFIG.BACKEND_URL}/api/login`,
          {
            email: normalizedEmail,
            password,
            rememberMe: true,
          },
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        const userData = loginResponse.data?.user || loginResponse.data?.data;
        if (userData) {
          await login(userData);
          autoLoggedIn = true;
        }
      } catch (loginError) {
        console.error('Auto login after verification failed:', loginError.response?.data || loginError.message);
      }
    }

    if (!autoLoggedIn) {
      Alert.alert("Success", "Account verified! Please log in.");
      router.replace('/auth/LoginScreen');
    }
  } catch (err) {
    setError(err.response?.data?.error || "Invalid OTP. Please try again.");
  } finally {
    setOtpLoading(false);
  }
};
  const resendOtp = async () => {
    if (resendDisabled) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_CONFIG.BACKEND_URL}/api/send-email-otp`,
        { email: email?.trim() },
        { withCredentials: true }
      );
      setTimer(300);
      setResendDisabled(true);
      setOtpArray(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="mb-5">
        <Text className="text-2xl font-bold text-textprimary">Verify Email</Text>
      </View>

      <Text className="text-base mb-5 text-center text-textsecondary">
        Enter the 6-digit code sent to <Text className="font-bold">{email}</Text>.
      </Text>

      {error ? <Text className="text-red-500 mb-5 text-center">{error}</Text> : null}

      <View className="flex-row justify-between mb-8">
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            className="w-11 h-12 border border-border rounded-2xl text-center text-lg"
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(index, text)}
            onKeyPress={(e) => handleOtpKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity
        className="bg-primary p-4 rounded-2xl items-center mb-5"
        onPress={verifyOtp}
        disabled={otpLoading || otpArray.join("").length !== 6}
      >
        {otpLoading ? (
          <Loader2 size={18} color="#fff" />
        ) : (
          <Text className="text-white text-base font-bold">Verify Account</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center items-center">
        <Text className="text-textsecondary">Didn&apos;t receive code?</Text>
        <TouchableOpacity
          onPress={resendOtp}
          disabled={resendDisabled || loading}
        >
          <Text className={`ml-1 font-bold ${(resendDisabled || loading) ? 'text-gray-400' : 'text-primary'}`}>
            {loading && !resendDisabled ? (
              <Loader2 size={16} color="#4f46e5" />
            ) : resendDisabled ? (
              `Resend in ${formatTime(timer)}`
            ) : (
              "Resend Code"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default OTP;