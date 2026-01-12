import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

const coupons = [
  {
    brand: 'PUMA',
    offer: 'Extra 24% off',
    expiry: 'Expires today',
    logo: 'https://vectorseek.com/wp-content/uploads/2021/01/Puma-Logo-Vector-scaled.jpg',
  },
  {
    brand: 'GIVA',
    offer: 'Flat ₹500 Off!',
    expiry: 'Expires in 64 days',
    logo: 'https://th.bing.com/th/id/OIP.lsEOSvAWqDXQrlgxw576gQHaHa?rs=1&pid=ImgDetMain',
  },
  {
    brand: 'Hoichoi',
    offer: 'Flat ₹200 Off!',
    expiry: 'Expires in 3 days',
    logo: 'https://th.bing.com/th/id/OIP.ybByRSCVVmPG6BUvUv4b4wHaEK?rs=1&pid=ImgDetMain',
  },
  {
    brand: 'ixigo',
    offer: 'Flat ₹500 Off!',
    expiry: 'Expires in 125 days',
    logo: 'https://asset.brandfetch.io/idiqOCfzCa/idwNPf9eIw.jpeg',
  },
  {
    brand: 'LOTUS BOTANICALS',
    offer: 'Limited Period Offer',
    expiry: 'Expires in 3 days',
    logo: 'https://www.lotusbotanicals.com/cdn/shop/files/logo.png?v=1644214059',
  },
  {
    brand: 'Deconstruct',
    offer: 'Flat ₹350 Off!',
    expiry: 'Expires in 33 days',
    logo: 'https://images.yourstory.com/cs/images/companies/download-2022-08-24T195809-1661392560851.jpg?fm=auto&ar=1:1&mode=fill&fill=solid&fill-color=fff',
  },
  {
    brand: 'MYGLAMM',
    offer: 'Flat ₹200 Off!',
    expiry: 'Expires in 12 days',
    logo: 'https://kamalpreet34.github.io/svg/myglamm.png',
  },
  {
    brand: 'Smytten',
    offer: '₹101 Cashback!',
    expiry: 'Expires in 5 days',
    logo: 'https://play-lh.googleusercontent.com/KUjwbiOXHJrDQdKxRCozjltqwXiePh9FntuUtHGSCxdLCRSrAVm__teOVyCOzC4bTw',
  },
];

const CouponCard = ({ brand, offer, expiry, logo }) => (
  <View className="bg-white rounded-lg p-4 m-2 border border-border shadow-sm">
    <Image source={{ uri: logo }} className="w-16 h-16 mb-3" resizeMode="contain" />
    <Text className="text-textprimary text-lg font-outfit-bold mb-1">{brand}</Text>
    <Text className="text-primary text-base font-outfit mb-2">{offer}</Text>
    <Text className="text-textsecondary text-sm font-outfit mb-3">{expiry}</Text>
    <TouchableOpacity className="bg-primary py-2 px-4 rounded-lg">
      <Text className="text-white text-sm font-outfit-bold text-center">View details ➜</Text>
    </TouchableOpacity>
  </View>
);

const CouponsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-textprimary text-2xl font-outfit-bold mb-4">Your coupons</Text>
      <Text className="text-textsecondary text-sm font-outfit-bold mb-4 tracking-wider">BRAND COUPONS</Text>
      <View className="flex-row flex-wrap justify-between">
        {coupons.map((coupon, index) => (
          <CouponCard key={index} {...coupon} />
        ))}
      </View>
    </ScrollView>
  );
};
export default CouponsScreen;
