import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Loader2 } from "lucide-react-native";
import { API_CONFIG } from '../../config/apiConfig';

const OTP = () => {
  const route = useRoute();
  const { email, password, username } = route.params;
  const navigation = useNavigation();
  
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1010);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

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
  setOtpLoading(true);
  setError("");

  try {
    await axios.post(
      `${API_CONFIG.BACKEND_URL}/api/verify`,
      {
        identifier: email.trim(),
        otp: Number(enteredOtp),
        password: password,
        username: username,
      },
      { withCredentials: true }
    );
    // Alert.alert("Success", "Signup Successful!");
    navigation.navigate('home'); 
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
        { email: email },
        { withCredentials: true }
      );
      setTimer(500);
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
        <Text className="text-textsecondary">Didn't receive code?</Text>
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