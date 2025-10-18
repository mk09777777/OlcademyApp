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
      <View className="h-62.5 mb-5 ">
{/*      
        <Image source={require('../../../assets/images/tiffin.jpg')} className="w-full h-full" style={{ resizeMode: 'cover' }} /> */}
        
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

/* Original CSS Reference:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { height: 250 },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  tabContainer: { flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabButton: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20, backgroundColor: '#f8f8f8' },
  activeTab: { backgroundColor: '#ffe5e8', borderWidth: 1, borderColor: '#E41E3F' },
  tabText: { fontSize: 14, fontFamily: 'outfit-medium', color: '#666' },
  activeTabText: { color: '#E41E3F', fontFamily: 'outfit-bold' },
  searchContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInput: { backgroundColor: '#fff' },
  collectionContainer: { padding: 16 },
  collectionCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, width: '100%' },
  collectionImage: { width: '100%', height: 140, resizeMode: 'cover' },
  collectionContent: { padding: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 2 },
  cardWrapper: { width: '48%', marginBottom: 15 },
  collectionTitle: { fontSize: 16, fontFamily: 'outfit-bold', color: '#333', marginBottom: 4 },
  collectionInfo: { fontSize: 12, fontFamily: 'outfit', color: '#666' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyStateText: { fontSize: 16, fontFamily: 'outfit-medium', color: '#999', textAlign: 'center', marginTop: 16 },
  offersTrack: { paddingLeft: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }
});
*/