import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileSection from '../../components/ProfileSection';
import QuickActions from '../../components/QuickActions';
import FoodSection from '../../components/FoodSection';
import TableSection from '../../components/TableSection';
import MoreSection from '../../components/MoreSection';
import LiveEvent from '../../components/LiveEvent';
import BackRouting from '@/components/BackRouting';
const Colors = {
  primary: '#ff5252',
  background: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#777777',
};

export default function Profile() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <BackRouting tittle ='user'/>

      <ProfileHeader />
      <ScrollView style={styles.scrollView}>

        <QuickActions />
        <ProfileSection />
        <FoodSection />
        <TableSection />
        <LiveEvent />
        <MoreSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  }

});