import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ratingSteps = [0, 3.5, 4.0, 4.5, 5.0];

const displayRating = (val) => (val === 0 ? "Any" : val.toFixed(1));
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
    {
      id: "ratingHighToLow",
      label: "Rating: High to Low",
      value: "HighToLow",
    },
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
    // {
    //   id: "wheelchairAccessible",
    //   label: "Wheelchair accessible",
    //   value: "Wheelchair accessible",
    // },
    {
      id: "creditCard",
      label: "Credit cards accepted",
      value: "Сredit cards accepted",
    },
    {
      id: "dish",
      label: "paneer",
      value: "paneer",
    },
    {
      id: "parking",
      label: "Parking",
      value: "Parking",
    },
    { id: "buffet", label: "Buffet", value: "Buffet" },
    { id: "happyHours", label: "Happy Hour", value: "Happy Hour" },
    { id: "servesAlcohol", label: "Serves Alcohol", value: "Serves Alcohol" },
    { id: "sundayBrunch", label: "Sunday Brunch", value: "Sunday Brunch" },
    {
      id: "dessertsAndBakes",
      label: "Desserts and Bakes",
      value: "Desserts and Bakes",
    },
    { id: "luxuryDining", label: "Luxury Dining", value: "Luxury Dining" },
    { id: "cafes", label: "Cafe", value: "Cafe" },
    { id: "fineDining", label: "Fine Dining", value: "Fine Dining" },
    { id: "wifi", label: "Wi-Fi", value: "Wi-Fi" },
    {
      id: "outdoorSeating",
      label: "Outdoor seating",
      value: "Outdoor seating",
    },
    { id: "onlineBookings", label: "Booking", value: "Booking" },
    { id: "hygieneRated", label: "Hygiene Rated", value: "Hygiene Rated" },
    { id: "pubsAndBars", label: "Full Bar", value: "Full Bar" },
    { id: "liveMusic", label: "Live Music", value: "Live Music" },
    { id: "petFriendly", label: "Pet Friendly", value: "Pet Friendly" },
    { id: "takeaway", label: "Takeaway", value: "Takeaway" },
    { id: "delivery", label: "Delivery", value: "Delivery" },
    { id: "tv", label: "TV", value: "TV" },
  ];

  const filterTabs = [
    { label: "Sort by", value: "sort" },
    { label: "Cuisines", value: "cuisines" },
    { label: "Rating", value: "rating" },
    { label: "Cost for two", value: "costForTwo" },
    { label: "More filters", value: "moreFilters" },
  ];

  const [cuisineSearch, setCuisineSearch] = useState("");
  const [activeTab, setActiveTab] = useState("sort");
  const [localFilters, setLocalFilters] = useState(filters);

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

  const filterCount = getFilterCount();

  const handleRatingChange = (e) => {
    const stepIndex = parseInt(e, 10);
    const rating = ratingSteps[stepIndex];
    setLocalFilters((prev) => ({
      ...prev,
      minRating: rating > 0 ? rating.toString() : "",
      maxRating: rating > 0 ? rating.toString() : "",
    }));
  };

  const handleCostChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: `${val}`,
    }));
  };

  const handleSortChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  const handleCuisineChange = (value, checked) => {
    const currentCuisines = localFilters.cuisines
      ? localFilters.cuisines.split(",")
      : [];
    const newCuisines = checked
      ? [...currentCuisines, value]
      : currentCuisines.filter((c) => c !== value);
    setLocalFilters((prev) => ({
      ...prev,
      cuisines: newCuisines.join(","),
    }));
  };

  const handleMoreFiltersChange = (value, checked) => {
    setLocalFilters((prev) => {
      if (value === "Serves Alcohol") {
        return { ...prev, Alcohol: checked };
      } else if (value === "openNow") {
        return { ...prev, openNow: checked };
      } else if (
        [
          "Wi-Fi",
          "Outdoor seating",
          "Takeaway",
          "Delivery",
          "Booking",
          "TV",
          "Wheelchair accessible",
          "Сredit cards accepted",
          "Parking",
        ].includes(value)
      ) {
        const currentFeatures = prev.feature ? prev.feature.split(",") : [];
        const newFeatures = checked
          ? [...currentFeatures, value]
          : currentFeatures.filter((f) => f !== value);
        return { ...prev, feature: newFeatures.join(",") };
      } else {
        const currentOthers = prev.others ? prev.others.split(",") : [];
        const newOthers = checked
          ? [...currentOthers, value]
          : currentOthers.filter((o) => o !== value);
        return { ...prev, others: newOthers.join(",") };
      }
    });
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
    Object.entries(localFilters).forEach(([name, value]) => {
      handleChange({
        target: {
          name,
          value: typeof value === "boolean" ? value : value || "",
          type: typeof value === "boolean" ? "checkbox" : "text",
          checked: typeof value === "boolean" ? value : undefined,
        },
      });
    });
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sort":
        return (
          <ScrollView className="flex-1 p-4">
            {sorts.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row justify-between items-center py-4 border-b border-gray-100"
                onPress={() => handleSortChange(item.value)}
              >
                <Text className="text-base font-outfit color-gray-900">{item.label}</Text>
                <View className="w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center">
                  {localFilters.sortBy === (sortMapping[item.value] || item.value) ? (
                    <View className="w-3 h-3 rounded-full bg-primary" />
                  ) : (
                    <View className="w-3 h-3 rounded-full bg-transparent" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case "cuisines":
        return (
          <View className="flex-1">
            <View className="flex-row items-center bg-gray-100 rounded-lg mx-4 mt-4 px-3 py-2">
              <MaterialIcons
                name="search"
                size={24}
                color="#757575"
                className="mr-2"
              />
              <TextInput
                className="flex-1 text-sm font-outfit"
                placeholder="Search cuisines..."
                placeholderTextColor="#888"
                value={cuisineSearch}
                onChangeText={setCuisineSearch}
              />
            </View>
            <ScrollView className="flex-1 px-4">
              {filteredCuisines.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                  onPress={() =>
                    handleCuisineChange(
                      c.value,
                      !(
                        localFilters.cuisines &&
                        localFilters.cuisines.split(",").includes(c.value)
                      )
                    )
                  }
                >
                  <Text className="text-base font-outfit color-gray-900">{c.label}</Text>
                  <View className="ml-1">
                    {localFilters.cuisines &&
                      localFilters.cuisines.split(",").includes(c.value) ? (
                      <MaterialIcons name="check-box" size={24} color="#4CAF50" />
                    ) : (
                      <MaterialIcons
                        name="check-box-outline-blank"
                        size={24}
                        color="#757575"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case "rating":
        const ratingValue = parseFloat(localFilters.minRating) || 0;
        return (
          <View className="p-4">
            <Text className="text-base font-outfit-bold color-gray-900 mb-4">
              Rating: {displayRating(ratingValue)}
            </Text>
            <View className="relative h-8 bg-gray-200 rounded-full mb-4">
              <View
                className="absolute h-full bg-primary rounded-full"
                style={{
                  width: `${(ratingSteps.indexOf(ratingValue) / (ratingSteps.length - 1)) * 100}%`,
                }}
              />
              {ratingSteps.map((val, index) => (
                <TouchableOpacity
                  key={val}
                  className="absolute w-6 h-6 rounded-full border-2 border-white -mt-1"
                  style={{
                    left: `${(index / (ratingSteps.length - 1)) * 100}%`,
                    backgroundColor: ratingValue >= val ? "#e23845" : "#ccc",
                  }}
                  onPress={() => handleRatingChange(index)}
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
      case "costForTwo":
        const costValue = parseInt(localFilters.priceRange, 10) || 60;
        return (
          <View className="p-4">
            <Text className="text-base font-outfit-bold color-gray-900 mb-4 text-center">
              Cost for two: {displayCost(costValue)}
            </Text>
            <View className="relative h-1 bg-gray-200 rounded-full mb-6">
              <View
                className="absolute h-full bg-primary rounded-full"
                style={{
                  width: `${((costValue - 60) / 90) * 100}%`,
                }}
              />
              <TouchableOpacity
                className="absolute w-5 h-5 rounded-full bg-primary -mt-2"
                style={{
                  left: `${((costValue - 60) / 90) * 100}%`,
                  marginLeft: -10,
                }}
                onPressIn={() => { }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs color-gray-500 font-outfit">CAN$60</Text>
              <Text className="text-xs color-gray-500 font-outfit">CAN$150</Text>
            </View>
          </View>
        );
      case "moreFilters":
        return (
          <ScrollView className="flex-1 p-4">
            {moreFilters.map((m) => {
              const isChecked =
                m.value === "Serves Alcohol"
                  ? localFilters.Alcohol
                  : m.value === "openNow"
                    ? localFilters.openNow
                    : (localFilters.feature &&
                      localFilters.feature.split(",").includes(m.value)) ||
                    (localFilters.others &&
                      localFilters.others.split(",").includes(m.value));

              return (
                <TouchableOpacity
                  key={m.id}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100"
                  onPress={() => handleMoreFiltersChange(m.value, !isChecked)}
                >
                  <Text className="text-base font-outfit color-gray-900">{m.label}</Text>
                  <View>
                    {isChecked ? (
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
              );
            })}
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
      <View className="flex-1 bg-black/50 justify-end absolute top-0 left-0 right-0 bottom-0 z-50">
        <View className="bg-white rounded-t-2xl max-h-[90%] mx-0.5 flex-1">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Text className="text-xl font-outfit-bold color-gray-900">Filters</Text>
              {filterCount > 0 && (
                <View className="bg-primary rounded-full w-6 h-6 items-center justify-center ml-2">
                  <Text className="text-white text-xs font-outfit-bold">{filterCount}</Text>
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

          <View className="flex-row flex-1">
            <ScrollView
              className="w-20 bg-gray-100"
              contentContainerClassName="flex-grow"
            >
              {filterTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  className={`py-3.5 px-2 border-b border-gray-200 justify-center ${
                    activeTab === tab.value ? 'bg-white border-l-3 border-l-primary' : ''
                  }`}
                  onPress={() => setActiveTab(tab.value)}
                >
                  <Text
                    className={`text-sm font-outfit ${
                      activeTab === tab.value ? 'color-gray-900 font-outfit-bold' : 'color-gray-500'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="flex-1 bg-white">{renderTabContent()}</View>
          </View>

          <View className="flex-row p-4 border-t border-gray-200 gap-3">
            <TouchableOpacity className="flex-1 py-3 border border-gray-300 rounded-lg items-center" onPress={handleClearAll}>
              <Text className="text-base font-outfit color-gray-700">Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 py-3 bg-primary rounded-lg items-center" onPress={handleApply}>
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
*/

export default Filterbox;