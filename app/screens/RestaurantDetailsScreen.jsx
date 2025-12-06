// import React from 'react';
// import { View, Text, TouchableOpacity, Linking, ScrollView, Image, FlatList } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router';

// /*
// === ORIGINAL CSS REFERENCE ===
// container: {
//   flex: 1,
//   backgroundColor: '#f8f8f8',
// }

// contentContainer: {
//   paddingBottom: 80,
// }

// header: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   padding: 16,
//   backgroundColor: '#fff',
//   borderBottomWidth: 1,
//   borderBottomColor: '#eee',
// }

// backButton: {
//   marginRight: 16,
// }

// headerTitle: {
//   fontSize: 18,
//   fontWeight: '600',
//   color: '#000',
// }

// restaurantImage: {
//   height: 220,
//   width: '100%',
//   resizeMode: 'cover',
// }

// imagePlaceholder: {
//   height: 220,
//   backgroundColor: '#E03546',
//   justifyContent: 'center',
//   alignItems: 'center',
// }

// infoContainer: {
//   paddingHorizontal: 16,
//   paddingTop: 16,
// }

// title: {
//   fontSize: 24,
//   fontWeight: 'bold',
//   marginTop: 8,
//   color: '#333',
// }

// ratingContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginTop: 8,
//   marginBottom: 8,
// }

// ratingBadge: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   backgroundColor: '#51C452',
//   borderRadius: 4,
//   paddingVertical: 2,
//   paddingHorizontal: 6,
//   marginRight: 8,
// }

// ratingText: {
//   marginLeft: 4,
//   fontWeight: 'bold',
//   color: '#fff',
//   fontSize: 12,
// }

// ratingCount: {
//   color: '#666',
//   fontSize: 12,
// }

// subtitle: {
//   color: '#666',
//   marginTop: 4,
//   fontSize: 14,
// }

// addressContainer: {
//   flexDirection: 'row',
//   marginTop: 12,
//   marginBottom: 16,
// }

// address: {
//   color: '#666',
//   marginLeft: 4,
//   fontSize: 14,
//   flex: 1,
// }

// featuresContainer: {
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   marginBottom: 16,
//   gap: 8,
// }

// featurePill: {
//   backgroundColor: '#f0f0f0',
//   borderRadius: 14,
//   paddingHorizontal: 12,
//   paddingVertical: 6,
// }

// featureText: {
//   color: '#666',
//   fontSize: 12,
// }

// actionsRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   marginHorizontal: 16,
//   marginVertical: 12,
//   paddingHorizontal: 8,
// }

// iconButton: {
//   alignItems: 'center',
//   padding: 8,
//   minWidth: 60,
// }

// iconButtonText: {
//   color: '#E03546',
//   marginTop: 4,
//   fontSize: 12,
//   fontWeight: '500',
// }

// divider: {
//   height: 8,
//   backgroundColor: '#f0f0f0',
//   marginVertical: 12,
// }

// infoRow: {
//   flexDirection: 'row',
//   marginTop: 10,
//   alignItems: 'flex-start',
// }

// infoText: {
//   color: '#666',
//   marginLeft: 8,
//   fontSize: 14,
//   flex: 1,
// }

// section: {
//   paddingHorizontal: 16,
//   marginBottom: 16,
// }

// sectionTitle: {
//   fontWeight: '600',
//   fontSize: 18,
//   marginBottom: 12,
//   color: '#333',
// }

// hoursRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   marginBottom: 8,
//   paddingRight: 16,
// }

// hoursDay: {
//   fontWeight: '500',
//   color: '#333',
// }

// hoursTime: {
//   color: '#666',
// }

// feedbackText: {
//   color: '#666',
//   marginBottom: 8,
// }

// feedbackButton: {
//   backgroundColor: '#fff',
//   borderWidth: 1,
//   borderColor: '#E03546',
//   borderRadius: 6,
//   padding: 12,
//   alignItems: 'center',
// }

// feedbackButtonText: {
//   color: '#E03546',
//   fontWeight: '500',
// }

// footer: {
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: '#fff',
//   padding: 16,
//   borderTopWidth: 1,
//   borderTopColor: '#eee',
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: -2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 4,
//   elevation: 5,
// }

// button: {
//   backgroundColor: '#E03546',
//   paddingVertical: 14,
//   alignItems: 'center',
//   borderRadius: 8,
// }

// buttonText: {
//   color: '#fff',
//   fontSize: 16,
//   fontWeight: 'bold',
// }
// === END CSS REFERENCE ===
// */

