import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff, Loader2, X as CloseIcon } from "lucide-react-native";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { API_CONFIG } from '../../config/apiConfig';

const Signup = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    accept: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const clearError = () => {
    if (error) setError("");
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError();
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      accept: !prev.accept,
    }));
    clearError();
  };

const handleSignup = async () => {
  if (!formData.username || !formData.email || !formData.password) {
    setError("Please fill in username, email, and password.");
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
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      { 
        withCredentials: true,
        timeout: 10000 
      }
    );

    if (response.data.success) {
      navigation.navigate("OTP", { 
        email: formData.email, 
        password: formData.password, 
        username: formData.username,
        setAuth: setAuth 
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
        errorMessage = "Invalid request data. Please check your inputs.";
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
    navigation.navigate("LoginScreen");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#fff' }}>
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold text-textprimary">Sign Up</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <CloseIcon size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {error ? <Text className="text-red-500 mb-2.5 text-center">{error}</Text> : null}

      <TextInput
        className="h-12 border border-border rounded-2xl px-4 mb-4 text-base"
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />

      <TextInput
        className="h-12 border border-border rounded-2xl px-4 mb-4 text-base"
        placeholder="Email Address"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <View className="flex-row items-center mb-4">
        <TextInput
          className="flex-1 h-12 border border-border rounded-2xl px-4 text-base"
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 p-2.5"
        >
          {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-5">
        <TouchableOpacity
          className={`w-5 h-5 border border-primary rounded mr-2.5 justify-center items-center ${
            formData.accept ? 'bg-primary' : ''
          }`}
          onPress={handleCheckboxChange}
        >
          {formData.accept && <Text className="text-white text-xs">✓</Text>}
        </TouchableOpacity>
        <Text className="text-sm text-textsecondary">I agree to the Terms and Privacy Policies</Text>
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

   <TouchableOpacity
  className="flex-row items-center justify-center p-3 rounded-2xl mb-2.5 bg-white border border-border"
  onPress={signupWithGoogle}
  disabled={loading}
>
  <MaterialIcons name="google" size={20} color="#DB4437" />
  <Text className="ml-2.5 text-base text-textprimary">Continue with Google</Text>
</TouchableOpacity>

<TouchableOpacity
  className="flex-row items-center justify-center p-3 rounded-2xl mb-2.5 bg-white border border-border"
  onPress={signupWithTwitter}
  disabled={loading}
>
  <FontAwesome name="twitter" size={20} color="#1DA1F2" />
  <Text className="ml-2.5 text-base text-textprimary">Continue with Twitter</Text>
</TouchableOpacity>

<TouchableOpacity
  className="flex-row items-center justify-center p-3 rounded-2xl mb-2.5 bg-white border border-border"
  onPress={signupWithFacebook}
  disabled={loading}
>
  <FontAwesome name="facebook" size={20} color="#1877F2" />
  <Text className="ml-2.5 text-base text-textprimary">Continue with Facebook</Text>
</TouchableOpacity>

      <View className="flex-row justify-center mt-5">
        <Text className="text-textprimary">Already have an account? </Text>
        <TouchableOpacity onPress={openLoginModal} disabled={loading}>
          <Text className="text-blue-600 font-bold">Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



export default Signup;