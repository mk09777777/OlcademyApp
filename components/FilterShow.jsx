import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SORT_OPTIONS = [
  { value: "mostPopular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "highestRated", label: "Highest Rated" },
];

const LOCATION_OPTIONS = [
  "Toronto",
  "Vancouver",
  "Montreal",
  "Calgary",
  "Edmonton",
  "Ottawa",
];

const SHOW_TYPES = [
  "Concert",
  "Stand-up",
  "Drama",
  "Workshop",
  "Festival",
];

const TIMING_OPTIONS = [
  { value: "anytime", label: "Anytime" },
  { value: "today", label: "Today" },
  { value: "thisWeekend", label: "This Weekend" },
  { value: "custom", label: "Pick a Date" },
];

const DEFAULT_FILTERS = {
  sortBy: "mostPopular",
  location: null,
  typesOfShow: [],
  timing: "anytime",
  customDate: null,
};

const FilterShow = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setFilters({ ...DEFAULT_FILTERS, ...initialFilters });
      setShowDatePicker(false);
    }
  }, [visible, initialFilters]);

  const activeFilterCount = useMemo(() => {
    let count = filters.sortBy !== DEFAULT_FILTERS.sortBy ? 1 : 0;
    if (filters.location) count += 1;
    if (filters.typesOfShow.length) count += 1;
    if (filters.timing !== DEFAULT_FILTERS.timing || filters.customDate) count += 1;
    return count;
  }, [filters]);

  const handleChipToggle = (key, value) => {
    if (key === "typesOfShow") {
      setFilters((prev) => {
        const exists = prev.typesOfShow.includes(value);
        const nextTypes = exists
          ? prev.typesOfShow.filter((item) => item !== value)
          : [...prev.typesOfShow, value];
        return { ...prev, typesOfShow: nextTypes };
      });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? DEFAULT_FILTERS[key] ?? null : value,
    }));
  };

  const handleTiming = (value) => {
    setFilters((prev) => ({
      ...prev,
      timing: value,
      customDate: value === "custom" ? prev.customDate : null,
    }));
    setShowDatePicker(value === "custom");
  };

  const handleDateChange = (_, selectedDate) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setFilters((prev) => ({ ...prev, customDate: selectedDate, timing: "custom" }));
    }
  };

  const clearAll = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setShowDatePicker(false);
  };

  const applyFilters = () => {
    onApply(filters);
    onClose();
  };

  const formattedCustomDate = filters.customDate
    ? new Date(filters.customDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            {activeFilterCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.chipGroup}>
                {SORT_OPTIONS.map((option) => {
                  const isActive = filters.sortBy === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => handleChipToggle("sortBy", option.value)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.chipGroup}>
                {LOCATION_OPTIONS.map((city) => {
                  const isActive = filters.location === city;
                  return (
                    <TouchableOpacity
                      key={city}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => handleChipToggle("location", city)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {city}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Type</Text>
              <View style={styles.chipGroup}>
                {SHOW_TYPES.map((type) => {
                  const isActive = filters.typesOfShow.includes(type);
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => handleChipToggle("typesOfShow", type)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When</Text>
              <View style={styles.chipGroup}>
                {TIMING_OPTIONS.map((option) => {
                  const isActive =
                    filters.timing === option.value ||
                    (option.value === "custom" && filters.customDate);
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => handleTiming(option.value)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {formattedCustomDate ? (
                <Text style={styles.customDateLabel}>Selected: {formattedCustomDate}</Text>
              ) : null}
              {showDatePicker && (
                <DateTimePicker
                  value={filters.customDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={clearAll}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={applyFilters}>
              <Text style={styles.primaryButtonText}>
                Apply{activeFilterCount ? ` (${activeFilterCount})` : ""}
              </Text>
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
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: "85%",
  },
  grabber: {
    alignSelf: "center",
    width: 48,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    marginLeft: 12,
    backgroundColor: "#02757A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    marginLeft: "auto",
    padding: 4,
  },
  content: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  chipActive: {
    backgroundColor: "#02757A",
    borderColor: "#02757A",
  },
  chipText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  customDateLabel: {
    marginTop: 6,
    color: "#374151",
    fontSize: 13,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#02757A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 12,
  },
  secondaryButtonText: {
    color: "#02757A",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#02757A",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
