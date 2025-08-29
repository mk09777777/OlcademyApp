import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import Slider from '@react-native-community/slider';
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const FilterModal = ({
  isOpen,
  setIsOpen,
  activeFilters,
  setActiveFilters,
  onApplyFilters,
}) => {
  const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];
  const minPrice = 1;
  const maxPrice = 100;

  const FILTER_OPTIONS = {
  SORT_BY: [
    { label: 'Rating: High to Low', value: 'rating-desc' },
    { label: 'Rating: Low to High', value: 'rating-asc' },
    { label: 'Price: High to Low', value: 'costHighToLow' },
    { label: 'Price: Low to High', value: 'costLowToHigh' },
    { label: 'Distance: Near to Far', value: 'distance-asc' },
    { label: 'Distance: Far to Near', value: 'distance-desc' },
  ],
    CATEGORY: [
      { label: "Vegetarian", value: "veg" },
      { label: "Non-Vegetarian", value: "non-veg" },
    ],
    SPECIAL_FILTERS: [
      { label: "Open Now", value: "openNow" },
      { label: "Top Rated", value: "topRated" },
    ],
    CUISINE: [
      { label: "Punjabi", value: "Punjabi" },
      { label: "Swaminarayan", value: "Swaminarayan" },
      { label: "Gujarati", value: "Gujarati" },
      { label: "South Indian", value: "South indian" },
      { label: "Rajasthani", value: "Rajasthani" },
      { label: "Marathi", value: "Marathi" },
      { label: "Jain", value: "Jain" },
      { label: "Indian", value: "indian" },
    ],
  };

  const filterTabs = [
    { label: "Sort By", value: "sortBy" },
    { label: "Category", value: "category" },
    { label: "Cuisine", value: "cuisine" }, 
    { label: "Rating", value: "rating" },
    { label: "Price Range", value: "price" },
    { label: "Special", value: "special" },
  ];

  const [activeTab, setActiveTab] = useState("sortBy");
  const [localFilters, setLocalFilters] = useState({
    ...activeFilters,
    priceRange: activeFilters.priceRange || [minPrice, maxPrice],
    minRating: activeFilters.minRating || 0,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        ...activeFilters,
        priceRange: activeFilters.priceRange || [minPrice, maxPrice],
        minRating: activeFilters.minRating || 0,
      });
    }
  }, [isOpen, activeFilters]);

  const getFilterCount = () => {
    let count = 0;
    if (localFilters.sortBy) count++;
    if (localFilters.category) count++;
    if (localFilters.cuisine) count++; 
    if (localFilters.minRating && localFilters.minRating > 0) count++;
    if (localFilters.priceRange &&
      (localFilters.priceRange[0] !== minPrice || localFilters.priceRange[1] !== maxPrice)) count++;
    if (localFilters.special) count++;
    return count;
  };

  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value // Always set the value (radio button behavior)
    }));
  };

  const handleRatingChange = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: value
    }));
  };

  const handlePriceChange = (values) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: values
    }));
  };

  const handleClearAll = () => {
    setLocalFilters({
      sortBy: null,
      category: null,
      minRating: 0,
      cuisine: null,
      priceRange: [minPrice, maxPrice],
      special: null,
    });
  };

  const handleApply = () => {
    setActiveFilters(localFilters);
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const displayRating = (val) => (val === 0 ? "Any" : `${val.toFixed(1)}+`);

  const renderRadioButton = (isSelected) => (
    <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
      {isSelected && <View style={styles.radioButtonInner} />}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "sortBy":
        return (
          <ScrollView style={styles.optionsContainer}>
            {FILTER_OPTIONS.SORT_BY.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  localFilters.sortBy === option.value && styles.activeOption,
                ]}
                onPress={() => handleFilterChange("sortBy", option.value)}
              >
                <View style={styles.optionContent}>
                  {renderRadioButton(localFilters.sortBy === option.value)}
                  <Text style={[
                    styles.optionText,
                    localFilters.sortBy === option.value && styles.activeOptionText,
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        );
      case "category":
        return (
          <ScrollView style={styles.optionsContainer}>
            {FILTER_OPTIONS.CATEGORY.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  localFilters.category === option.value && styles.activeOption,
                ]}
                onPress={() => handleFilterChange("category", option.value)}
              >
                <View style={styles.optionContent}>
                  {renderRadioButton(localFilters.category === option.value)}
                  <Text style={[
                    styles.optionText,
                    localFilters.category === option.value && styles.activeOptionText,
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        );
      case "cuisine":
        return (
          <ScrollView style={styles.optionsContainer}>
            {FILTER_OPTIONS.CUISINE.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  localFilters.cuisine === option.value && styles.activeOption,
                ]}
                onPress={() => handleFilterChange("cuisine", option.value)}
              >
                <View style={styles.optionContent}>
                  {renderRadioButton(localFilters.cuisine === option.value)}
                  <Text style={[
                    styles.optionText,
                    localFilters.cuisine === option.value && styles.activeOptionText,
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        );
      case "rating":
        return (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValueText}>
              Minimum Rating: {displayRating(localFilters.minRating)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              minimumTrackTintColor="#e23845"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#e23845"
              value={localFilters.minRating}
              onValueChange={handleRatingChange}
            />
            <View style={styles.ratingSteps}>
              {ratingSteps.map((step) => (
                <Pressable
                  key={step}
                  onPress={() => handleRatingChange(step)}
                  style={[
                    styles.ratingStep,
                    localFilters.minRating === step && styles.activeRatingStep,
                  ]}
                >
                  <Text style={[
                    styles.ratingStepText,
                    localFilters.minRating === step && styles.activeRatingStepText,
                  ]}>
                    {displayRating(step)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case "price":
        return (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValueText}>
              Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
            </Text>
            <View style={styles.rangeSliderContainerm}>
              <Text style={styles.rangeSliderMinMax}>${minPrice}</Text>
              <Text style={styles.rangeSliderMinMax}>${maxPrice}</Text>
            </View>
            <View style={styles.rangeSliderContainer}>
              <Slider
                style={styles.rangeSlider}
                minimumValue={minPrice}
                maximumValue={maxPrice}
                step={1}
                minimumTrackTintColor="#e23845"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#e23845"
                value={localFilters.priceRange[0]}
                onValueChange={(value) => handlePriceChange([value, localFilters.priceRange[1]])}
              />
            </View>
          </View>
        );
      case "special":
        return (
          <ScrollView style={styles.optionsContainer}>
            {FILTER_OPTIONS.SPECIAL_FILTERS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  localFilters.special === option.value && styles.activeOption,
                ]}
                onPress={() => handleFilterChange("special", option.value)}
              >
                <View style={styles.optionContent}>
                  {renderRadioButton(localFilters.special === option.value)}
                  <Text style={[
                    styles.optionText,
                    localFilters.special === option.value && styles.activeOptionText,
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterBoxWrapper}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerText}>Filters</Text>
              {getFilterCount() > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountText}>{getFilterCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.closeBtn}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <ScrollView
              horizontal={false}
              style={styles.sidebar}
              contentContainerStyle={styles.sidebarContent}
            >
              {filterTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  style={[
                    styles.tab,
                    activeTab === tab.value ? styles.activeTab : null,
                  ]}
                  onPress={() => setActiveTab(tab.value)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.value ? styles.activeTabText : null,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.main}>{renderTabContent()}</View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearAll}
            >
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    zIndex: 1000,
  },
  filterBoxWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    width: '100%',
    position: 'relative',
    bottom: 0,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
        fontFamily: 'outfit',
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    padding: 4,
  },
  activeTab: {
    backgroundColor: "#e23845",
  },
  tabText: {
        fontFamily: 'outfit',
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
        fontFamily: 'outfit',
    color: "white",
    fontWeight: "500",
  },
  main: {
    padding: 16,
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0,
    borderBottomColor: "#f0f0f0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeOption: {
    backgroundColor: "#f4f4f4ff",
  },
  optionText: {
        fontFamily: 'outfit-medium',
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  activeOptionText: {
        fontFamily: 'outfit',
    color: "#e23845",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  clearBtn: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e23845",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    color: "#e23845",
    fontWeight: "bold",
  },
  applyBtn: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#e23845",
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
        fontFamily: 'outfit',
    color: "white",
    fontWeight: "bold",
  },
  filterCountBadge: {
    backgroundColor: '#e23845',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterCountText: {
        fontFamily: 'outfit',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    width: 120,
    backgroundColor: "#f5f5f5ff",
  },
  sidebarContent: {
    flexGrow: 1,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: "red",
    borderLeftWidth: 3,
    borderLeftColor: "#e23845",
  },
  tabText: {
        fontFamily: 'outfit-bold',
    color: "#757575",
    fontSize: 15,
  },
  sliderContainer: {
    padding: 10,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValueText: {
        fontFamily: 'outfit-bold',
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  ratingSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ratingStep: {
    padding: 8,
    borderRadius: 8,
  },
  activeRatingStep: {
    backgroundColor: '#e23845',
  },
  ratingStepText: {
        fontFamily: 'outfit',
    fontSize: 14,
    color: '#666',
  },
  activeRatingStepText: {
    color: 'white',
  },
  rangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  rangeSliderContainerm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeSlider: {
    flex: 1,
    height: 40,
  },
  rangeSliderMinMax: {
    width: 100,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e23845',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#e23845',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e23845',
  },
});

export default FilterModal;