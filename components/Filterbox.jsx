// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ScrollView,
// //   TextInput,
// //   Switch,
// //   Modal,
// //   StyleSheet,
// // } from "react-native";
// // import { MaterialIcons } from "@expo/vector-icons";

// // const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];

// // const displayRating = (val) => (val === 0 ? "Any" : val.toFixed(1));
// // const displayCost = (val) => {
// //   if (val <= 60) return "CAN$60 or less";
// //   if (val >= 150) return "CAN$150+";
// //   return `CAN$${val}`;
// // };

// // const Filterbox = ({
// //   isOpen,
// //   setIsOpen,
// //   handleChange,
// //   filters,
// //   onApplyFilters,
// //   sortMapping,
// // }) => {
// //   const sorts = [
// //     { id: "popularity", label: "Popularity", value: "Popularity" },
// //     {
// //       id: "ratingHighToLow",
// //       label: "Rating: High to Low",
// //       value: "HighToLow",
// //     },
// //     { id: "lowToHigh", label: "Cost: Low to High", value: "lowToHigh" },
// //     { id: "highToLow", label: "Cost: High to Low", value: "highToLow" },
// //     { id: "deliveryTime", label: "Distance", value: "deliveryTime" },
// //   ];

// //   const allCuisines = [
// //     { id: "american", label: "American", value: "American" },
// //     { id: "mexican", label: "Mexican", value: "Mexican" },
// //     { id: "italian", label: "Italian", value: "Italian" },
// //     { id: "chinese", label: "Chinese", value: "Chinese" },
// //     { id: "japanese", label: "Japanese", value: "Japanese" },
// //     { id: "thai", label: "Thai", value: "Thai" },
// //     { id: "korean", label: "Korean", value: "Korean" },
// //     { id: "vietnamese", label: "Vietnamese", value: "Vietnamese" },
// //     { id: "indian", label: "Indian", value: "Indian" },
// //     { id: "mediterranean", label: "Mediterranean", value: "Mediterranean" },
// //     { id: "seafood", label: "Seafood", value: "Seafood" },
// //     { id: "fusion", label: "Global Fusion", value: "Fusion" },
// //     { id: "desserts", label: "Desserts & Snacks", value: "Desserts" },
// //     { id: "chains", label: "Popular Chains", value: "Chains" },
// //   ];

// //   const moreFilters = [
// //     // {
// //     //   id: "wheelchairAccessible",
// //     //   label: "Wheelchair accessible",
// //     //   value: "Wheelchair accessible",
// //     // },
// //     {
// //       id: "creditCard",
// //       label: "Credit cards accepted",
// //       value: "Сredit cards accepted",
// //     },
// //     {
// //       id: "dish",
// //       label: "paneer",
// //       value: "paneer",
// //     },
// //     {
// //       id: "parking",
// //       label: "Parking",
// //       value: "Parking",
// //     },
// //     { id: "buffet", label: "Buffet", value: "Buffet" },
// //     { id: "happyHours", label: "Happy Hour", value: "Happy Hour" },
// //     { id: "servesAlcohol", label: "Serves Alcohol", value: "Serves Alcohol" },
// //     { id: "sundayBrunch", label: "Sunday Brunch", value: "Sunday Brunch" },
// //     {
// //       id: "dessertsAndBakes",
// //       label: "Desserts and Bakes",
// //       value: "Desserts and Bakes",
// //     },
// //     { id: "luxuryDining", label: "Luxury Dining", value: "Luxury Dining" },
// //     { id: "cafes", label: "Cafe", value: "Cafe" },
// //     { id: "fineDining", label: "Fine Dining", value: "Fine Dining" },
// //     { id: "wifi", label: "Wi-Fi", value: "Wi-Fi" },
// //     {
// //       id: "outdoorSeating",
// //       label: "Outdoor seating",
// //       value: "Outdoor seating",
// //     },
// //     { id: "onlineBookings", label: "Booking", value: "Booking" },
// //     { id: "hygieneRated", label: "Hygiene Rated", value: "Hygiene Rated" },
// //     { id: "pubsAndBars", label: "Full Bar", value: "Full Bar" },
// //     { id: "liveMusic", label: "Live Music", value: "Live Music" },
// //     { id: "petFriendly", label: "Pet Friendly", value: "Pet Friendly" },
// //     { id: "takeaway", label: "Takeaway", value: "Takeaway" },
// //     { id: "delivery", label: "Delivery", value: "Delivery" },
// //     { id: "tv", label: "TV", value: "TV" },
// //   ];

// //   const filterTabs = [
// //     { label: "Sort by", value: "sort" },
// //     { label: "Cuisines", value: "cuisines" },
// //     { label: "Rating", value: "rating" },
// //     { label: "Cost for two", value: "costForTwo" },
// //     { label: "More filters", value: "moreFilters" },
// //   ];

// //   const [cuisineSearch, setCuisineSearch] = useState("");
// //   const [activeTab, setActiveTab] = useState("sort");
// //   const [localFilters, setLocalFilters] = useState(filters);

// //   useEffect(() => {
// //     if (isOpen) {
// //       setLocalFilters(filters);
// //     }
// //   }, [isOpen, filters]);

// //   const filteredCuisines = allCuisines.filter((c) =>
// //     c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
// //   );

// //   const getFilterCount = () => {
// //     return Object.entries(localFilters).reduce((count, [key, val]) => {
// //       if (val === true || (typeof val === "string" && val !== "")) {
// //         return (
// //           count +
// //           (key === "feature" || key === "cuisines" || key === "others"
// //             ? val.split(",").length
// //             : 1)
// //         );
// //       }
// //       return count;
// //     }, 0);
// //   };

