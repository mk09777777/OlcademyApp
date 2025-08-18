import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export const OfferBanner = ({ offers }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Offers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {offers.map((offer, index) => (
          <Card key={index} style={styles.offerCard}>
            <Card.Content>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
              {offer.code && (
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Use code:</Text>
                  <Text style={styles.code}>{offer.code}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  offerCard: {
    marginRight: 12,
    minWidth: 200,
    backgroundColor: '#fff8e1',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  code: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
