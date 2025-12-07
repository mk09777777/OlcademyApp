import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Loader2, X as CloseIcon } from "lucide-react-native";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../../config/apiConfig';
import PhoneNumberEntry from "@/components/PhoneNumberEntry";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    countryDialCode: "+91",
    password: "",
    confirmPassword: "",
    accept: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ available: null, message: "" });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const usernameDebounceRef = useRef(null);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState({ valid: null, message: "" });
  const [confirmStatus, setConfirmStatus] = useState({ match: null, message: "" });

  const clearError = () => {
    if (error) setError("");
  };

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      const passwordTrimmed = (name === "password" ? value : updated.password).trim();
      const confirmTrimmed = (name === "confirmPassword" ? value : updated.confirmPassword).trim();

      if (name === "password") {
        if (!value) {
          setPasswordStatus({ valid: null, message: "" });
        } else {
          const issue = getPasswordError(passwordTrimmed);
          if (issue) {
            setPasswordStatus({ valid: false, message: issue });
          } else {
            setPasswordStatus({ valid: true, message: "Password looks strong." });
          }
        }

        if (updated.confirmPassword) {
          const matches = passwordTrimmed === confirmTrimmed;
          setConfirmStatus({
            match: matches,
            message: matches ? "Passwords match." : "Passwords do not match.",
          });
        } else {
          setConfirmStatus({ match: null, message: "" });
        }
      } else if (name === "confirmPassword") {
        if (!value) {
          setConfirmStatus({ match: null, message: "" });
        } else {
          const matches = passwordTrimmed === confirmTrimmed;
          setConfirmStatus({
            match: matches,
            message: matches ? "Passwords match." : "Passwords do not match.",
          });
        }
      }

      return updated;
    });
    clearError();
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      accept: !prev.accept,
    }));
    clearError();
  };

  useEffect(() => {
    if (usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
    }

    const trimmed = formData.username.trim();
    if (!trimmed) {
      setUsernameStatus({ available: null, message: "" });
      return;
    }

    if (trimmed.length < 3) {
      setUsernameStatus({ available: false, message: "Username must be at least 3 characters." });
      return;
    }

    usernameDebounceRef.current = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const response = await axios.get(`${API_CONFIG.BACKEND_URL}/api/check-username`, {
          params: { username: trimmed },
          timeout: 8000,
        });

        const available = response.data?.available !== false;
        setUsernameStatus({
          available,
          message: response.data?.message || (available ? "Username is available." : "Username already taken."),
        });
      } catch (err) {
        console.error("Username availability check failed:", err.response?.data || err.message);
        setUsernameStatus({ available: null, message: "Unable to verify username right now." });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => {
      if (usernameDebounceRef.current) {
        clearTimeout(usernameDebounceRef.current);
      }
    };
  }, [formData.username]);

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, "");
    const dial = (selectedCountry?.data?.dial_code || formData.countryDialCode || "+91").replace(/\D/g, "");
    const localDigits = digits.startsWith(dial) ? digits.slice(dial.length) : digits;

    setFormData((prev) => ({
      ...prev,
      phone: localDigits,
    }));
    clearError();
  };

  const handleCountryChange = (country) => {
    if (country?.data?.dial_code) {
      setFormData((prev) => ({
        ...prev,
        countryDialCode: country.data.dial_code,
      }));
    }
    setSelectedCountry(country);
    clearError();
  };

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const getPasswordError = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must include at least one number.";
    }
    if (!/[\W_]/.test(password)) {
      return "Password must include at least one special character.";
    }
    return null;
  };

  const handleSignup = async () => {
    clearError();

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
  const passwordValue = formData.password.trim();
  const confirmValue = formData.confirmPassword.trim();
    const dialCode = formData.countryDialCode || selectedCountry?.data?.dial_code || "+91";
    const normalizedDialCode = dialCode.startsWith("+") ? dialCode : `+${dialCode}`;
    const localDigits = formData.phone.replace(/\D/g, "");
    const fullPhone = localDigits ? `${normalizedDialCode}${localDigits}` : "";

    if (!trimmedUsername || !trimmedEmail || !passwordValue || !confirmValue || !localDigits) {
      setError("Username, email, phone, password, and confirmation are required.");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (localDigits.length < 6) {
      setError("Please enter a valid phone number.");
      return;
    }

    const passwordIssue = getPasswordError(passwordValue);
    if (passwordIssue) {
      setPasswordStatus({ valid: false, message: passwordIssue });
      setError(passwordIssue);
      return;
    } else {
      setPasswordStatus({ valid: true, message: passwordValue ? "Password looks strong." : "" });
    }

    if (passwordValue !== confirmValue) {
      setConfirmStatus({ match: false, message: "Passwords do not match." });
      setError("Passwords do not match.");
      return;
    } else {
      setConfirmStatus({ match: true, message: confirmValue ? "Passwords match." : "" });
    }

    if (usernameStatus.available === false) {
      setError(usernameStatus.message || "Username is already taken.");
      return;
    }

    if (isCheckingUsername) {
      setError("Please wait while we check username availability.");
      return;
    }

    if (!formData.accept) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_CONFIG.BACKEND_URL}/api/signup`,
        {
          username: trimmedUsername,
          email: trimmedEmail,
          password: passwordValue,
          phone: fullPhone,
          countryDialCode: normalizedDialCode,
        },
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        router.push({
          pathname: '/auth/OTP',
          params: {
            email: trimmedEmail,
            password: passwordValue,
            username: trimmedUsername,
            phone: fullPhone,
          },
        });
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";

      if (err.response) {
        if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid request data. Please check your inputs.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }

      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };
  const signupWithGoogle = () => {
    // Implement Google signup
  };

  const signupWithFacebook = () => {
    // Implement Facebook signup
  };

  const signupWithTwitter = () => {
    // Implement Twitter signup
  };

  const openLoginModal = () => {
    router.replace('/auth/LoginScreen');
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-6">
          <View className="w-full rounded-3xl bg-white">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-textprimary">Sign Up</Text>
              <TouchableOpacity onPress={() => router.back()} className="p-1">
                <CloseIcon size={20} color="#000" />
              </TouchableOpacity>
            </View>

        {error ? <Text className="text-red-500 mb-2.5 text-center">{error}</Text> : null}

        <TextInput
          className="h-12 border border-border rounded-2xl px-4 mb-4 text-base bg-white text-textprimary"
          placeholder="Username"
          placeholderTextColor="#94a3b8"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
          autoCapitalize="words"
        />

        {formData.username ? (() => {
          const statusMessage = isCheckingUsername ? 'Checking username availability…' : usernameStatus.message;
          if (!statusMessage) return null;
          return (
            <Text
              className={`text-xs mb-2 ${isCheckingUsername ? 'text-gray-500' : usernameStatus.available === false ? 'text-red-500' : usernameStatus.available ? 'text-green-600' : 'text-gray-500'}`}
            >
              {statusMessage}
            </Text>
          );
        })() : null}

        <TextInput
          className="h-12 border border-border rounded-2xl px-4 mb-4 text-base bg-white text-textprimary"
          placeholder="Email Address"
          keyboardType="email-address"
          placeholderTextColor="#94a3b8"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          autoCapitalize="none"
        />
        <View className="mb-4">
          <PhoneNumberEntry
            value={formData.phone}
            onChangePhone={handlePhoneChange}
            onCountryChange={handleCountryChange}
          />
        </View>

        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 h-12 border border-border rounded-2xl px-4 text-base bg-white text-textprimary"
            placeholder="Password"
            secureTextEntry={!showPassword}
            placeholderTextColor="#94a3b8"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 p-2"
          >
            {showPassword ? <EyeOff size={18} color="#4B5563" /> : <Eye size={18} color="#4B5563" />}
          </TouchableOpacity>
        </View>

        {passwordStatus.message ? (
          <Text
            className={`text-xs mb-2 ${passwordStatus.valid === false ? 'text-red-500' : 'text-green-600'}`}
          >
            {passwordStatus.message}
          </Text>
        ) : null}

        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 h-12 border border-border rounded-2xl px-4 text-base bg-white text-textprimary"
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#94a3b8"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 p-2"
          >
            {showConfirmPassword ? <EyeOff size={18} color="#4B5563" /> : <Eye size={18} color="#4B5563" />}
          </TouchableOpacity>
        </View>

        {confirmStatus.message ? (
          <Text
            className={`text-xs mb-2 ${confirmStatus.match === false ? 'text-red-500' : 'text-green-600'}`}
          >
            {confirmStatus.message}
          </Text>
        ) : null}

        <Text className="text-xs text-textsecondary mb-4">
          Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
        </Text>

            <View className="flex-row items-center mb-5">
              <TouchableOpacity
                className="mr-2.5"
                onPress={handleCheckboxChange}
                activeOpacity={0.7}
              >
                <View
                  className={`w-5 h-5 items-center justify-center rounded border border-primary ${
                    formData.accept ? "bg-primary" : "bg-white"
                  }`}
                >
                  {formData.accept && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text className="text-sm text-textsecondary">
                I agree to the Terms and Privacy Policies
              </Text>
            </View>

        <TouchableOpacity
          className="bg-primary p-4 rounded-2xl items-center mb-5"
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={18} color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="mx-2.5 text-textsecondary">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

            <View className="mb-2.5 flex-row justify-center gap-4">
              <TouchableOpacity
                className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
                onPress={signupWithGoogle}
                disabled={loading}
                accessibilityLabel="Sign up with Google"
              >
                <FontAwesome name="google" size={22} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity
                className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
                onPress={signupWithTwitter}
                disabled={loading}
                accessibilityLabel="Sign up with Twitter"
              >
                <FontAwesome name="twitter" size={22} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity
                className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
                onPress={signupWithFacebook}
                disabled={loading}
                accessibilityLabel="Sign up with Facebook"
              >
                <FontAwesome name="facebook" size={22} color="#1877F2" />
              </TouchableOpacity>
            </View>

            <View className="mt-5 flex-row justify-center">
              <Text className="text-textprimary">Already have an account? </Text>
              <TouchableOpacity onPress={openLoginModal} disabled={loading}>
                <Text className="font-bold text-blue-600">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Signup;
