import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
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
    password: "",
    confirmPassword: "",
    accept: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

      if (name === "password" || name === "confirmPassword") {
        if (!updated.confirmPassword) {
          setConfirmStatus({ match: null, message: "" });
        } else {
          const matches = updated.password === updated.confirmPassword;
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

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
    clearError();
  };

  const handleCountryChange = () => {
    clearError();
  };

  const handleSignup = async () => {
    clearError();

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const passwordValue = formData.password;
    const confirmValue = formData.confirmPassword;

    if (passwordValue !== confirmValue) {
      setConfirmStatus({ match: false, message: "Passwords do not match." });
      setError("Passwords do not match.");
      return;
    } else {
      setConfirmStatus({ match: true, message: confirmValue ? "Passwords match." : "" });
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
  const launchOAuthFlow = (provider) => {
    const targetUrl = `${API_CONFIG.BACKEND_URL}/api/${provider}?rememberMe=false`;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.href = targetUrl;
      return;
    }

    router.push({
      pathname: "/auth/OAuthWebView",
      params: {
        provider,
        rememberMe: "false",
      },
    });
  };

  const signupWithGoogle = () => {
    launchOAuthFlow("google");
  };

  const signupWithFacebook = () => {
    launchOAuthFlow("facebook");
  };

  const signupWithTwitter = () => {
    launchOAuthFlow("twitter");
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
