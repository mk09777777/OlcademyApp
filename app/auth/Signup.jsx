import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <CloseIcon size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.inputField}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Email Address"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.inputField, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeButton}
        >
          {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.accept && styles.checked]}
          onPress={handleCheckboxChange}
        >
          {formData.accept && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree to the Terms and Privacy Policies</Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={18} color="#fff" style={styles.spinner} />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

   <TouchableOpacity
  style={[styles.socialButton, styles.googleButton]}
  onPress={signupWithGoogle}
  disabled={loading}
>
  <MaterialIcons name="google" size={20} color="#DB4437" />
  <Text style={styles.socialButtonText}>Continue with Google</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.socialButton, styles.twitterButton]}
  onPress={signupWithTwitter}
  disabled={loading}
>
  <FontAwesome name="twitter" size={20} color="#1DA1F2" />
  <Text style={styles.socialButtonText}>Continue with Twitter</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.socialButton, styles.facebookButton]}
  onPress={signupWithFacebook}
  disabled={loading}
>
  <FontAwesome name="facebook" size={20} color="#1877F2" />
  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
</TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={openLoginModal} disabled={loading}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "red",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "red",
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  twitterButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  facebookButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});

export default Signup;