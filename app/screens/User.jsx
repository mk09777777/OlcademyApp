import React from 'react';
import { View, ScrollView, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function Profile() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackRouting title ='User'/>

      <ProfileHeader />
      <ScrollView className="flex-1">

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