// const RestaurantDetailsScreen = () => {
//   const params = useLocalSearchParams();
  
//   // Parse the restaurant data passed from FirmDetailsTakeAway
//   const restaurant = params.restaurant ? JSON.parse(params.restaurant) : {
//     restaurantInfo: {
//       name: "The Spice Garden",
//       ratings: {
//         overall: 4.5,
//         totalReviews: 1200
//       },
//       cuisines: ["Indian, Chinese, Continental"],
//       priceRange: "CAN$31 to CAN$50",
//       address: "123 Food Street, Bangalore, Karnataka 560001",
//       phoneNo: "+919876543210",
//       website: "http://example.com",
//       additionalInfo: {
//         parking: "Available",
//         diningStyle: "Casual Dining",
//         dressCode: "Casual",
//         publicTransit: "Nearby station"
//       },
//       overview: "A wonderful dining experience with authentic flavors and excellent service. Our chefs bring decades of experience to create memorable dishes."
//     },
//     opening_hours: {
//       MondayMon: "11:30AM-10PM",
//       TuesdayTue: "11:30AM-10PM",
//       WednesdayWed: "11:30AM-10:30PM",
//       ThursdayThu: "11:30AM-11PM",
//       FridayFri: "11:30AM-11PM",
//       SaturdaySat: "10:30AM-11PM",
//       SundaySun: "10:30AM-10PM"
//     },
//     features: ["Outdoor seating", "Takeaway", "Сredit cards accepted", "Full Bar", "Free Wifi"],
//     image_urls: []
//   };

//   // const renderHours = () => {
//   //   if (!restaurant.opening_hours) return null;
    
//   //   return Object.entries(restaurant.opening_hours).map(([day, hours]) => (
//   //     <View key={day} className="flex-row justify-between mb-2 pr-4">
//   //       <Text className="font-medium text-gray-800">{day.replace(/[a-z]/gi, '')}:</Text>
//   //       <Text className="text-gray-600">{hours}</Text>
//   //     </View>
//   //   ));
//   // };
//   const renderHours = () => {
//     if (!restaurant.opening_hours) return null;
    
//     return Object.entries(restaurant.opening_hours).map(([day, hours]) => (
//       <View key={day} className="flex-row justify-between mb-2 pr-4">
//         {/* FIX: Use slice(0, -3) to remove the last 3 chars (e.g., "Mon") */}
//         <Text className="font-medium text-gray-800">{day.slice(0, -3)}:</Text>
//         <Text className="text-gray-600">{hours}</Text>
//       </View>
//     ));
//   };

//   const renderFeatures = () => {
//     if (!restaurant.features) return null;
    
//     return (
//       <View className="flex-row flex-wrap mb-4 gap-2">
//         {restaurant.features.slice(0, 5).map((feature, index) => (
//           <View key={index} className="bg-gray-100 rounded-full px-3 py-1.5">
//             <Text className="text-gray-600 text-xs">{feature}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <>
//       <ScrollView contentContainerStyle={{paddingBottom: 80}}>
//         {/* Header with back button */}
//         <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
//           <TouchableOpacity onPress={() => router.back()} className="mr-4">
//             <Ionicons name="chevron-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text className="text-lg font-semibold text-black">Restaurant Details</Text>
//         </View>

//         {/* Restaurant Image */}
//         {restaurant.image_urls?.length > 0 ? (
//           <Image 
//             source={{ uri: restaurant.image_urls[0] }} 
//             className="h-56 w-full"
//             style={{resizeMode: 'cover'}}
//           />
//         ) : (
//           <View className="h-56 bg-red-500 justify-center items-center">
//             <FontAwesome name="cutlery" size={50} color="#fff" />
//           </View>
//         )}

//         <View className="px-4 pt-4">
//           <Text className="text-2xl font-bold mt-2 text-gray-800">{restaurant.restaurantInfo?.name}</Text>
          
//           <View className="flex-row items-center mt-2 mb-2">
//             <View className="flex-row items-center bg-green-500 rounded px-1.5 py-0.5 mr-2">
//               <FontAwesome name="star" size={14} color="#fff" />
//               <Text className="ml-1 font-bold text-white text-xs">{restaurant.restaurantInfo?.ratings?.overall || '4.2'}</Text>
//             </View>
//             <Text className="text-gray-600 text-xs">({restaurant.restaurantInfo?.ratings?.totalReviews || '500+'} reviews)</Text>
//           </View>

