import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Chip,
  Divider,
  Switch,
  IconButton,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING } from './constants/index';

const FilterModal = ({
  visible,
  onDismiss,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const dietTypes = ['Veg', 'Non-Veg'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const cuisineTypes = [
    'North Indian',
    'South Indian',
    'Gujarati',
    'Maharashtrian',
    'Continental',
    'Chinese',
  ];

  const toggleDietType = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      dietType: prev.dietType.includes(type)
        ? prev.dietType.filter(t => t !== type)
        : [...prev.dietType, type],
    }));
  };

  const toggleMealType = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(type)
        ? prev.mealTypes.filter(t => t !== type)
        : [...prev.mealTypes, type],
    }));
  };

  const toggleCuisineType = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(type)
        ? prev.cuisineTypes.filter(t => t !== type)
        : [...prev.cuisineTypes, type],
    }));
  };

  const handlePriceRangeChange = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleDistanceChange = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      maxDistance: value,
    }));
  };

  const toggleSubscriptionOnly = () => {
    setLocalFilters(prev => ({
      ...prev,
      subscriptionOnly: !prev.subscriptionOnly,
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      dietType: [],
      mealTypes: [],
      priceRange: [0, 1000],
      cuisineTypes: [],
      maxDistance: 10,
      subscriptionOnly: false,
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onDismiss();
  };

  const formatPrice = (value) => `₹${value}`;
  const formatDistance = (value) => `${value} km`;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Filters
          </Text>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Diet Type
            </Text>
            <View style={styles.chipContainer}>
              {dietTypes.map((type) => (
                <Chip
                  key={type}
                  selected={localFilters.dietType.includes(type)}
                  onPress={() => toggleDietType(type)}
                  style={styles.chip}
                >
                  {type}
                </Chip>
              ))}
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Meal Type
            </Text>
            <View style={styles.chipContainer}>
              {mealTypes.map((type) => (
                <Chip
                  key={type}
                  selected={localFilters.mealTypes.includes(type)}
                  onPress={() => toggleMealType(type)}
                  style={styles.chip}
                >
                  {type}
                </Chip>
              ))}
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Cuisine Type
            </Text>
            <View style={styles.chipContainer}>
              {cuisineTypes.map((type) => (
                <Chip
                  key={type}
                  selected={localFilters.cuisineTypes.includes(type)}
                  onPress={() => toggleCuisineType(type)}
                  style={styles.chip}
                >
                  {type}
                </Chip>
              ))}
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Price Range
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.rangeText}>
                {formatPrice(localFilters.priceRange[0])} - {formatPrice(localFilters.priceRange[1])}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000}
                step={50}
                value={localFilters.priceRange}
                onValueChange={handlePriceRangeChange}
                minimumTrackTintColor={COLORS.PRIMARY}
                maximumTrackTintColor={COLORS.DIVIDER}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Maximum Distance
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.rangeText}>
                {formatDistance(localFilters.maxDistance)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={localFilters.maxDistance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor={COLORS.PRIMARY}
                maximumTrackTintColor={COLORS.DIVIDER}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.switchContainer}>
              <Text variant="titleMedium">Subscription Available Only</Text>
              <Switch
                value={localFilters.subscriptionOnly}
                onValueChange={toggleSubscriptionOnly}
                color={COLORS.PRIMARY}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={handleReset}
            style={styles.resetButton}
          >
            Reset
          </Button>
          <Button
            mode="contained"
            onPress={handleApply}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
    margin: SPACING.LG,
    borderRadius: 8,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.LG,
  },
  sectionTitle: {
    marginBottom: SPACING.MD,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  chip: {
    marginBottom: SPACING.XS,
  },
  divider: {
    backgroundColor: COLORS.DIVIDER,
  },
  sliderContainer: {
    marginTop: SPACING.SM,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeText: {
    textAlign: 'center',
    marginBottom: SPACING.SM,
    color: COLORS.TEXT.SECONDARY,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.DIVIDER,
  },
  resetButton: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  applyButton: {
    flex: 1,
  },
});

export default FilterModal; 