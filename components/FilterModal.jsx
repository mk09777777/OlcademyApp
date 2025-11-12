// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Switch,
//   Modal,
//   StyleSheet,
//   Pressable,
// } from "react-native";
// import Slider from '@react-native-community/slider';
// import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// const FilterModal = ({
//   isOpen,
//   setIsOpen,
//   activeFilters,
//   setActiveFilters,
//   onApplyFilters,
// }) => {
//   const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];
//   const minPrice = 1;
//   const maxPrice = 100;

//   const FILTER_OPTIONS = {
//   SORT_BY: [
//     { label: 'Rating: High to Low', value: 'rating-desc' },
//     { label: 'Rating: Low to High', value: 'rating-asc' },
//     { label: 'Price: High to Low', value: 'costHighToLow' },
//     { label: 'Price: Low to High', value: 'costLowToHigh' },
//     { label: 'Distance: Near to Far', value: 'distance-asc' },
//     { label: 'Distance: Far to Near', value: 'distance-desc' },
//   ],
//     CATEGORY: [
//       { label: "Vegetarian", value: "veg" },
//       { label: "Non-Vegetarian", value: "non-veg" },
//     ],
//     SPECIAL_FILTERS: [
//       { label: "Open Now", value: "openNow" },
//       { label: "Top Rated", value: "topRated" },
//     ],
//     CUISINE: [
//       { label: "Punjabi", value: "Punjabi" },
//       { label: "Swaminarayan", value: "Swaminarayan" },
//       { label: "Gujarati", value: "Gujarati" },
//       { label: "South Indian", value: "South indian" },
//       { label: "Rajasthani", value: "Rajasthani" },
//       { label: "Marathi", value: "Marathi" },
//       { label: "Jain", value: "Jain" },
//       { label: "Indian", value: "indian" },
//     ],
//   };

//   const filterTabs = [
//     { label: "Sort By", value: "sortBy" },
//     { label: "Category", value: "category" },
//     { label: "Cuisine", value: "cuisine" }, 
//     { label: "Rating", value: "rating" },
//     { label: "Price Range", value: "price" },
//     { label: "Special", value: "special" },
//   ];

//   const [activeTab, setActiveTab] = useState("sortBy");
//   const [localFilters, setLocalFilters] = useState({
//     ...activeFilters,
//     priceRange: activeFilters.priceRange || [minPrice, maxPrice],
//     minRating: activeFilters.minRating || 0,
//   });

//   useEffect(() => {
//     if (isOpen) {
//       setLocalFilters({
//         ...activeFilters,
//         priceRange: activeFilters.priceRange || [minPrice, maxPrice],
//         minRating: activeFilters.minRating || 0,
//       });
//     }
//   }, [isOpen, activeFilters]);

//   const getFilterCount = () => {
//     let count = 0;
//     if (localFilters.sortBy) count++;
//     if (localFilters.category) count++;
//     if (localFilters.cuisine) count++; 
//     if (localFilters.minRating && localFilters.minRating > 0) count++;
//     if (localFilters.priceRange &&
//       (localFilters.priceRange[0] !== minPrice || localFilters.priceRange[1] !== maxPrice)) count++;
//     if (localFilters.special) count++;
//     return count;
//   };

//   const handleFilterChange = (filterType, value) => {
//     setLocalFilters(prev => ({
//       ...prev,
//       [filterType]: value // Always set the value (radio button behavior)
//     }));
//   };

//   const handleRatingChange = (value) => {
//     setLocalFilters(prev => ({
//       ...prev,
//       minRating: value
//     }));
//   };

//   const handlePriceChange = (values) => {
//     setLocalFilters(prev => ({
//       ...prev,
//       priceRange: values
//     }));
//   };

//   const handleClearAll = () => {
//     setLocalFilters({
//       sortBy: null,
//       category: null,
//       minRating: 0,
//       cuisine: null,
//       priceRange: [minPrice, maxPrice],
//       special: null,
//     });
//   };

//   const handleApply = () => {
//     setActiveFilters(localFilters);
//     if (onApplyFilters) {
//       onApplyFilters(localFilters);
//     }
//     setIsOpen(false);
//   };

//   const displayRating = (val) => (val === 0 ? "Any" : `${val.toFixed(1)}+`);

