import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const DropDownSelect = ({
  value,
  onChange,
  placeholder = "Select an option",
  options = [],
  valueKey = "value",
  labelKey = "label",
  error,
  containerStyle = {},
  width = "100%",
  maxHeight = 200,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;

  const selectedOption = options.find(
    (option) => option[valueKey] === value || option === value
  );

  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: showDropdown ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showDropdown, dropdownAnimation]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (option) => {
    onChange(option[valueKey] || option);
    setShowDropdown(false);
  };

  // Calculate dropdown height based on number of options, with a maximum
  const dropdownHeight = Math.min(options.length * 45, maxHeight);

  const animatedHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dropdownHeight],
  });

  const animatedOpacity = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={{ ...containerStyle }} className="z-9999 w-full">
      <TouchableOpacity
        onPress={toggleDropdown}
        className={`flex-row items-center justify-between border rounded-lg px-4 py-3 
          ${error ? "border-red-500" : "border-gray-300"}
          ${showDropdown ? "border-primary" : ""}`}
      >
        <Text className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption
            ? typeof selectedOption === "object"
              ? selectedOption[labelKey]
              : selectedOption
            : placeholder}
        </Text>
        <Feather
          name={showDropdown ? "chevron-up" : "chevron-down"}
          size={18}
          color="#666"
        />
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      {/* Dropdown container */}
      <Animated.View
        style={{
          position: "absolute",
          top: 55, // adjust based on button height
          left: 0,
          right: 0,
          zIndex: 9999,
          height: animatedHeight,
          opacity: animatedOpacity,
          backgroundColor: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ccc",
          overflow: "hidden",
        }}
        className="bg-white rounded-lg border border-gray-300 mt-1 shadow-md z-20"
      >
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SelectItem
              item={item}
              labelKey={labelKey}
              selected={item === value || item[valueKey] === value}
              onSelect={() => handleSelect(item)}
            />
          )}
          style={{ maxHeight: dropdownHeight }}
          nestedScrollEnabled
        />
      </Animated.View>

      {/* Backdrop to close dropdown when clicking outside */}
      {showDropdown && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            bottom: -screenHeight,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
          onPress={() => setShowDropdown(false)}
        />
      )}
    </View>
  );
};

export const SelectItem = ({
  item,
  labelKey = "label",
  selected,
  onSelect,
}) => {
  const label = typeof item === "object" ? item[labelKey] : item;

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`px-4 py-3 flex-row items-center justify-between ${selected ? "bg-gray-100" : ""}`}
    >
      <Text
        className={`${selected ? "text-primary font-medium" : "text-gray-800"}`}
      >
        {label}
      </Text>
      {selected && <Feather name="check" size={18} color="#2E5B9F" />}
    </TouchableOpacity>
  );
};