// //   const filterCount = getFilterCount();

// //   const handleRatingChange = (e) => {
// //     const stepIndex = parseInt(e, 10);
// //     const rating = ratingSteps[stepIndex];
// //     setLocalFilters((prev) => ({
// //       ...prev,
// //       minRating: rating > 0 ? rating.toString() : "",
// //       maxRating: rating > 0 ? rating.toString() : "",
// //     }));
// //   };

// //   const handleCostChange = (e) => {
// //     const val = parseInt(e.target.value, 10);
// //     setLocalFilters((prev) => ({
// //       ...prev,
// //       priceRange: `${val}`,
// //     }));
// //   };

// //   const handleSortChange = (value) => {
// //     setLocalFilters((prev) => ({
// //       ...prev,
// //       sortBy: value,
// //     }));
// //   };

// //   const handleCuisineChange = (value, checked) => {
// //     const currentCuisines = localFilters.cuisines
// //       ? localFilters.cuisines.split(",")
// //       : [];
// //     const newCuisines = checked
// //       ? [...currentCuisines, value]
// //       : currentCuisines.filter((c) => c !== value);
// //     setLocalFilters((prev) => ({
// //       ...prev,
// //       cuisines: newCuisines.join(","),
// //     }));
// //   };

// //   const handleMoreFiltersChange = (value, checked) => {
// //     setLocalFilters((prev) => {
// //       if (value === "Serves Alcohol") {
// //         return { ...prev, Alcohol: checked };
// //       } else if (value === "openNow") {
// //         return { ...prev, openNow: checked };
// //       } else if (
// //         [
// //           "Wi-Fi",
// //           "Outdoor seating",
// //           "Takeaway",
// //           "Delivery",
// //           "Booking",
// //           "TV",
// //           "Wheelchair accessible",
// //           "Сredit cards accepted",
// //           "Parking",
// //         ].includes(value)
// //       ) {
// //         const currentFeatures = prev.feature ? prev.feature.split(",") : [];
// //         const newFeatures = checked
// //           ? [...currentFeatures, value]
// //           : currentFeatures.filter((f) => f !== value);
// //         return { ...prev, feature: newFeatures.join(",") };
// //       } else {
// //         const currentOthers = prev.others ? prev.others.split(",") : [];
// //         const newOthers = checked
// //           ? [...currentOthers, value]
// //           : currentOthers.filter((o) => o !== value);
// //         return { ...prev, others: newOthers.join(",") };
// //       }
// //     });
// //   };

// //   const handleClearAll = () => {
// //     const clearedFilters = {
// //       sortBy: "",
// //       cuisines: "",
// //       minRating: "",
// //       dish: "",
// //       maxRating: "",
// //       priceRange: "",
// //       feature: "",
// //       others: "",
// //       Alcohol: false,
// //       openNow: false,
// //       offers: false,
// //     };

// //     setLocalFilters(clearedFilters);
// //     setCuisineSearch("");
// //   };

// //   const handleApply = () => {
// //     Object.entries(localFilters).forEach(([name, value]) => {
// //       handleChange({
// //         target: {
// //           name,
// //           value: typeof value === "boolean" ? value : value || "",
// //           type: typeof value === "boolean" ? "checkbox" : "text",
// //           checked: typeof value === "boolean" ? value : undefined,
// //         },
// //       });
// //     });
// //     if (onApplyFilters) {
// //       onApplyFilters(localFilters);
// //     }
// //     setIsOpen(false);
// //   };

// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case "sort":
// //         return (
// //           <ScrollView style={styles.optionsContainer}>
// //             {sorts.map((item) => (
// //               <TouchableOpacity
// //                 key={item.id}
// //                 style={styles.option}
// //                 onPress={() => handleSortChange(item.value)}
// //               >
// //                 <Text style={styles.optionText}>{item.label}</Text>
// //                 <View style={styles.radioContainer}>
// //                   {localFilters.sortBy === (sortMapping[item.value] || item.value) ? (
// //                     <View style={styles.radioSelected} />
// //                   ) : (
// //                     <View style={styles.radioUnselected} />
// //                   )}
// //                 </View>

