import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/EventPage';

const MainTabs = ({ activeTab, onTabChange }) => (
  <View style={styles.mainTabContainer}>
    {['all','upcoming','active', 'past'].map((tab) => (
      <TouchableOpacity
        key={tab}
        style={[styles.mainTab, activeTab === tab && styles.activeMainTab]}
        onPress={() => onTabChange(tab)}
      >
        <Text style={[styles.mainTabText, activeTab === tab && styles.activeMainTabText]}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default MainTabs;