//   const renderRadioButton = (isSelected) => (
//     <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
//       {isSelected && <View style={styles.radioButtonInner} />}
//     </View>
//   );

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "sortBy":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {FILTER_OPTIONS.SORT_BY.map((option) => (
//               <Pressable
//                 key={option.value}
//                 style={[
//                   styles.option,
//                   localFilters.sortBy === option.value && styles.activeOption,
//                 ]}
//                 onPress={() => handleFilterChange("sortBy", option.value)}
//               >
//                 <View style={styles.optionContent}>
//                   {renderRadioButton(localFilters.sortBy === option.value)}
//                   <Text style={[
//                     styles.optionText,
//                     localFilters.sortBy === option.value && styles.activeOptionText,
//                   ]}>
//                     {option.label}
//                   </Text>
//                 </View>
//               </Pressable>
//             ))}
//           </ScrollView>
//         );
//       case "category":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {FILTER_OPTIONS.CATEGORY.map((option) => (
//               <Pressable
//                 key={option.value}
//                 style={[
//                   styles.option,
//                   localFilters.category === option.value && styles.activeOption,
//                 ]}
//                 onPress={() => handleFilterChange("category", option.value)}
//               >
//                 <View style={styles.optionContent}>
//                   {renderRadioButton(localFilters.category === option.value)}
//                   <Text style={[
//                     styles.optionText,
//                     localFilters.category === option.value && styles.activeOptionText,
//                   ]}>
//                     {option.label}
//                   </Text>
//                 </View>
//               </Pressable>
//             ))}
//           </ScrollView>
//         );
//       case "cuisine":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {FILTER_OPTIONS.CUISINE.map((option) => (
//               <Pressable
//                 key={option.value}
//                 style={[
//                   styles.option,
//                   localFilters.cuisine === option.value && styles.activeOption,
//                 ]}
//                 onPress={() => handleFilterChange("cuisine", option.value)}
//               >
//                 <View style={styles.optionContent}>
//                   {renderRadioButton(localFilters.cuisine === option.value)}
//                   <Text style={[
//                     styles.optionText,
//                     localFilters.cuisine === option.value && styles.activeOptionText,
//                   ]}>
//                     {option.label}
//                   </Text>
//                 </View>
//               </Pressable>
//             ))}
//           </ScrollView>
//         );
//       case "rating":
//         return (
//           <View style={styles.sliderContainer}>
//             <Text style={styles.sliderValueText}>
//               Minimum Rating: {displayRating(localFilters.minRating)}
//             </Text>
//             <Slider
//               style={styles.slider}
//               minimumValue={0}
//               maximumValue={5}
//               step={0.5}
//               minimumTrackTintColor="#e23845"
//               maximumTrackTintColor="#d3d3d3"
//               thumbTintColor="#e23845"
//               value={localFilters.minRating}
//               onValueChange={handleRatingChange}
//             />
//             <View style={styles.ratingSteps}>
//               {ratingSteps.map((step) => (
//                 <Pressable
//                   key={step}
//                   onPress={() => handleRatingChange(step)}
//                   style={[
//                     styles.ratingStep,
//                     localFilters.minRating === step && styles.activeRatingStep,
//                   ]}
//                 >
//                   <Text style={[
//                     styles.ratingStepText,
//                     localFilters.minRating === step && styles.activeRatingStepText,
//                   ]}>
//                     {displayRating(step)}
//                   </Text>
//                 </Pressable>
//               ))}
//             </View>
//           </View>
//         );

//       case "price":
//         return (
//           <View style={styles.sliderContainer}>
//             <Text style={styles.sliderValueText}>
//               Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
//             </Text>
//             <View style={styles.rangeSliderContainerm}>
//               <Text style={styles.rangeSliderMinMax}>${minPrice}</Text>
//               <Text style={styles.rangeSliderMinMax}>${maxPrice}</Text>
//             </View>
//             <View style={styles.rangeSliderContainer}>
//               <Slider
//                 style={styles.rangeSlider}
//                 minimumValue={minPrice}
//                 maximumValue={maxPrice}
//                 step={1}
//                 minimumTrackTintColor="#e23845"
//                 maximumTrackTintColor="#d3d3d3"
//                 thumbTintColor="#e23845"
//                 value={localFilters.priceRange[0]}
//                 onValueChange={(value) => handlePriceChange([value, localFilters.priceRange[1]])}
//               />
//             </View>
//           </View>
//         );
//       case "special":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {FILTER_OPTIONS.SPECIAL_FILTERS.map((option) => (
//               <Pressable
//                 key={option.value}
//                 style={[
//                   styles.option,
//                   localFilters.special === option.value && styles.activeOption,
//                 ]}
//                 onPress={() => handleFilterChange("special", option.value)}
//               >
//                 <View style={styles.optionContent}>
//                   {renderRadioButton(localFilters.special === option.value)}
//                   <Text style={[
//                     styles.optionText,
//                     localFilters.special === option.value && styles.activeOptionText,
//                   ]}>
//                     {option.label}
//                   </Text>
//                 </View>
//               </Pressable>
//             ))}
//           </ScrollView>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       visible={isOpen}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setIsOpen(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.filterBoxWrapper}>
//           <View style={styles.header}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <Text style={styles.headerText}>Filters</Text>
//               {getFilterCount() > 0 && (
//                 <View style={styles.filterCountBadge}>
//                   <Text style={styles.filterCountText}>{getFilterCount()}</Text>
//                 </View>
//               )}
//             </View>
//             <TouchableOpacity
//               onPress={() => setIsOpen(false)}
//               style={styles.closeBtn}
//             >
//               <MaterialIcons name="close" size={24} color="black" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.container}>
//             <ScrollView
//               horizontal={false}
//               style={styles.sidebar}
//               contentContainerStyle={styles.sidebarContent}
//             >
//               {filterTabs.map((tab) => (
//                 <TouchableOpacity
//                   key={tab.value}
//                   style={[
//                     styles.tab,
//                     activeTab === tab.value ? styles.activeTab : null,
//                   ]}
//                   onPress={() => setActiveTab(tab.value)}
//                 >
//                   <Text
//                     style={[
//                       styles.tabText,
//                       activeTab === tab.value ? styles.activeTabText : null,
//                     ]}
//                   >
//                     {tab.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <View style={styles.main}>{renderTabContent()}</View>
//           </View>

//           <View style={styles.footer}>
//             <TouchableOpacity
//               style={styles.clearBtn}
//               onPress={handleClearAll}
//             >
//               <Text style={styles.clearBtnText}>Clear All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.applyBtn}
//               onPress={handleApply}
//             >
//               <Text style={styles.applyBtnText}>Apply Filters</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 10,
//     zIndex: 1000,
//   },
//   filterBoxWrapper: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: "70%",
//     width: '100%',
//     position: 'relative',
//     bottom: 0,
//     flexGrow: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   headerText: {
//         fontFamily: 'outfit',
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   closeBtn: {
//     padding: 4,
//   },
//   activeTab: {
//     backgroundColor: "#e23845",
//   },
//   tabText: {
//         fontFamily: 'outfit',
//     fontSize: 16,
//     color: "#666",
//   },
//   activeTabText: {
//         fontFamily: 'outfit',
//     color: "white",
//     fontWeight: "500",
//   },
//   main: {
//     padding: 16,
//   },
//   optionsContainer: {
//     flex: 1,
//   },
//   option: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     borderBottomWidth: 0,
//     borderBottomColor: "#f0f0f0",
//   },
//   optionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   activeOption: {
//     backgroundColor: "#f4f4f4ff",
//   },
//   optionText: {
//         fontFamily: 'outfit-medium',
//     fontSize: 14,
//     color: "#333",
//     marginLeft: 12,
//   },
//   activeOptionText: {
//         fontFamily: 'outfit',
//     color: "#e23845",
//     fontWeight: "500",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//   },
//   clearBtn: {
//     flex: 1,
//     padding: 12,
//     marginRight: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e23845",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   clearBtnText: {
//     color: "#e23845",
//     fontWeight: "bold",
//   },
//   applyBtn: {
//     flex: 1,
//     padding: 12,
//     marginLeft: 8,
//     borderRadius: 8,
//     backgroundColor: "#e23845",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   applyBtnText: {
//         fontFamily: 'outfit',
//     color: "white",
//     fontWeight: "bold",
//   },
//   filterCountBadge: {
//     backgroundColor: '#e23845',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   filterCountText: {
//         fontFamily: 'outfit',
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   container: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   sidebar: {
//     width: 120,
//     backgroundColor: "#f5f5f5ff",
//   },
//   sidebarContent: {
//     flexGrow: 1,
//   },
//   tab: {
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     justifyContent: 'center',
//   },
//   activeTab: {
//     backgroundColor: "red",
//     borderLeftWidth: 3,
//     borderLeftColor: "#e23845",
//   },
//   tabText: {
//         fontFamily: 'outfit-bold',
//     color: "#757575",
//     fontSize: 15,
//   },
//   sliderContainer: {
//     padding: 10,
//     width: '100%',
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//   },
//   sliderValueText: {
//         fontFamily: 'outfit-bold',
//     fontSize: 16,
//     marginBottom: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   ratingSteps: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   ratingStep: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   activeRatingStep: {
//     backgroundColor: '#e23845',
//   },
//   ratingStepText: {
//         fontFamily: 'outfit',
//     fontSize: 14,
//     color: '#666',
//   },
//   activeRatingStepText: {
//     color: 'white',
//   },
//   rangeSliderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//   },
//   rangeSliderContainerm: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   rangeSlider: {
//     flex: 1,
//     height: 40,
//   },
//   rangeSliderMinMax: {
//     width: 100,
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#666',
//   },
//   radioButton: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#e23845',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioButtonSelected: {
//     borderColor: '#e23845',
//   },
//   radioButtonInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#e23845',
//   },
// });

// export default FilterModal;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Helper functions for rating and cost display
const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];
const displayRating = (val) => (val === 0 ? "Any" : `${val.toFixed(1)}+`);
const displayCost = (val) => {
  if (val <= 60) return "CAN$60 or less";
  if (val >= 150) return "CAN$150+";
  return `CAN$${val}`;
};

const FilterModal = ({
  isOpen,
  setIsOpen,
  activeFilters,
  setActiveFilters,
  onApplyFilters,
}) => {
  const minPrice = 1;
  const maxPrice = 100;

  const FILTER_OPTIONS = {
    SORT_BY: [
      { label: "Popularity", value: "popularity" },
      { label: "Rating: High to Low", value: "rating-desc" },
      { label: "Price: Low to High", value: "costLowToHigh" },
      { label: "Price: High to Low", value: "costHighToLow" },
      { label: "Distance: Near to Far", value: "distance-asc" },
      { label: "Distance: Far to Near", value: "distance-desc" },
    ],
    CUISINE: [
      { id: "american", label: "American", value: "American" },
      { id: "mexican", label: "Mexican", value: "Mexican" },
      { id: "italian", label: "Italian", value: "Italian" },
      { id: "chinese", label: "Chinese", value: "Chinese" },
      { id: "japanese", label: "Japanese", value: "Japanese" },
      { id: "thai", label: "Thai", value: "Thai" },
      { id: "korean", label: "Korean", value: "Korean" },
      { id: "vietnamese", label: "Vietnamese", value: "Vietnamese" },
      { id: "indian", label: "Indian", value: "Indian" },
      { id: "mediterranean", label: "Mediterranean", value: "Mediterranean" },
      { id: "seafood", label: "Seafood", value: "Seafood" },
      { id: "fusion", label: "Global Fusion", value: "Fusion" },
      { id: "desserts", label: "Desserts & Snacks", value: "Desserts" },
      { id: "chains", label: "Popular Chains", value: "Chains" },
    ],
    MORE_FILTERS: [
      { id: "creditCard", label: "Credit cards accepted", value: "Сredit cards accepted" },
      { id: "dish", label: "paneer", value: "paneer" },
      { id: "parking", label: "Parking", value: "Parking" },
      { id: "buffet", label: "Buffet", value: "Buffet" },
      { id: "happyHours", label: "Happy Hour", value: "Happy Hour" },
      { id: "servesAlcohol", label: "Serves Alcohol", value: "Serves Alcohol" },
      { id: "sundayBrunch", label: "Sunday Brunch", value: "Sunday Brunch" },
      { id: "dessertsAndBakes", label: "Desserts and Bakes", value: "Desserts and Bakes" },
      { id: "luxuryDining", label: "Luxury Dining", value: "Luxury Dining" },
      { id: "cafes", label: "Cafe", value: "Cafe" },
      { id: "fineDining", label: "Fine Dining", value: "Fine Dining" },
      { id: "wifi", label: "Wi-Fi", value: "Wi-Fi" },
      { id: "outdoorSeating", label: "Outdoor seating", value: "Outdoor seating" },
      { id: "onlineBookings", label: "Booking", value: "Booking" },
      { id: "hygieneRated", label: "Hygiene Rated", value: "Hygiene Rated" },
      { id: "pubsAndBars", label: "Full Bar", value: "Full Bar" },
      { id: "liveMusic", label: "Live Music", value: "Live Music" },
      { id: "petFriendly", label: "Pet Friendly", value: "Pet Friendly" },
      { id: "takeaway", label: "Takeaway", value: "Takeaway" },
      { id: "delivery", label: "Delivery", value: "Delivery" },
      { id: "tv", label: "TV", value: "TV" },
    ],
  };

  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [cuisineSearch, setCuisineSearch] = useState("");
  const [openSection, setOpenSection] = useState("sortBy"); // Set initial open section

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);

  const getFilterCount = () => {
    let count = 0;
    if (localFilters.sortBy) count++;
    if (localFilters.category) count++;
    if (localFilters.cuisine) count++;
    if (localFilters.minRating && localFilters.minRating > 0) count++;
    if (
      localFilters.priceRange &&
      (localFilters.priceRange[0] !== minPrice ||
        localFilters.priceRange[1] !== maxPrice)
    )
      count++;
    if (localFilters.special) count++;
    return count;
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
    setCuisineSearch("");
  };

  const handleApply = () => {
    setActiveFilters(localFilters);
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const handleFilterChange = (filterType, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleRatingChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      minRating: value,
    }));
  };

  const handlePriceChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: [value, prev.priceRange[1]],
    }));
  };

  const renderSection = (title, content, filterType) => (
    <View className="mb-4">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg"
        onPress={() =>
          setOpenSection(openSection === filterType ? null : filterType)
        }
      >
        <Text className="text-base font-outfit-bold color-gray-900">{title}</Text>
        <MaterialIcons
          name={
            openSection === filterType
              ? "keyboard-arrow-up"
              : "keyboard-arrow-down"
          }
          size={24}
          color="#333"
        />
      </TouchableOpacity>
      {openSection === filterType && (
        <View className="p-4">{content()}</View>
      )}
    </View>
  );

  const renderSortOptions = () => (
    <View>
      {FILTER_OPTIONS.SORT_BY.map((option) => (
        <TouchableOpacity
          key={option.value}
          className="flex-row justify-between items-center py-3 border-b border-gray-100"
          onPress={() => handleFilterChange("sortBy", option.value)}
        >
          <Text className="text-base font-outfit color-gray-900">{option.label}</Text>
          <View className="w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center">
            {localFilters.sortBy === option.value && (
              <View className="w-3 h-3 rounded-full bg-primary" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCuisineOptions = () => (
    <View>
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
        <MaterialIcons name="search" size={24} color="#757575" className="mr-2" />
        <TextInput
          className="flex-1 text-sm font-outfit"
          placeholder="Search cuisines..."
          placeholderTextColor="#888"
          value={cuisineSearch}
          onChangeText={setCuisineSearch}
        />
      </View>
      <ScrollView className="max-h-48">
        {FILTER_OPTIONS.CUISINE.filter((c) =>
          c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
        ).map((option) => (
          <TouchableOpacity
            key={option.value}
            className="flex-row justify-between items-center py-3 border-b border-gray-100"
            onPress={() => handleFilterChange("cuisine", option.value)}
          >
            <Text className="text-base font-outfit color-gray-900">{option.label}</Text>
            <View>
              {localFilters.cuisine === option.value ? (
                <MaterialIcons name="check-box" size={24} color="#e23845" />
              ) : (
                <MaterialIcons
                  name="check-box-outline-blank"
                  size={24}
                  color="#757577"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRatingOptions = () => (
    <View className="p-4">
      <Text className="text-base font-outfit-bold color-gray-900 mb-4 text-center">
        Rating: {displayRating(localFilters.minRating)}
      </Text>
      <View className="relative h-8 bg-gray-200 rounded-full mb-6">
        <View
          className="absolute h-full bg-primary rounded-full"
          style={{
            width: `${(localFilters.minRating / 5) * 100}%`,
          }}
        />
        {ratingSteps.map((val) => (
          <TouchableOpacity
            key={val}
            className="absolute w-6 h-6 rounded-full bg-primary border-2 border-white -mt-1"
            style={{
              left: `${(val / 5) * 100}%`,
              marginLeft: -12,
            }}
            onPress={() => handleRatingChange(val)}
          />
        ))}
      </View>
      <View className="flex-row justify-between">
        {ratingSteps.map((val) => (
          <Text key={val} className="text-xs color-gray-500 font-outfit">
            {displayRating(val)}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderPriceOptions = () => (
    <View className="p-4">
      <Text className="text-base font-outfit-bold color-gray-900 mb-4 text-center">
        Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
      </Text>
      <View className="relative h-8 bg-gray-200 rounded-full mb-6">
        <View
          className="absolute h-full bg-primary rounded-full"
          style={{
            width: `${(localFilters.priceRange[0] / 100) * 100}%`,
          }}
        />
        <TouchableOpacity
          className="absolute w-6 h-6 rounded-full bg-primary border-2 border-white -mt-1"
          style={{
            left: `${(localFilters.priceRange[0] / 100) * 100}%`,
            marginLeft: -12,
          }}
          onPress={() => handlePriceChange(localFilters.priceRange[0])}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs color-gray-500 font-outfit">${minPrice}</Text>
        <Text className="text-xs color-gray-500 font-outfit">${maxPrice}</Text>
      </View>
    </View>
  );

  const renderSpecialOptions = () => (
    <View>
      {FILTER_OPTIONS.MORE_FILTERS.map((option) => (
        <TouchableOpacity
          key={option.value}
          className="flex-row justify-between items-center py-3 border-b border-gray-100"
          onPress={() => handleFilterChange("special", option.value)}
        >
          <Text className="text-base font-outfit color-gray-900">{option.label}</Text>
          <View>
            {localFilters.special === option.value ? (
              <MaterialIcons name="check-box" size={24} color="#e23845" />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={24}
                color="#757577"
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsOpen(false)}
    >
      <View className="flex-1 bg-black/50 justify-end p-2.5">
        <View className="bg-white rounded-t-2xl max-h-[90%] flex-1">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Text className="text-xl font-outfit-bold color-gray-900">Filters</Text>
              {getFilterCount() > 0 && (
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center ml-2">
                  <Text className="text-white text-xs font-outfit-bold">{getFilterCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="p-1"
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {renderSection("Sort by", renderSortOptions, "sortBy")}
            {renderSection("Cuisines", renderCuisineOptions, "cuisine")}
            {renderSection("Rating", renderRatingOptions, "rating")}
            {renderSection("Price Range", renderPriceOptions, "price")}
            {renderSection("Special", renderSpecialOptions, "special")}
          </ScrollView>

          <View className="flex-row p-4 border-t border-gray-200 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
              onPress={handleClearAll}
            >
              <Text className="text-base font-outfit color-gray-700">Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 bg-primary rounded-lg items-center"
              onPress={handleApply}
            >
              <Text className="text-base font-outfit-bold text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  // All styles converted to NativeWind classes above
});

  },
  filterBoxWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    width: "100%",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    padding: 4,
  },
  mainScrollView: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  radioContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e23845",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e23845",
  },
  checkboxContainer: {
    marginLeft: 4,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  cuisineSearchBar: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sliderContainer: {
    paddingVertical: 10,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    position: "relative",
    marginBottom: 25,
  },
  sliderProgress: {
    height: 4,
    backgroundColor: "#e23845",
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e23845",
    position: "absolute",
    top: -8,
    marginLeft: -10,
  },
  sliderMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderMarkText: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  clearBtn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#757575",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#757575",
    fontWeight: "bold",
  },
  applyBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e23845",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  applyBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  filterCountBadge: {
    backgroundColor: "#e23845",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filterCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});*/

export default FilterModal;