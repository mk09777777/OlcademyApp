import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff, Loader2, X as CloseIcon } from "lucide-react-native";
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.card} className="w-full">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-textprimary">Sign Up</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <CloseIcon size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {error ? <Text className="text-red-500 mb-2.5 text-center">{error}</Text> : null}

        <TextInput
          className="h-12 border border-border rounded-2xl px-4 mb-4 text-base bg-slate-50 text-textprimary"
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />

        <TextInput
          className="h-12 border border-border rounded-2xl px-4 mb-4 text-base bg-slate-50 text-textprimary"
          placeholder="Email Address"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 h-12 border border-border rounded-2xl px-4 text-base bg-slate-50 text-textprimary"
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 p-2"
          >
            {showPassword ? <EyeOff size={18} color="#4B5563" /> : <Eye size={18} color="#4B5563" />}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-5">
          <TouchableOpacity
            className="mr-2.5"
            onPress={handleCheckboxChange}
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 rounded border border-primary justify-center items-center ${
              formData.accept ? 'bg-primary' : 'bg-white'
            }`}>
              {formData.accept && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
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
          className="border border-border p-3 rounded-2xl mb-2.5 bg-white"
          onPress={signupWithGoogle}
          disabled={loading}
          style={styles.socialButton}
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="google" size={20} color="#DB4437" style={styles.socialIcon} />
            <Text className="text-base text-textprimary font-medium">Continue with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-border p-3 rounded-2xl mb-2.5 bg-white"
          onPress={signupWithTwitter}
          disabled={loading}
          style={styles.socialButton}
        >
          <View className="flex-row items-center justify-center">
            <FontAwesome name="twitter" size={20} color="#1DA1F2" style={styles.socialIcon} />
            <Text className="text-base text-textprimary font-medium">Continue with Twitter</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-border p-3 rounded-2xl mb-2.5 bg-white"
          onPress={signupWithFacebook}
          disabled={loading}
          style={styles.socialButton}
        >
          <View className="flex-row items-center justify-center">
            <FontAwesome name="facebook" size={20} color="#1877F2" style={styles.socialIcon} />
            <Text className="text-base text-textprimary font-medium">Continue with Facebook</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-5">
          <Text className="text-textprimary">Already have an account? </Text>
          <TouchableOpacity onPress={openLoginModal} disabled={loading}>
            <Text className="text-blue-600 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F4F6FB',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  socialButton: {
    borderRadius: 20,
  },
  socialIcon: {
    marginRight: 12,
  },
});



export default Signup;