// //               </TouchableOpacity>
// //             ))}
// //           </ScrollView>
// //         );
// //       case "cuisines":
// //         return (
// //           <View style={styles.cuisineTabContent}>
// //             <View style={styles.searchBarContainer}>
// //               <MaterialIcons
// //                 name="search"
// //                 size={24}
// //                 color="#757575"
// //                 style={styles.searchIcon}
// //               />
// //               <TextInput
// //                 style={styles.cuisineSearchBar}
// //                 placeholder="Search cuisines..."
// //                 placeholderTextColor="#888"
// //                 value={cuisineSearch}
// //                 onChangeText={setCuisineSearch}
// //               />
// //             </View>
// //             <ScrollView style={styles.cuisineList}>
// //               {filteredCuisines.map((c) => (
// //                 <TouchableOpacity
// //                   key={c.id}
// //                   style={styles.option}
// //                   onPress={() =>
// //                     handleCuisineChange(
// //                       c.value,
// //                       !(
// //                         localFilters.cuisines &&
// //                         localFilters.cuisines.split(",").includes(c.value)
// //                       )
// //                     )
// //                   }
// //                 >
// //                   <Text style={styles.optionText}>{c.label}</Text>
// //                   <View style={styles.checkboxContainer}>
// //                     {localFilters.cuisines &&
// //                       localFilters.cuisines.split(",").includes(c.value) ? (
// //                       <MaterialIcons name="check-box" size={24} color="#4CAF50" />
// //                     ) : (
// //                       <MaterialIcons
// //                         name="check-box-outline-blank"
// //                         size={24}
// //                         color="#757575"
// //                       />
// //                     )}
// //                   </View>
// //                 </TouchableOpacity>
// //               ))}
// //             </ScrollView>
// //           </View>
// //         );
// //       case "rating":
// //         const ratingValue = parseFloat(localFilters.minRating) || 0;
// //         return (
// //           <View style={styles.sliderContainer}>
// //             <Text style={styles.sliderLabel}>
// //               Rating: {displayRating(ratingValue)}
// //             </Text>
// //             <View style={styles.sliderTrack}>
// //               <View
// //                 style={[
// //                   styles.sliderProgress,
// //                   {
// //                     width: `${(ratingSteps.indexOf(ratingValue) / (ratingSteps.length - 1)) * 100}%`,
// //                   },
// //                 ]}
// //               />
// //               {ratingSteps.map((val, index) => (
// //                 <TouchableOpacity
// //                   key={val}
// //                   style={[
// //                     styles.sliderThumb,
// //                     {
// //                       left: `${(index / (ratingSteps.length - 1)) * 100}%`,
// //                       backgroundColor: ratingValue >= val ? "#e23845" : "#ccc",
// //                     },
// //                   ]}
// //                   onPress={() => handleRatingChange(index)}
// //                 />
// //               ))}
// //             </View>
// //             <View style={styles.sliderMarks}>
// //               {ratingSteps.map((val) => (
// //                 <Text key={val} style={styles.sliderMarkText}>
// //                   {displayRating(val)}
// //                 </Text>
// //               ))}
// //             </View>
// //           </View>
// //         );
// //       case "costForTwo":
// //         const costValue = parseInt(localFilters.priceRange, 10) || 60;
// //         return (
// //           <View style={styles.sliderContainer}>
// //             <Text style={styles.sliderLabel}>
// //               Cost for two: {displayCost(costValue)}
// //             </Text>
// //             <View style={styles.sliderTrack}>
// //               <View
// //                 style={[
// //                   styles.sliderProgress,
// //                   {
// //                     width: `${((costValue - 60) / 90) * 100}%`,
// //                   },
// //                 ]}
// //               />
// //               <TouchableOpacity
// //                 style={[
// //                   styles.sliderThumb,
// //                   {
// //                     left: `${((costValue - 60) / 90) * 100}%`,
// //                     backgroundColor: "#e23845",
// //                   },
// //                 ]}
// //                 onPressIn={() => { }}
// //               />
// //             </View>
// //             <View style={styles.sliderMarks}>
// //               <Text style={styles.sliderMarkText}>CAN$60</Text>
// //               <Text style={styles.sliderMarkText}>CAN$150</Text>
// //             </View>
// //           </View>
// //         );
// //       case "moreFilters":
// //         return (
// //           <ScrollView style={styles.optionsContainer}>
// //             {moreFilters.map((m) => {
// //               const isChecked =
// //                 m.value === "Serves Alcohol"
// //                   ? localFilters.Alcohol
// //                   : m.value === "openNow"
// //                     ? localFilters.openNow
// //                     : (localFilters.feature &&
// //                       localFilters.feature.split(",").includes(m.value)) ||
// //                     (localFilters.others &&
// //                       localFilters.others.split(",").includes(m.value));

// //               return (
// //                 <TouchableOpacity
// //                   key={m.id}
// //                   style={styles.option}
// //                   onPress={() => handleMoreFiltersChange(m.value, !isChecked)}
// //                 >
// //                   <Text style={styles.optionText}>{m.label}</Text>
// //                   <View style={styles.checkboxContainer}>
// //                     {isChecked ? (
// //                       <MaterialIcons name="check-box" size={24} color="#e23845" />
// //                     ) : (
// //                       <MaterialIcons
// //                         name="check-box-outline-blank"
// //                         size={24}
// //                         color="#757577"
// //                       />
// //                     )}
// //                   </View>
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </ScrollView>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <Modal
// //       visible={isOpen}
// //       animationType="slide"
// //       transparent={true}
// //       onRequestClose={() => setIsOpen(false)}
// //     >
// //       <View style={styles.modalOverlay}>
// //         <View style={styles.filterBoxWrapper}>
// //           <View style={styles.header}>
// //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// //               <Text style={styles.headerText}>Filters</Text>
// //               {filterCount > 0 && (
// //                 <View style={styles.filterCountBadge}>
// //                   <Text style={styles.filterCountText}>{filterCount}</Text>
// //                 </View>
// //               )}
// //             </View>
// //             <TouchableOpacity
// //               onPress={() => setIsOpen(false)}
// //               style={styles.closeBtn}
// //             >
// //               <MaterialIcons name="close" size={24} color="black" />
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.container}>
// //             <ScrollView
// //               horizontal={false}
// //               style={styles.sidebar}
// //               contentContainerStyle={styles.sidebarContent}
// //             >
// //               {filterTabs.map((tab) => (
// //                 <TouchableOpacity
// //                   key={tab.value}
// //                   style={[
// //                     styles.tab,
// //                     activeTab === tab.value ? styles.activeTab : null,
// //                   ]}
// //                   onPress={() => setActiveTab(tab.value)}
// //                 >
// //                   <Text
// //                     style={[
// //                       styles.tabText,
// //                       activeTab === tab.value ? styles.activeTabText : null,
// //                     ]}
// //                   >
// //                     {tab.label}
// //                   </Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </ScrollView>
// //             <View style={styles.main}>{renderTabContent()}</View>
// //           </View>

