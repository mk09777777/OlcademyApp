import React, { useMemo, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import TiffinCollection from '@/components/TiffinCollection';
import DiningCollection from '@/components/DiningCollection';
import TakewayCollection from '@/components/TakewayCollection';
import BackRouting from '@/components/BackRouting';



const Collection = () => {
  const [currentScreen, setCurrentScreen] = useState('TakewayCollection');

  const tabs = useMemo(
    () => [
      { key: 'TakewayCollection', label: 'Takeway Collection' },
      { key: 'DiningCollection', label: 'Dining Collection' },
      { key: 'TiffinCollection', label: 'Tiffin Collection' },
    ],
    []
  );

  const renderScreen = () => {
    switch (currentScreen) {
      // case 'EventCollection':
      //   return <EventCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      case 'TiffinCollection':
        return <TiffinCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      case 'DiningCollection':
        return <DiningCollection goBack={() => setCurrentScreen('TakewayCollection')} />;
      default:
        return <TakewayCollection
          goToDining={() => setCurrentScreen('DiningCollection')}
          goToTiffin={() => setCurrentScreen('TiffinCollection')}
          // goToEvent={() => setCurrentScreen('EventCollection')}
        />;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <BackRouting title={'Collection'} />
      <View className="h-62.5 mb-5">
        {/* Image placeholder */}
      </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
      <View className="flex-row py-3.75 px-2.5 bg-white">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              className={`px-4 py-2 mx-1 rounded-full ${
                isActive ? 'bg-red-50 border border-primary' : 'bg-gray-100'
              }`}
              onPress={() => setCurrentScreen(tab.key)}
            >
              <Text
                className={`text-sm ${
                  isActive ? 'text-primary font-bold' : 'text-gray-600 font-medium'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      </ScrollView>
      {renderScreen()}
    </ScrollView>
  );
};

export default Collection;

