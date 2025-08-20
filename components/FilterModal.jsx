import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import all constants from filterutils
import {
    FILTER_TYPES,
    SORT_OPTIONS,
    CUISINE_TYPES,
    DIETARY_TYPES,
    PRICE_RANGES,
    RATING_OPTIONS,
    DELIVERY_TIME_RANGES,
} from '../utils/filterutils';

import modalStyles from '../styles/filterstyle'; 

const FilterModal = ({
    visible,
    onClose,
    onApply,
    filters,
    options
}) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [selectedCategory, setSelectedCategory] = useState(FILTER_TYPES.SORT);

    // Effect to reset filters and category when the modal becomes visible or filters change externally
    useEffect(() => {
        if (visible) {
            setLocalFilters(filters);
            setSelectedCategory(FILTER_TYPES.SORT); 
        }
    }, [visible, filters]);

    // --- Filter Handlers ---
    const handleToggleCuisine = (cuisine) => {
        setLocalFilters(prev => {
            const newCuisines = prev.cuisineTypes.includes(cuisine)
                ? prev.cuisineTypes.filter(c => c !== cuisine)
                : [...prev.cuisineTypes, cuisine];
            return { ...prev, cuisineTypes: newCuisines };
        });
    };

    const handleToggleDietary = (dietary) => {
        setLocalFilters(prev => {
            const newDietary = prev.dietaryTypes.includes(dietary)
                ? prev.dietaryTypes.filter(d => d !== dietary)
                : [...prev.dietaryTypes, dietary];
            return { ...prev, dietaryTypes: newDietary };
        });
    };

    const handleSelectPrice = (range) => {
        setLocalFilters(prev => ({
            ...prev,
            priceRange: prev.priceRange?.label === range.label ? null : range
        }));
    };

    const handleSelectRating = (rating) => {
        setLocalFilters(prev => ({
            ...prev,
            rating: prev.rating === rating.value ? null : rating.value
        }));
    };

    const handleSelectDeliveryTime = (time) => {
        setLocalFilters(prev => ({
            ...prev,
            deliveryTime: prev.deliveryTime?.label === time.label ? null : time
        }));
    };

    const handleSelectSort = (sortType) => {
        setLocalFilters(prev => ({
            ...prev,
            sortBy: prev.sortBy === sortType ? null : sortType
        }));
    };

    // --- Reset All Filters ---
    const handleReset = () => {
        setLocalFilters({
            sortBy: null,
            cuisineTypes: [],
            priceRange: null,
            rating: null,
            dietaryTypes: [],
            deliveryTime: null
        });
    };

    // --- Helper to check if a filter option is currently active (for Chip styling) ---
    const isFilterActive = (type, value) => {
        switch (type) {
            case FILTER_TYPES.SORT:
                return localFilters.sortBy === value;
            case FILTER_TYPES.CUISINE:
                return localFilters.cuisineTypes.includes(value);
            case FILTER_TYPES.PRICE_RANGE:
                return localFilters.priceRange?.label === value?.label;
            case FILTER_TYPES.RATING:
                return localFilters.rating === value?.value;
            case FILTER_TYPES.DIETARY:
                return localFilters.dietaryTypes.includes(value);
            case FILTER_TYPES.DELIVERY_TIME:
                return localFilters.deliveryTime?.label === value?.label;
            default:
                return false;
        }
    };

    // --- Renders the options dynamically based on selected sidebar category ---
    const renderCategoryOptions = () => {
        // Ensure options object and its properties exist before mapping
        if (!options) {
            return <Text style={modalStyles.emptyOptionsText}>Loading options...</Text>;
        }

        switch (selectedCategory) {
            case FILTER_TYPES.SORT:
                return Object.entries(options.sortOptions || SORT_OPTIONS).map(([key, value]) => (
                    <Chip
                        key={key}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.SORT, value)}
                        onPress={() => handleSelectSort(value)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.SORT, value) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.SORT, value) && { color: 'white' }]}
                    >
                        {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                    </Chip>
                ));
            case FILTER_TYPES.CUISINE:
                return (options.cuisineTypes || CUISINE_TYPES).map(cuisine => (
                    <Chip
                        key={cuisine}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.CUISINE, cuisine)}
                        onPress={() => handleToggleCuisine(cuisine)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.CUISINE, cuisine) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.CUISINE, cuisine) && { color: 'white' }]}
                    >
                        {(cuisine || '').split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                    </Chip>
                ));
            case FILTER_TYPES.PRICE_RANGE:
                return (options.priceRanges || PRICE_RANGES).map(range => (
                    <Chip
                        key={range.label}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.PRICE_RANGE, range)}
                        onPress={() => handleSelectPrice(range)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.PRICE_RANGE, range) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.PRICE_RANGE, range) && { color: 'white' }]}
                    >
                        {range.label}
                    </Chip>
                ));
            case FILTER_TYPES.RATING:
                return (options.ratingOptions || RATING_OPTIONS).map(rating => (
                    <Chip
                        key={rating.label}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.RATING, rating)}
                        onPress={() => handleSelectRating(rating)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.RATING, rating) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.RATING, rating) && { color: 'white' }]}
                    >
                        {rating.label}
                    </Chip>
                ));
            case FILTER_TYPES.DIETARY:
                return (options.dietaryTypes || DIETARY_TYPES).map(dietary => (
                    <Chip
                        key={dietary}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.DIETARY, dietary)}
                        onPress={() => handleToggleDietary(dietary)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.DIETARY, dietary) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.DIETARY, dietary) && { color: 'white' }]}
                    >
                        {dietary}
                    </Chip>
                ));
            case FILTER_TYPES.DELIVERY_TIME:
                return (options.deliveryTimeRanges || DELIVERY_TIME_RANGES).map(time => (
                    <Chip
                        key={time.label}
                        mode="outlined"
                        selected={isFilterActive(FILTER_TYPES.DELIVERY_TIME, time)}
                        onPress={() => handleSelectDeliveryTime(time)}
                        style={[modalStyles.chip, isFilterActive(FILTER_TYPES.DELIVERY_TIME, time) && { backgroundColor: '#e23845' }]}
                        textStyle={[modalStyles.chipText, isFilterActive(FILTER_TYPES.DELIVERY_TIME, time) && { color: 'white' }]}
                    >
                        {time.label}
                    </Chip>
                ));
            default:
                return <Text style={modalStyles.emptyOptionsText}>Select a filter category from the left.</Text>;
        }
    };

    // --- Apply Filters and Close Modal ---
    const applyAndClose = () => {
        onApply(localFilters);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    {/* Modal Header */}
                    <View style={modalStyles.modalHeader}>
                        <Text style={modalStyles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Content: Sidebar (Left) and Options (Right) */}
                    <View style={modalStyles.contentContainer}>
                        {/* Sidebar for filter categories */}
                        <View style={modalStyles.sidebar}>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.SORT && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.SORT)}
                            >
                                <MaterialCommunityIcons name="sort" size={24} color={selectedCategory === FILTER_TYPES.SORT ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.SORT && modalStyles.sidebarItemTextSelected]}>Sort By</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.CUISINE && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.CUISINE)}
                            >
                                <MaterialCommunityIcons name="food-fork-drink" size={24} color={selectedCategory === FILTER_TYPES.CUISINE ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.CUISINE && modalStyles.sidebarItemTextSelected]}>Cuisine</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.PRICE_RANGE && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.PRICE_RANGE)}
                            >
                                <MaterialCommunityIcons name="currency-rupee" size={24} color={selectedCategory === FILTER_TYPES.PRICE_RANGE ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.PRICE_RANGE && modalStyles.sidebarItemTextSelected]}>Price</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.RATING && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.RATING)}
                            >
                                <MaterialCommunityIcons name="star-outline" size={24} color={selectedCategory === FILTER_TYPES.RATING ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.RATING && modalStyles.sidebarItemTextSelected]}>Rating</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.DIETARY && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.DIETARY)}
                            >
                                <MaterialCommunityIcons name="leaf" size={24} color={selectedCategory === FILTER_TYPES.DIETARY ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.DIETARY && modalStyles.sidebarItemTextSelected]}>Dietary</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[modalStyles.sidebarItem, selectedCategory === FILTER_TYPES.DELIVERY_TIME && modalStyles.sidebarItemSelected]}
                                onPress={() => setSelectedCategory(FILTER_TYPES.DELIVERY_TIME)}
                            >
                                <MaterialCommunityIcons name="clock-outline" size={24} color={selectedCategory === FILTER_TYPES.DELIVERY_TIME ? '#e23845' : '#555'} />
                                <Text style={[modalStyles.sidebarItemText, selectedCategory === FILTER_TYPES.DELIVERY_TIME && modalStyles.sidebarItemTextSelected]}>Delivery Time</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Options for the selected category (Right Pane) */}
                        <ScrollView style={modalStyles.optionsContainer} contentContainerStyle={modalStyles.optionsContent}>
                            {renderCategoryOptions()}
                        </ScrollView>
                    </View>

                    {/* Modal Footer with Reset and Apply Buttons */}
                    <View style={modalStyles.modalFooter}>
                        <Button
                            mode="outlined"
                            onPress={handleReset}
                            style={modalStyles.resetButton}
                            labelStyle={modalStyles.resetButtonText}
                        >
                            Reset All
                        </Button>
                        <Button
                            mode="contained"
                            onPress={applyAndClose}
                            style={modalStyles.applyButton}
                            labelStyle={modalStyles.applyButtonText}
                        >
                            Apply Filters
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;