// //           <View style={styles.footer}>
// //             <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
// //               <Text style={styles.clearBtnText}>Clear all</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
// //               <Text style={styles.applyBtnText}>Apply</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>
// //     </Modal>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "flex-end",
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: 1000,
// //   },
// //   filterBoxWrapper: {
// //     backgroundColor: "white",
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     maxHeight: "90%",
// //     width: '100%',
// //     position: 'relative',
// //     bottom: 0,
// //     flexGrow: 1,
// //   },
// //   header: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e0e0e0",
// //   },
// //   headerText: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },
// //   closeBtn: {
// //     padding: 4,
// //   },
// //   container: {
// //     flexDirection: "row",
// //     flex: 1,
// //   },
// //   sidebar: {
// //     width: 120,
// //     backgroundColor: "#f5f5f5",
// //   },
// //   sidebarContent: {
// //     flexGrow: 1,
// //   },
// //   tab: {
// //     paddingVertical: 15,
// //     paddingHorizontal: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e0e0e0",
// //     justifyContent: 'center',
// //   },
// //   activeTab: {
// //     backgroundColor: "white",
// //     borderLeftWidth: 3,
// //     borderLeftColor: "#e23845",
// //   },
// //   tabText: {
// //     color: "#757575",
// //     fontSize: 14,
// //   },
// //   activeTabText: {
// //     color: "#000",
// //     fontWeight: "bold",
// //   },
// //   main: {
// //     flex: 3,
// //     padding: 10,
// //     backgroundColor: '#fff',
// //   },
// //   optionsContainer: {
// //     flex: 1,
// //   },
// //   cuisineTabContent: {
// //     flex: 1,
// //   },
// //   option: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     borderBottomWidth: 0,
// //     borderBottomColor: "#f0f0f0",
// //   },
// //   optionText: {
// //     fontSize: 16,
// //   },
// //   radioContainer: {
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10, // half of width/height
// //     borderWidth: 2,
// //     borderColor: '#ccc',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     overflow: 'hidden', // ensure inner circle stays circular
// //   },

// //   radioSelected: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6, // half of width/height
// //     backgroundColor: "#e23845",
// //   },

// //   radioUnselected: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: "transparent",
// //     borderWidth: 0, // no border needed inside
// //   },


// //   checkboxContainer: {
// //     marginLeft: 4,
// //   },
// //   searchBarContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderColor: "#e0e0e0",
// //     borderWidth: 1,
// //     borderRadius: 100,
// //     marginBottom: 16,
// //     height: 40,
// //     paddingHorizontal: 10,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   cuisineSearchBar: {
// //     flex: 1,
// //     height: '100%',
// //     fontSize: 14,
// //     paddingVertical: 0,
// //     paddingHorizontal: 0,
// //   },
// //   footer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     padding: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: "#e0e0e0",
// //   },
// //   clearBtn: {
// //     padding: 12,
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: "#757575",
// //     flex: 1,
// //     marginRight: 8,
// //     alignItems: "center",
// //   },
// //   clearBtnText: {
// //     color: "#757575",
// //     fontWeight: "bold",
// //   },
// //   applyBtn: {
// //     padding: 12,
// //     borderRadius: 8,
// //     backgroundColor: "#e23845",
// //     flex: 1,
// //     marginLeft: 8,
// //     alignItems: "center",
// //   },
// //   applyBtnText: {
// //     color: "white",
// //     fontWeight: "bold",
// //   },
// //   sliderContainer: {
// //     padding: 15,
// //   },
// //   sliderLabel: {
// //     fontSize: 16,
// //     marginBottom: 15,
// //     textAlign: 'center',
// //   },
// //   sliderTrack: {
// //     height: 4,
// //     backgroundColor: '#e0e0e0',
// //     borderRadius: 2,
// //     position: 'relative',
// //     marginBottom: 25,
// //   },
// //   sliderProgress: {
// //     height: 4,
// //     backgroundColor: '#e23845',
// //     borderRadius: 2,
// //     position: 'absolute',
// //     left: 0,
// //   },
// //   sliderThumb: {
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     backgroundColor: '#e23845',
// //     position: 'absolute',
// //     top: -8,
// //     marginLeft: -10,
// //   },
// //   sliderMarks: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   sliderMarkText: {
// //     fontSize: 12,
// //     color: '#666',
// //   },
// //   filterCountBadge: {
// //     backgroundColor: '#e23845',
// //     borderRadius: 10,
// //     width: 20,
// //     height: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginLeft: 8,
// //   },
// //   filterCountText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// // });

// // export default Filterbox;

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
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";

// const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];

// const displayRating = (val) => (val === 0 ? "Any" : val.toFixed(1));
// const displayCost = (val) => {
//   if (val <= 60) return "CAN$60 or less";
//   if (val >= 150) return "CAN$150+";
//   return `CAN$${val}`;
// };

// const Filterbox = ({
//   isOpen,
//   setIsOpen,
//   handleChange,
//   filters,
//   onApplyFilters,
//   sortMapping,
// }) => {
//   const sorts = [
//     { id: "popularity", label: "Popularity", value: "Popularity" },
//     {
//       id: "ratingHighToLow",
//       label: "Rating: High to Low",
//       value: "HighToLow",
//     },
//     { id: "lowToHigh", label: "Cost: Low to High", value: "lowToHigh" },
//     { id: "highToLow", label: "Cost: High to Low", value: "highToLow" },
//     { id: "deliveryTime", label: "Distance", value: "deliveryTime" },
//   ];

