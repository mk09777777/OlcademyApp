import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

/**
 * Reusable Input component
 * @param {string} label - Input label
 * @param {string} placeholder - Input placeholder
 * @param {string} type - Input type (text, password, email)
 * @param {string} value - Input value
 * @param {function} onChangeText - Function to handle text change
 * @param {string} icon - Optional Feather icon name
 * @param {string} error - Optional error message
 * @param {object} style - Optional additional style
 * @param {object} containerStyle - Optional container style
 * @param {boolean} required - Whether the field is required
 * @param {object} inputProps - Any additional TextInput props
 */
const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChangeText,
  icon,
  error,
  style,
  containerStyle,
  required = false,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine if input is password type
  const isPassword = type === "password";

  // Set secure text entry based on type and showPassword state
  const secureTextEntry = isPassword && !showPassword;

  // Border color based on state (error, focused, default)
  const getBorderColor = () => {
    if (error) return "border-destructive";
    if (isFocused) return "border-blue";
    return "border-gray";
  };

  return (
    <View className={`mb-4 ${containerStyle}`}>
      {/* Label */}
      {label && (
        <Text className="text-primary text-base font-semibold mb-2">
          {label} {required && <Text className="text-destructive">*</Text>}
        </Text>
      )}

      {/* Input container */}
      <View
        className={`flex-row border rounded-lg bg-white items-center ${getBorderColor()}`}
      >
        {/* Left icon */}
        {icon && (
          <View className="pl-3">
            <Feather
              name={icon}
              size={20}
              color={isFocused ? "#0077B6" : "#666666"}
            />
          </View>
        )}

        {/* Text input */}
        <TextInput
          className={`flex-1 p-4 text-primary ${style}`}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          keyboardType={type === "email" ? "email-address" : "default"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />

        {/* Show/hide password icon for password fields */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="pr-4 justify-center"
          >
            <Feather
              name={!showPassword ? "eye" : "eye-off"}
              size={22}
              color={isFocused ? "#0077B6" : "#666666"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && (
        <View className="flex-row items-center mt-1">
          <Feather name="alert-circle" size={16} color="#FF3B30" />
          <Text className="text-destructive ml-1">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
