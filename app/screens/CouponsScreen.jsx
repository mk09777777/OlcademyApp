import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/CouponsScreen';

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
  <View style={styles.card}>
    <Image source={{ uri: logo }} style={styles.logo} resizeMode="contain" />
    <Text style={styles.brand}>{brand}</Text>
    <Text style={styles.offer}>{offer}</Text>
    <Text style={styles.expiry}>{expiry}</Text>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>View details ➜</Text>
    </TouchableOpacity>
  </View>
);

const CouponsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your coupons</Text>
      <Text style={styles.subtitle}>BRAND COUPONS</Text>
      <View style={styles.grid}>
        {coupons.map((coupon, index) => (
          <CouponCard key={index} {...coupon} />
        ))}
      </View>
    </ScrollView>
  );
};
export default CouponsScreen;