//   const allCuisines = [
//     { id: "american", label: "American", value: "American" },
//     { id: "mexican", label: "Mexican", value: "Mexican" },
//     { id: "italian", label: "Italian", value: "Italian" },
//     { id: "chinese", label: "Chinese", value: "Chinese" },
//     { id: "japanese", label: "Japanese", value: "Japanese" },
//     { id: "thai", label: "Thai", value: "Thai" },
//     { id: "korean", label: "Korean", value: "Korean" },
//     { id: "vietnamese", label: "Vietnamese", value: "Vietnamese" },
//     { id: "indian", label: "Indian", value: "Indian" },
//     { id: "mediterranean", label: "Mediterranean", value: "Mediterranean" },
//     { id: "seafood", label: "Seafood", value: "Seafood" },
//     { id: "fusion", label: "Global Fusion", value: "Fusion" },
//     { id: "desserts", label: "Desserts & Snacks", value: "Desserts" },
//     { id: "chains", label: "Popular Chains", value: "Chains" },
//   ];

//   const moreFilters = [
//     {
//       id: "creditCard",
//       label: "Credit cards accepted",
//       value: "Сredit cards accepted",
//     },
//     {
//       id: "dish",
//       label: "paneer",
//       value: "paneer",
//     },
//     {
//       id: "parking",
//       label: "Parking",
//       value: "Parking",
//     },
//     { id: "buffet", label: "Buffet", value: "Buffet" },
//     { id: "happyHours", label: "Happy Hour", value: "Happy Hour" },
//     { id: "servesAlcohol", label: "Serves Alcohol", value: "Serves Alcohol" },
//     { id: "sundayBrunch", label: "Sunday Brunch", value: "Sunday Brunch" },
//     {
//       id: "dessertsAndBakes",
//       label: "Desserts and Bakes",
//       value: "Desserts and Bakes",
//     },
//     { id: "luxuryDining", label: "Luxury Dining", value: "Luxury Dining" },
//     { id: "cafes", label: "Cafe", value: "Cafe" },
//     { id: "fineDining", label: "Fine Dining", value: "Fine Dining" },
//     { id: "wifi", label: "Wi-Fi", value: "Wi-Fi" },
//     {
//       id: "outdoorSeating",
//       label: "Outdoor seating",
//       value: "Outdoor seating",
//     },
//     { id: "onlineBookings", label: "Booking", value: "Booking" },
//     { id: "hygieneRated", label: "Hygiene Rated", value: "Hygiene Rated" },
//     { id: "pubsAndBars", label: "Full Bar", value: "Full Bar" },
//     { id: "liveMusic", label: "Live Music", value: "Live Music" },
//     { id: "petFriendly", label: "Pet Friendly", value: "Pet Friendly" },
//     { id: "takeaway", label: "Takeaway", value: "Takeaway" },
//     { id: "delivery", label: "Delivery", value: "Delivery" },
//     { id: "tv", label: "TV", value: "TV" },
//   ];

//   const filterTabs = [
//     { label: "Sort by", value: "sort" },
//     { label: "Cuisines", value: "cuisines" },
//     { label: "Rating", value: "rating" },
//     { label: "Cost for two", value: "costForTwo" },
//     { label: "More filters", value: "moreFilters" },
//   ];

//   const [cuisineSearch, setCuisineSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("sort");
//   const [localFilters, setLocalFilters] = useState(filters);

//   useEffect(() => {
//     if (isOpen) {
//       setLocalFilters(filters);
//     }
//   }, [isOpen, filters]);

//   const filteredCuisines = allCuisines.filter((c) =>
//     c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
//   );

//   const getFilterCount = () => {
//     return Object.entries(localFilters).reduce((count, [key, val]) => {
//       if (val === true || (typeof val === "string" && val !== "")) {
//         return (
//           count +
//           (key === "feature" || key === "cuisines" || key === "others"
//             ? val.split(",").length
//             : 1)
//         );
//       }
//       return count;
//     }, 0);
//   };

//   const filterCount = getFilterCount();

//   const handleRatingChange = (e) => {
//     const stepIndex = parseInt(e, 10);
//     const rating = ratingSteps[stepIndex];
//     setLocalFilters((prev) => ({
//       ...prev,
//       minRating: rating > 0 ? rating.toString() : "",
//       maxRating: rating > 0 ? rating.toString() : "",
//     }));
//   };

//   const handleCostChange = (e) => {
//     const val = parseInt(e.target.value, 10);
//     setLocalFilters((prev) => ({
//       ...prev,
//       priceRange: `${val}`,
//     }));
//   };

//   const handleSortChange = (value) => {
//     setLocalFilters((prev) => ({
//       ...prev,
//       sortBy: value,
//     }));
//   };

//   const handleCuisineChange = (value, checked) => {
//     const currentCuisines = localFilters.cuisines
//       ? localFilters.cuisines.split(",")
//       : [];
//     const newCuisines = checked
//       ? [...currentCuisines, value]
//       : currentCuisines.filter((c) => c !== value);
//     setLocalFilters((prev) => ({
//       ...prev,
//       cuisines: newCuisines.join(","),
//     }));
//   };

//   const handleMoreFiltersChange = (value, checked) => {
//     setLocalFilters((prev) => {
//       if (value === "Serves Alcohol") {
//         return { ...prev, Alcohol: checked };
//       } else if (value === "openNow") {
//         return { ...prev, openNow: checked };
//       } else if (
//         [
//           "Wi-Fi",
//           "Outdoor seating",
//           "Takeaway",
//           "Delivery",
//           "Booking",
//           "TV",
//           "Wheelchair accessible",
//           "Сredit cards accepted",
//           "Parking",
//         ].includes(value)
//       ) {
//         const currentFeatures = prev.feature ? prev.feature.split(",") : [];
//         const newFeatures = checked
//           ? [...currentFeatures, value]
//           : currentFeatures.filter((f) => f !== value);
//         return { ...prev, feature: newFeatures.join(",") };
//       } else {
//         const currentOthers = prev.others ? prev.others.split(",") : [];
//         const newOthers = checked
//           ? [...currentOthers, value]
//           : currentOthers.filter((o) => o !== value);
//         return { ...prev, others: newOthers.join(",") };
//       }
//     });
//   };

