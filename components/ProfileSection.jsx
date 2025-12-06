// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import styles from '../styles/ProfileSection';
// import { useSafeNavigation } from '@/hooks/navigationPage';
// const ProfileSection = () => {
//   const [rating, setRating] = useState(4);
//   const { safeNavigation } = useSafeNavigation();
//   const ProfileItem = ({ icon, title, value, chevron, onPress, children }) => (
//     <TouchableOpacity
//       style={styles.menuItem}
//       onPress={onPress}
//     >
//       <View style={styles.menuItemLeft}>
//         <View style={styles.iconContainer}>
//           <MaterialIcons name={icon} size={22} color="#000000" />
//         </View>
//         <Text style={styles.menuItemTitle}>{title}</Text>
//       </View>
//       <View style={styles.menuItemRight}>
//         {value && <Text style={[styles.menuItemValue, value.includes('%') && styles.percentageText]}>{value}</Text>}
//         <View style={styles.menuItemRight}>
//           {children}
//           {chevron && <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const StarRating = ({ rating }) => (
//     <View style={styles.starContainer}>
//       {Array.from({ length: 5 }).map((_, index) => (
//         <MaterialIcons
//           key={index}
//           name={index < rating ? 'star' : 'star-border'}
//           size={20}
//           color="#FFD700"
//         />
//       ))}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.menuContainer}>
//         <ProfileItem
//           icon="person-outline"
//           title="Your profile"
//           value="80% completed"
//           chevron
//           onPress={() => safeNavigation('/screens/ProfileScreen')}
//         />
//         <ProfileItem
//           icon="confirmation-number"
//           title="Coupon"
//           value="3 coupon"
//           chevron
//           onPress={() => console.log('Cupon pressed')}
//         />
//         <ProfileItem
//           icon="star-outline"
//           title="Your rating"
//           chevron
//           onPress={() => safeNavigation('/screens/Rating')}
//         >
//           <StarRating rating={rating} />
//         </ProfileItem>
//       </View>
//     </View>
//   );
// };
// export default ProfileSection;


import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';

const ProfileSection = () => {
  const [rating, setRating] = useState(4);
  const { safeNavigation } = useSafeNavigation();

  const ProfileItem = ({ icon, title, value, chevron, onPress, children }) => (
    <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 bg-white border-b border-gray-100" onPress={onPress}>
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
          <MaterialCommunityIcons name={icon} size={22} color="#000000" />
        </View>
        <Text className="text-base font-outfit-medium color-gray-800">{title}</Text>
      </View>
      <View className="flex-row items-center">
        {value && (
          <Text className="text-sm font-outfit color-gray-600 mr-2">
            {value}
          </Text>
        )}
        <View className="flex-row items-center">
          {children}
          {chevron && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#CCCCCC"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const StarRating = ({ rating }) => (
    <View className="flex-row mr-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <MaterialCommunityIcons
          key={index}
          name={index < rating ? 'star' : 'star-outline'}
          size={20}
          color="#FFD700"
        />
      ))}
    </View>
  );

  return (
    <View className="flex-1">
      <View className="bg-white rounded-lg mx-4 my-2 overflow-hidden shadow-sm">
        <ProfileItem
          icon="account-outline"
          title="Your profile"
          value="80% completed"
          chevron
          onPress={() => safeNavigation('/screens/ProfileScreen')}
        />
        <ProfileItem
          icon="ticket-outline"
          title="Coupon"
          value="3 coupons"
          chevron
          onPress={() => console.log('Coupon pressed')}
        />
        <ProfileItem
          icon="star-outline"
          title="Your rating"
          chevron
          onPress={() => safeNavigation('/screens/Rating')}
        >
          <StarRating rating={rating} />
        </ProfileItem>
      </View>
    </View>
  );
};

export default ProfileSection;