//           {restaurant.restaurantInfo?.cuisines && (
//             <Text className="text-gray-600 mt-1 text-sm">
//               <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="#666" /> 
//               {Array.isArray(restaurant.restaurantInfo.cuisines) 
//                 ? restaurant.restaurantInfo.cuisines.join(", ") 
//                 : restaurant.restaurantInfo.cuisines}
//             </Text>
//           )}
          
//           {restaurant.restaurantInfo?.priceRange && (
//             <Text className="text-gray-600 mt-1 text-sm">
//               <Entypo name="price-tag" size={14} color="#666" /> 
//               {restaurant.restaurantInfo.priceRange}
//             </Text>
//           )}

//           <View className="flex-row mt-3 mb-4">
//             <MaterialIcons name="location-on" size={16} color="#666" />
//             <Text className="text-gray-600 ml-1 text-sm flex-1">{restaurant.restaurantInfo?.address}</Text>
//           </View>

//           {/* Features */}
//           {renderFeatures()}
//         </View>

//         {/* Action Icons */}
//         <View className="flex-row justify-around mx-4 my-3 px-2">
//           {restaurant.restaurantInfo?.phoneNo && (
//             <TouchableOpacity 
//               className="items-center p-2 min-w-[60px]" 
//               onPress={() => Linking.openURL(`tel:${restaurant.restaurantInfo.phoneNo}`)}
//             >
//               <Ionicons name="call-outline" size={20} color="#E03546" />
//               <Text className="text-red-500 mt-1 text-xs font-medium">Call</Text>
//             </TouchableOpacity>
//           )}
          
//           {restaurant.restaurantInfo?.address && (
//             <TouchableOpacity 
//               className="items-center p-2 min-w-[60px]"
//               onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.restaurantInfo.address}`)}
//             >
//               <MaterialIcons name="directions" size={20} color="#E03546" />
//               <Text className="text-red-500 mt-1 text-xs font-medium">Directions</Text>
//             </TouchableOpacity>
//           )}
          
//           <TouchableOpacity className="items-center p-2 min-w-[60px]">
//             <Ionicons name="share-social-outline" size={20} color="#E03546" />
//             <Text className="text-red-500 mt-1 text-xs font-medium">Share</Text>
//           </TouchableOpacity>
          
//           {restaurant.restaurantInfo?.website && (
//             <TouchableOpacity 
//               className="items-center p-2 min-w-[60px]"
//               onPress={() => Linking.openURL(restaurant.restaurantInfo.website)}
//             >
//               <MaterialCommunityIcons name="web" size={20} color="#E03546" />
//               <Text className="text-red-500 mt-1 text-xs font-medium">Website</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Divider */}
//         <View className="h-2 bg-gray-100 my-3" />

//         {/* Restaurant Overview */}
//         {restaurant.restaurantInfo?.overview && (
//           <View className="px-4 mb-4">
//             <Text className="font-semibold text-lg mb-3 text-gray-800">About</Text>
//             <Text className="text-gray-600 ml-2 text-sm flex-1">{restaurant.restaurantInfo.overview}</Text>
//           </View>
//         )}

//         {/* Additional Info */}
//         {restaurant.restaurantInfo?.additionalInfo && (
//           <View className="px-4 mb-4">
//             <Text className="font-semibold text-lg mb-3 text-gray-800">Details</Text>
//             {restaurant.restaurantInfo.additionalInfo.diningStyle && (
//               <View className="flex-row mt-2.5 items-start">
//                 <FontAwesome5 name="utensils" size={16} color="#666" />
//                 <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.diningStyle}</Text>
//               </View>
//             )}
//             {restaurant.restaurantInfo.additionalInfo.dressCode && (
//               <View className="flex-row mt-2.5 items-start">
//                 <MaterialCommunityIcons name="tshirt-crew-outline" size={16} color="#666" />
//                 <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.dressCode}</Text>
//               </View>
//             )}
//             {restaurant.restaurantInfo.additionalInfo.parking && (
//               <View className="flex-row mt-2.5 items-start">
//                 <MaterialCommunityIcons name="parking" size={16} color="#666" />
//                 <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.parking}</Text>
//               </View>
//             )}
//             {restaurant.restaurantInfo.additionalInfo.publicTransit && (
//               <View className="flex-row mt-2.5 items-start">
//                 <MaterialCommunityIcons name="train-car" size={16} color="#666" />
//                 <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.publicTransit}</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Hours */}
//         {restaurant.opening_hours && (
//           <View className="px-4 mb-4">
//             <Text className="font-semibold text-lg mb-3 text-gray-800">Hours</Text>
//             {renderHours()}
//           </View>
//         )}