//   const handleClearAll = () => {
//     const clearedFilters = {
//       sortBy: "",
//       cuisines: "",
//       minRating: "",
//       dish: "",
//       maxRating: "",
//       priceRange: "",
//       feature: "",
//       others: "",
//       Alcohol: false,
//       openNow: false,
//       offers: false,
//     };

//     setLocalFilters(clearedFilters);
//     setCuisineSearch("");
//   };

//   const handleApply = () => {
//     Object.entries(localFilters).forEach(([name, value]) => {
//       handleChange({
//         target: {
//           name,
//           value: typeof value === "boolean" ? value : value || "",
//           type: typeof value === "boolean" ? "checkbox" : "text",
//           checked: typeof value === "boolean" ? value : undefined,
//         },
//       });
//     });
//     if (onApplyFilters) {
//       onApplyFilters(localFilters);
//     }
//     setIsOpen(false);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "sort":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {sorts.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.option}
//                 onPress={() => handleSortChange(item.value)}
//               >
//                 <Text style={styles.optionText}>{item.label}</Text>
//                 <View style={styles.radioContainer}>
//                   {localFilters.sortBy === (sortMapping[item.value] || item.value) && (
//                     <View style={styles.radioSelected} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         );
//       case "cuisines":
//         return (
//           <View style={styles.cuisineTabContent}>
//             <View style={styles.searchBarContainer}>
//               <MaterialIcons
//                 name="search"
//                 size={24}
//                 color="#757575"
//                 style={styles.searchIcon}
//               />
//               <TextInput
//                 style={styles.cuisineSearchBar}
//                 placeholder="Search cuisines..."
//                 placeholderTextColor="#888"
//                 value={cuisineSearch}
//                 onChangeText={setCuisineSearch}
//               />
//             </View>
//             <ScrollView style={styles.cuisineList}>
//               {filteredCuisines.map((c) => (
//                 <TouchableOpacity
//                   key={c.id}
//                   style={styles.option}
//                   onPress={() =>
//                     handleCuisineChange(
//                       c.value,
//                       !(
//                         localFilters.cuisines &&
//                         localFilters.cuisines.split(",").includes(c.value)
//                       )
//                     )
//                   }
//                 >
//                   <Text style={styles.optionText}>{c.label}</Text>
//                   <View style={styles.checkboxContainer}>
//                     {localFilters.cuisines &&
//                     localFilters.cuisines.split(",").includes(c.value) ? (
//                       <MaterialIcons name="check-box" size={24} color="#4CAF50" />
//                     ) : (
//                       <MaterialIcons
//                         name="check-box-outline-blank"
//                         size={24}
//                         color="#757575"
//                       />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         );
//       case "rating":
//         const ratingValue = parseFloat(localFilters.minRating) || 0;
//         return (
//           <View style={styles.sliderContainer}>
//             <Text style={styles.sliderLabel}>
//               Rating: {displayRating(ratingValue)}
//             </Text>
//             <View style={styles.sliderTrack}>
//               <View
//                 style={[
//                   styles.sliderProgress,
//                   {
//                     width: `${(ratingSteps.indexOf(ratingValue) / (ratingSteps.length - 1)) * 100}%`,
//                   },
//                 ]}
//               />
//               {ratingSteps.map((val, index) => (
//                 <TouchableOpacity
//                   key={val}
//                   style={[
//                     styles.sliderThumb,
//                     {
//                       left: `${(index / (ratingSteps.length - 1)) * 100}%`,
//                       backgroundColor: ratingValue >= val ? "#e23845" : "#ccc",
//                     },
//                   ]}
//                   onPress={() => handleRatingChange(index)}
//                 />
//               ))}
//             </View>
//             <View style={styles.sliderMarks}>
//               {ratingSteps.map((val) => (
//                 <Text key={val} style={styles.sliderMarkText}>
//                   {displayRating(val)}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         );
//       case "costForTwo":
//         const costValue = parseInt(localFilters.priceRange, 10) || 60;
//         return (
//           <View style={styles.sliderContainer}>
//             <Text style={styles.sliderLabel}>
//               Cost for two: {displayCost(costValue)}
//             </Text>
//             <View style={styles.sliderTrack}>
//               <View
//                 style={[
//                   styles.sliderProgress,
//                   {
//                     width: `${((costValue - 60) / 90) * 100}%`,
//                   },
//                 ]}
//               />
//               <TouchableOpacity
//                 style={[
//                   styles.sliderThumb,
//                   {
//                     left: `${((costValue - 60) / 90) * 100}%`,
//                     backgroundColor: "#e23845",
//                   },
//                 ]}
//                 onPressIn={() => {}}
//               />
//             </View>
//             <View style={styles.sliderMarks}>
//               <Text style={styles.sliderMarkText}>CAN$60</Text>
//               <Text style={styles.sliderMarkText}>CAN$150</Text>
//             </View>
//           </View>
//         );
//       case "moreFilters":
//         return (
//           <ScrollView style={styles.optionsContainer}>
//             {moreFilters.map((m) => {
//               const isChecked =
//                 m.value === "Serves Alcohol"
//                   ? localFilters.Alcohol
//                   : m.value === "openNow"
//                   ? localFilters.openNow
//                   : (localFilters.feature &&
//                       localFilters.feature.split(",").includes(m.value)) ||
//                     (localFilters.others &&
//                       localFilters.others.split(",").includes(m.value));

