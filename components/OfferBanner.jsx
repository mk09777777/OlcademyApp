import React from 'react';
import { View, ScrollView } from 'react-native';
// import { StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export const OfferBanner = ({ offers }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <View className="my-4">
      <Text className="text-lg font-medium mb-3">Available Offers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-grow-0"
      >
        {offers.map((offer, index) => (
          <Card key={index} className="mr-3 min-w-[200px] bg-yellow-50">
            <Card.Content>
              <Text className="text-base font-medium mb-1">{offer.title}</Text>
              <Text className="text-sm text-gray-600 mb-2">{offer.description}</Text>
              {offer.code && (
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 mr-1">Use code:</Text>
                  <Text className="text-sm font-medium text-black">{offer.code}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginBottom: 12,
//   },
//   scrollView: {
//     flexGrow: 0,
//   },
//   offerCard: {
//     marginRight: 12,
//     minWidth: 200,
//     backgroundColor: '#fff8e1',
//   },
//   offerTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   offerDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   codeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   codeLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginRight: 4,
//   },
//   code: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
// });