//         {/* Divider */}
//         <View className="h-2 bg-gray-100 my-3" />

//         {/* Feedback */}
//         <View className="px-4 mb-4">
//           <Text className="font-semibold text-lg mb-3 text-gray-800">Feedback</Text>
//           <Text className="text-gray-600 mb-2">Had a bad experience here?</Text>
//           <TouchableOpacity className="bg-white border border-red-500 rounded-md p-3 items-center">
//             <Text className="text-red-500 font-medium">Report an issue</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg">
//         <TouchableOpacity 
//           className="bg-red-500 py-3.5 items-center rounded-lg" 
//           onPress={() => router.back()}
//         >
//           <Text className="text-white text-base font-bold">Back to Menu</Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };



// export default RestaurantDetailsScreen; 

import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RestaurantDetailsScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter(); // Added router
  
  // Parse the restaurant data passed from FirmDetailsTakeAway
  const restaurant = params.restaurant ? JSON.parse(params.restaurant) : {
    restaurantInfo: {
      name: "The Spice Garden",
      ratings: {
        overall: 4.5,
        totalReviews: 1200
      },
      cuisines: ["Indian, Chinese, Continental"],
      priceRange: "CAN$31 to CAN$50",
      address: "123 Food Street, Bangalore, Karnataka 560001",
      phoneNo: "+919876543210",
      website: "http://example.com",
      additionalInfo: {
        parking: "Available",
        diningStyle: "Casual Dining",
        dressCode: "Casual",
        publicTransit: "Nearby station"
      },
      overview: "A wonderful dining experience with authentic flavors and excellent service. Our chefs bring decades of experience to create memorable dishes."
    },
    opening_hours: {
      MondayMon: "11:30AM-10PM",
      TuesdayTue: "11:30AM-10PM",
      WednesdayWed: "11:30AM-10:30PM",
      ThursdayThu: "11:30AM-11PM",
      FridayFri: "11:30AM-11PM",
      SaturdaySat: "10:30AM-11PM",
      SundaySun: "10:30AM-10PM"
    },
    features: ["Outdoor seating", "Takeaway", "Сredit cards accepted", "Full Bar", "Free Wifi"],
    image_urls: []
  };

  const renderHours = () => {
    if (!restaurant.opening_hours) return null;
    
    return Object.entries(restaurant.opening_hours).map(([day, hours]) => (
      <View key={day} className="flex-row justify-between mb-2 pr-4">
        {/* FIX: Use slice(0, -3) to remove the last 3 chars (e.g., "Mon") */}
        <Text className="font-medium text-gray-800">{day.slice(0, -3)}:</Text>
        <Text className="text-gray-600">{hours}</Text>
      </View>
    ));
  };

  const renderFeatures = () => {
    if (!restaurant.features) return null;
    
    return (
      <View className="flex-row flex-wrap mb-4 gap-2">
        {restaurant.features.slice(0, 5).map((feature, index) => (
          <View key={index} className="bg-gray-100 rounded-full px-3 py-1.5">
            <Text className="text-gray-600 text-xs">{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    // Use SafeAreaView for the container
    <>
      {/* Header with back button */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Restaurant Details</Text>
      </View>

<ScrollView
  contentContainerClassName="pb-20"
  contentContainerStyle={{ paddingBottom: 140 }}
>        {/* Restaurant Image */}
        {restaurant.image_urls?.length > 0 ? (
          <Image 
            source={{ uri: restaurant.image_urls[0] }} 
            className="h-56 w-full resize-cover" // resize-cover is a NativeWind class
          />
        ) : (
          <View className="h-56 bg-red-500 justify-center items-center">
            <FontAwesome name="cutlery" size={50} color="#fff" />
          </View>
        )}

        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold mt-2 text-gray-800">{restaurant.restaurantInfo?.name}</Text>
          
          <View className="flex-row items-center mt-2 mb-2">
            <View className="flex-row items-center bg-green-500 rounded px-1.5 py-0.5 mr-2">
              <FontAwesome name="star" size={14} color="#fff" />
              <Text className="ml-1 font-bold text-white text-xs">{restaurant.restaurantInfo?.ratings?.overall || '4.2'}</Text>
            </View>
            <Text className="text-gray-600 text-xs">({restaurant.restaurantInfo?.ratings?.totalReviews || '500+'} reviews)</Text>
          </View>

          {restaurant.restaurantInfo?.cuisines && (
            <Text className="text-gray-600 mt-1 text-sm">
              <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="#666" /> 
              {' '}
              {Array.isArray(restaurant.restaurantInfo.cuisines) 
                ? restaurant.restaurantInfo.cuisines.join(", ") 
                : restaurant.restaurantInfo.cuisines}
            </Text>
          )}
          
          {restaurant.restaurantInfo?.priceRange && (
            <Text className="text-gray-600 mt-1 text-sm">
              <Entypo name="price-tag" size={14} color="#666" /> 
              {' '}
              {restaurant.restaurantInfo.priceRange}
            </Text>
          )}

          <View className="flex-row mt-3 mb-4">
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text className="text-gray-600 ml-1 text-sm flex-1">{restaurant.restaurantInfo?.address}</Text>
          </View>

          {/* Features */}
          {renderFeatures()}
        </View>

        {/* Action Icons */}
        <View className="flex-row justify-around mx-4 my-3 px-2">
          {restaurant.restaurantInfo?.phoneNo && (
            <TouchableOpacity 
              className="items-center p-2 min-w-[60px]" 
              onPress={() => Linking.openURL(`tel:${restaurant.restaurantInfo.phoneNo}`)}
            >
              <Ionicons name="call-outline" size={20} color="#E03546" />
              <Text className="text-red-500 mt-1 text-xs font-medium">Call</Text>
            </TouchableOpacity>
          )}
          
          {restaurant.restaurantInfo?.address && (
            <TouchableOpacity 
              className="items-center p-2 min-w-[60px]"
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(restaurant.restaurantInfo.address)}`)}
            >
              <MaterialIcons name="directions" size={20} color="#E03546" />
              <Text className="text-red-500 mt-1 text-xs font-medium">Directions</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity className="items-center p-2 min-w-[60px]">
            <Ionicons name="share-social-outline" size={20} color="#E03546" />
            <Text className="text-red-500 mt-1 text-xs font-medium">Share</Text>
          </TouchableOpacity>
          
          {restaurant.restaurantInfo?.website && (
            <TouchableOpacity 
              className="items-center p-2 min-w-[60px]"
              onPress={() => Linking.openURL(restaurant.restaurantInfo.website)}
            >
              <MaterialCommunityIcons name="web" size={20} color="#E03546" />
              <Text className="text-red-500 mt-1 text-xs font-medium">Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View className="h-2 bg-gray-100 my-3" />

        {/* Restaurant Overview */}
        {restaurant.restaurantInfo?.overview && (
          <View className="px-4 mb-4">
            <Text className="font-semibold text-lg mb-3 text-gray-800">About</Text>
            <Text className="text-gray-600 text-sm flex-1">{restaurant.restaurantInfo.overview}</Text>
          </View>
        )}

        {/* Additional Info */}
        {restaurant.restaurantInfo?.additionalInfo && (
          <View className="px-4 mb-4">
            <Text className="font-semibold text-lg mb-3 text-gray-800">Details</Text>
            {restaurant.restaurantInfo.additionalInfo.diningStyle && (
              <View className="flex-row mt-2.5 items-start">
                <FontAwesome5 name="utensils" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.diningStyle}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.dressCode && (
              <View className="flex-row mt-2.5 items-start">
                <MaterialCommunityIcons name="tshirt-crew-outline" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.dressCode}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.parking && (
              <View className="flex-row mt-2.5 items-start">
                <MaterialCommunityIcons name="parking" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.parking}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.publicTransit && (
              <View className="flex-row mt-2.5 items-start">
                <MaterialCommunityIcons name="train-car" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-sm flex-1"> {restaurant.restaurantInfo.additionalInfo.publicTransit}</Text>
              </View>
            )}
          </View>
        )}

        {/* Hours */}
        {restaurant.opening_hours && (
          <View className="px-4 mb-4">
            <Text className="font-semibold text-lg mb-3 text-gray-800">Hours</Text>
            {renderHours()}
          </View>
        )}

        {/* Divider */}
        <View className="h-2 bg-gray-100 my-3" />

        {/* Feedback */}
        <View className="px-4 mb-4">
          <Text className="font-semibold text-lg mb-3 text-gray-800">Feedback</Text>
          <Text className="text-gray-600 mb-2">Had a bad experience here?</Text>
          <TouchableOpacity className="bg-white border border-red-500 rounded-md p-3 items-center">
            <Text className="text-red-500 font-medium">Report an issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg">
        <TouchableOpacity 
          className="bg-red-500 py-3.5 items-center rounded-lg" 
          onPress={() => router.back()}
        >
          <Text className="text-white text-base font-bold">Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};



export default RestaurantDetailsScreen;