//               return (
//                 <TouchableOpacity
//                   key={m.id}
//                   style={styles.option}
//                   onPress={() => handleMoreFiltersChange(m.value, !isChecked)}
//                 >
//                   <Text style={styles.optionText}>{m.label}</Text>
//                   <View style={styles.checkboxContainer}>
//                     {isChecked ? (
//                       <MaterialIcons name="check-box" size={24} color="#e23845" />
//                     ) : (
//                       <MaterialIcons
//                         name="check-box-outline-blank"
//                         size={24}
//                         color="#757577"
//                       />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
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
//               {filterCount > 0 && (
//                 <View style={styles.filterCountBadge}>
//                   <Text style={styles.filterCountText}>{filterCount}</Text>
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
//             <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
//               <Text style={styles.clearBtnText}>Clear all</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
//               <Text style={styles.applyBtnText}>Apply</Text>
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
//     bottom: 0,
//     zIndex: 1000,
//   },
//   filterBoxWrapper: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: "90%",
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
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   closeBtn: {
//     padding: 4,
//   },
//   container: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   sidebar: {
//     width: 120,
//     backgroundColor: "#f5f5f5",
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
//     backgroundColor: "white",
//     borderLeftWidth: 3,
//     borderLeftColor: "#e23845",
//   },
//   tabText: {
//     color: "#757575",
//     fontSize: 14,
//   },
//   activeTabText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   main: {
//     flex: 3,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   optionsContainer: {
//     flex: 1,
//   },
//   cuisineTabContent: {
//     flex: 1,
//   },
//   option: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 0,
//     borderBottomColor: "#f0f0f0",
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   radioContainer: {
//     width: 20,
//     height: 20,
//     borderRadius: 10, // half of width/height
//     borderWidth: 2,
//     borderColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden', // ensure inner circle stays circular
//   },
//   radioSelected: {
//     width: 12,
//     height: 12,
//     borderRadius: 6, // half of width/height
//     backgroundColor: "#e23845",
//   },
//   radioUnselected: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "transparent",
//     borderWidth: 0, // no border needed inside
//   },
//   checkboxContainer: {
//     marginLeft: 4,
//   },
//   searchBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: "#e0e0e0",
//     borderWidth: 1,
//     borderRadius: 100,
//     marginBottom: 16,
//     height: 40,
//     paddingHorizontal: 10,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   cuisineSearchBar: {
//     flex: 1,
//     height: '100%',
//     fontSize: 14,
//     paddingVertical: 0,
//     paddingHorizontal: 0,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//   },
//   clearBtn: {
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#757575",
//     flex: 1,
//     marginRight: 8,
//     alignItems: "center",
//   },
//   clearBtnText: {
//     color: "#757575",
//     fontWeight: "bold",
//   },
//   applyBtn: {
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: "#e23845",
//     flex: 1,
//     marginLeft: 8,
//     alignItems: "center",
//   },
//   applyBtnText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   sliderContainer: {
//     padding: 15,
//   },
//   sliderLabel: {
//     fontSize: 16,
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   sliderTrack: {
//     height: 4,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 2,
//     position: 'relative',
//     marginBottom: 25,
//   },
//   sliderProgress: {
//     height: 4,
//     backgroundColor: '#e23845',
//     borderRadius: 2,
//     position: 'absolute',
//     left: 0,
//   },
//   sliderThumb: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#e23845',
//     position: 'absolute',
//     top: -8,
//     marginLeft: -10,
//   },
//   sliderMarks: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   sliderMarkText: {
//     fontSize: 12,
//     color: '#666',
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
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });

// export default Filterbox;

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

const Filterbox = ({
  isOpen,
  setIsOpen,
  handleChange,
  filters,
  onApplyFilters,
  sortMapping,
}) => {
  const sorts = [
    { id: "popularity", label: "Popularity", value: "Popularity" },
    { id: "ratingHighToLow", label: "Rating: High to Low", value: "HighToLow" },
    { id: "lowToHigh", label: "Cost: Low to High", value: "lowToHigh" },
    { id: "highToLow", label: "Cost: High to Low", value: "highToLow" },
    { id: "deliveryTime", label: "Distance", value: "deliveryTime" },
  ];

  const allCuisines = [
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
  ];

  const moreFilters = [
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
  ];

  // The state for managing filter options is simplified
  const [localFilters, setLocalFilters] = useState(filters);
  const [cuisineSearch, setCuisineSearch] = useState("");
  const [openSection, setOpenSection] = useState(null); // New state to manage open/closed sections

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const filteredCuisines = allCuisines.filter((c) =>
    c.label.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

  const getFilterCount = () => {
    return Object.entries(localFilters).reduce((count, [key, val]) => {
      if (val === true || (typeof val === "string" && val !== "")) {
        return (
          count +
          (key === "feature" || key === "cuisines" || key === "others"
            ? val.split(",").length
            : 1)
        );
      }
      return count;
    }, 0);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      sortBy: "",
      cuisines: "",
      minRating: "",
      dish: "",
      maxRating: "",
      priceRange: "",
      feature: "",
      others: "",
      Alcohol: false,
      openNow: false,
      offers: false,
    };
    setLocalFilters(clearedFilters);
    setCuisineSearch("");
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
    setLocalFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleCuisineChange = (value, checked) => {
    const currentCuisines = localFilters.cuisines ? localFilters.cuisines.split(",") : [];
    const newCuisines = checked
      ? [...currentCuisines, value]
      : currentCuisines.filter((c) => c !== value);
    setLocalFilters((prev) => ({ ...prev, cuisines: newCuisines.join(",") }));
  };

  const handleRatingChange = (value) => {
    const rating = ratingSteps[value];
    setLocalFilters((prev) => ({
      ...prev,
      minRating: rating > 0 ? rating.toString() : "",
      maxRating: rating > 0 ? rating.toString() : "",
    }));
  };

  const handleCostChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: `${value}`,
    }));
  };

  const handleMoreFiltersChange = (value, checked) => {
    setLocalFilters((prev) => {
      if (value === "Serves Alcohol") {
        return { ...prev, Alcohol: checked };
      } else {
        const currentFeatures = prev.feature ? prev.feature.split(",") : [];
        const newFeatures = checked
          ? [...currentFeatures, value]
          : currentFeatures.filter((f) => f !== value);
        return { ...prev, feature: newFeatures.join(",") };
      }
    });
  };

  // Helper component to render a section
  const renderSection = (title, content, filterType) => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpenSection(openSection === filterType ? null : filterType)}
      >
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <MaterialIcons
          name={openSection === filterType ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>
      {openSection === filterType && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </View>
  );

  const renderSortOptions = () => (
    <View>
      {sorts.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.option}
          onPress={() => handleSortChange(item.value)}
        >
          <Text style={styles.optionText}>{item.label}</Text>
          <View style={styles.radioContainer}>
            {localFilters.sortBy === (sortMapping[item.value] || item.value) && (
              <View style={styles.radioSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCuisineOptions = () => (
    <View style={styles.cuisineTabContent}>
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={24} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.cuisineSearchBar}
          placeholder="Search cuisines..."
          placeholderTextColor="#888"
          value={cuisineSearch}
          onChangeText={setCuisineSearch}
        />
      </View>
      {filteredCuisines.map((c) => {
        const isChecked = localFilters.cuisines && localFilters.cuisines.split(",").includes(c.value);
        return (
          <TouchableOpacity
            key={c.id}
            style={styles.option}
            onPress={() => handleCuisineChange(c.value, !isChecked)}
          >
            <Text style={styles.optionText}>{c.label}</Text>
            <MaterialIcons
              name={isChecked ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={isChecked ? "#e23845" : "#757577"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderRatingOptions = () => {
    const ratingValue = parseFloat(localFilters.minRating) || 0;
    const ratingIndex = ratingSteps.indexOf(ratingValue);
    const progressWidth = (ratingIndex / (ratingSteps.length - 1)) * 100;

    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Rating: {displayRating(ratingValue)}</Text>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderProgress, { width: `${progressWidth}%` }]} />
          {ratingSteps.map((val, index) => (
            <TouchableOpacity
              key={val}
              style={[styles.sliderThumb, { left: `${(index / (ratingSteps.length - 1)) * 100}%` }]}
              onPress={() => handleRatingChange(index)}
            />
          ))}
        </View>
        <View style={styles.sliderMarks}>
          {ratingSteps.map((val) => (
            <Text key={val} style={styles.sliderMarkText}>
              {displayRating(val)}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  
  const renderCostOptions = () => {
    const costValue = parseInt(localFilters.priceRange, 10) || 60;
    const progressWidth = ((costValue - 60) / 90) * 100;
    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Cost for two: {displayCost(costValue)}</Text>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderProgress, { width: `${progressWidth}%` }]} />
          <TouchableOpacity
            style={[styles.sliderThumb, { left: `${progressWidth}%` }]}
            onPress={() => handleCostChange(costValue)}
          />
        </View>
        <View style={styles.sliderMarks}>
          <Text style={styles.sliderMarkText}>CAN$60</Text>
          <Text style={styles.sliderMarkText}>CAN$150</Text>
        </View>
      </View>
    );
  };
  

  const renderMoreFiltersOptions = () => (
    <View>
      {moreFilters.map((m) => {
        const isChecked = m.value === "Serves Alcohol" ? localFilters.Alcohol : 
                          m.value === "openNow" ? localFilters.openNow :
                          (localFilters.feature && localFilters.feature.split(",").includes(m.value)) ||
                          (localFilters.others && localFilters.others.split(",").includes(m.value));
        return (
          <TouchableOpacity
            key={m.id}
            style={styles.option}
            onPress={() => handleMoreFiltersChange(m.value, !isChecked)}
          >
            <Text style={styles.optionText}>{m.label}</Text>
            <MaterialIcons
              name={isChecked ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={isChecked ? "#e23845" : "#757577"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

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
            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* New vertical layout */}
          <ScrollView style={styles.mainScrollView}>
            {renderSection("Sort by", renderSortOptions(), "sort")}
            {renderSection("Cuisines", renderCuisineOptions(), "cuisines")}
            {renderSection("Rating", renderRatingOptions(), "rating")}
            {renderSection("Cost for two", renderCostOptions(), "costForTwo")}
            {renderSection("More filters", renderMoreFiltersOptions(), "moreFilters")}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply</Text>
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
    padding: 10,
  },
  filterBoxWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    width: '100%',
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
  // New styles for vertical layout
  mainScrollView: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderColor: '#e23845',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  cuisineSearchBar: {
    flex: 1,
    height: '100%',
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
    textAlign: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 25,
  },
  sliderProgress: {
    height: 4,
    backgroundColor: '#e23845',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e23845',
    position: 'absolute',
    top: -8,
    marginLeft: -10,
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMarkText: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#e23845',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Filterbox;