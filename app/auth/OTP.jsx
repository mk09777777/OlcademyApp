import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Loader2 } from "lucide-react-native";

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
      `http://192.168.0.103:3000/api/verify`,
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
        `http://192.168.0.101:3000/api/send-email-otp`,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Email</Text>
      </View>

      <Text style={styles.subtext}>
        Enter the 6-digit code sent to <Text style={styles.emailText}>{email}</Text>.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.otpContainer}>
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            style={styles.otpInput}
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
        style={styles.verifyButton}
        onPress={verifyOtp}
        disabled={otpLoading || otpArray.join("").length !== 6}
      >
        {otpLoading ? (
          <Loader2 size={18} color="#fff" style={styles.spinner} />
        ) : (
          <Text style={styles.buttonText}>Verify Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text>Didn't receive code?</Text>
        <TouchableOpacity
          onPress={resendOtp}
          disabled={resendDisabled || loading}
        >
          <Text style={[styles.resendText, (resendDisabled || loading) && styles.disabledResend]}>
            {loading && !resendDisabled ? (
              <Loader2 size={16} color="#4f46e5" style={styles.spinner} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  emailText: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },
  verifyButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
spinner: {
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationKeyframes: [
        { 
            from: { transform: [{ rotate: "0deg" }] }, 
            to: { transform: [{ rotate: "360deg" }] } 
        }
    ]
},
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    color: "#4f46e5",
    marginLeft: 5,
    fontWeight: "bold",
  },
  disabledResend: {
    color: "#ccc",
  },
});

export default OTP;