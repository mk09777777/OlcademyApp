import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const FilterShow = ({
  visible,
  onClose,
  onApply,
  initialFilters = {}
}) => {
  const defaultFilters = {
    sortBy: "mostPopular",
    location: null,
    typesOfShow: [],
    timing: "anytime",
    customDate: null,
  };

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...initialFilters,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSortBy = (value) =>
    setFilters(prev => ({ ...prev, sortBy: value }));

  const handleLocation = (loc) =>
    setFilters(prev => ({
      ...prev,
      location: prev.location === loc ? null : loc
    }));

  const handleTypeToggle = (type) => {
    const exists = filters.typesOfShow.includes(type);
    setFilters(prev => ({
      ...prev,
      typesOfShow: exists
        ? prev.typesOfShow.filter(t => t !== type)
        : [...prev.typesOfShow, type],
    }));
  };

  const handleTiming = (value) => {
    setFilters(prev => ({ ...prev, timing: value }));
    if (value === "custom") {
      setShowDatePicker(true);
    }
  };

  const clearAll = () => setFilters(defaultFilters);

  const applyFilters = () => {
    onApply(filters);
    onClose();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFilters(prev => ({
        ...prev,
        customDate: selectedDate,
        timing: "custom",
      }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter Shows</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              {["mostPopular", "newest", "highestRated"].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleSortBy(option)}
                  style={[
                    styles.optionButton,
                    filters.sortBy === option && styles.optionActive
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.sortBy === option && styles.optionTextActive
                    ]}
                  >
                    {option === "mostPopular" ? "Most Popular"
                     : option === "newest" ? "Newest"
                     : "Highest Rated"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location (Canada)</Text>
              {["Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton", "Ottawa"].map(city => (
                <TouchableOpacity
                  key={city}
                  onPress={() => handleLocation(city)}
                  style={[
                    styles.optionButton,
                    filters.location === city && styles.optionActive
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.location === city && styles.optionTextActive
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Type of Show */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type of Show</Text>
              {["Concert", "Stand-up", "Drama", "Workshop", "Festival"].map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleTypeToggle(type)}
                  style={[
                    styles.optionButton,
                    filters.typesOfShow.includes(type) && styles.optionActive
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.typesOfShow.includes(type) && styles.optionTextActive
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Timing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When</Text>
              {["anytime", "today", "thisWeekend", "custom"].map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => handleTiming(t)}
                  style={[
                    styles.optionButton,
                    filters.timing === t && styles.optionActive
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.timing === t && styles.optionTextActive
                    ]}
                  >
                    {t === "anytime" ? "Anytime"
                     : t === "today" ? "Today"
                     : t === "thisWeekend" ? "This Weekend"
                     : "Pick Date"}
                  </Text>
                </TouchableOpacity>
              ))}
              {showDatePicker && (
                <DateTimePicker
                  value={filters.customDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              {filters.customDate && (
                <Text style={{ marginTop: 6, color: "#555" }}>
                  Selected Date: {filters.customDate.toDateString()}
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
              <Text style={{ color: "#02757A" }}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={styles.applyBtn}>
              <Text style={{ color: "#fff" }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default FilterShow;

const styles = StyleSheet.create({
  overlay: {
    flex:1,
    backgroundColor:"rgba(0,0,0,0.4)",
    justifyContent:"flex-end",
  },
  container: {
    backgroundColor:"#fff",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    maxHeight:"85%",
  },
  header: {
    flexDirection:"row",
    justifyContent:"space-between",
    padding:16,
    borderBottomWidth:1,
    borderColor:"#eee",
  },
  headerText: {
    fontSize:18,
    fontWeight:"bold",
  },
  closeText: {
    fontSize:20,
    color:"#444",
  },
  body: {
    paddingHorizontal:16,
  },
  section: {
    marginVertical:12,
  },
  sectionTitle: {
    fontSize:16,
    fontWeight:"600",
    marginBottom:8,
  },
  optionButton: {
    padding:10,
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    marginVertical:4,
  },
  optionActive: {
    backgroundColor:"#02757A",
    borderColor:"#02757A",
  },
  optionText: {
    color:"#333",
    textAlign:"center",
  },
  optionTextActive: {
    color:"#fff",
    fontWeight:"600",
  },
  footer: {
    flexDirection:"row",
    padding:16,
    borderTopWidth:1,
    borderColor:"#eee",
  },
  clearBtn: {
    flex:1,
    alignItems:"center",
    padding:12,
    borderWidth:1,
    borderColor:"#02757A",
    borderRadius:10,
    marginRight:10,
  },
  applyBtn: {
    flex:1,
    alignItems:"center",
    padding:12,
    backgroundColor:"#02757A",
    borderRadius:10,
  },
});
