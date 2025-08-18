import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Image } from 'react-native';
import { router } from 'expo-router';
import styles from '../../styles/Collection';
import EventCollection from '@/components/EventCollection';
import TiffinCollection from '@/components/TiffinCollection';
import DiningCollection from '@/components/DiningCollection';
import TakewayCollection from '@/components/TakewayCollection';



const Collection = () => {
  const [currentScreen, setCurrentScreen] = useState('ManageTiffin');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'EventCollection':
        return <EventCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      case 'TiffinCollection':
        return <TiffinCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      case 'DiningCollection':
        return <DiningCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      default:
        return <TakewayCollection
          goToDining={() => setCurrentScreen('DiningCollection')}
          goToTiffin={() => setCurrentScreen('TiffinCollection')}
          goToEvent={() => setCurrentScreen('EventCollection')}
        />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBackground}>
        <Image source={require('../../assets/images/food.jpg')} style={styles.headerImage} />
      </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={styles.offersTrack}
        >
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === '' && styles.activeTab
          ]}
          onPress={() => setCurrentScreen('TakewayCollection')}
        >
          <Text style={[
            styles.tabText,
            currentScreen === 'TakewayCollection' && styles.activeTabText
          ]}>
            TakewayCollection
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === 'DiningCollection' && styles.activeTab
          ]}
          onPress={() => setCurrentScreen('DiningCollection')}
        >
          <Text style={[
            styles.tabText,
            currentScreen === 'DiningCollection' && styles.activeTabText
          ]}>
            DiningCollection
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === 'TiffinCollection' && styles.activeTab
          ]}
          onPress={() => setCurrentScreen('TiffinCollection')}
        >
          <Text style={[
            styles.tabText,
            currentScreen === 'TiffinCollection' && styles.activeTabText
          ]}>
            TiffinCollection
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === 'EventCollection' && styles.activeTab
          ]}
          onPress={() => setCurrentScreen('EventCollection')}
        >
          <Text style={[
            styles.tabText,
            currentScreen === 'EventCollection' && styles.activeTabText
          ]}>
            EventCollection
          </Text>
        </TouchableOpacity>

      </View>
      </ScrollView>
      {renderScreen()}
    </ScrollView>
  );
};

export default Collection;