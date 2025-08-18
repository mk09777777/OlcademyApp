import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import BackRouting from '@/components/BackRouting';
import { useSafeNavigation } from '@/hooks/navigationPage';
const DeliveryPersonIcon = () => (
  <Svg width="60" height="60" viewBox="0 0 60 60">
    <Circle cx="30" cy="20" r="12" fill="#FF424F" />
    <Path d="M30 35 L30 50" stroke="#FF424F" strokeWidth="3" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', fill: 'white' }}>Z</Text>
  </Svg>
);

export default function RatingInfoScreen() {
  const { safeNavigation } = useSafeNavigation();
  const ratingFactors = [
    {
      title: 'Short wait times',
      description: 'Make sure that the address entered by you is accurate and prevent drop-off delays.',
      icon: 'clock',
    },
    {
      title: 'Courtesy',
      description: 'Being polite and kind goes a long way',
      icon: 'smile',
    },
    {
      title: 'Generosity',
      description: 'Support delivery partners by giving them a generous tip, if you can afford it.',
      icon: 'heart',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackRouting tittle="Rating"/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Understanding your rating</Text>
          <Text style={styles.subtitle}>
            To foster mutual respect within the Zomato community, delivery partners will now rate you on a scale of 1 to 5 after each delivery, just like you rate them. We request that you think about what can affect your delivery partner's happiness and become a 5-star customer.
          </Text>
        </View>

        <View style={styles.factorsContainer}>
          {ratingFactors.map((factor, index) => (
            <View key={index} style={styles.factorCard}>
              <View style={styles.factorIconContainer}>
                <DeliveryPersonIcon />
              </View>
              <View style={styles.factorContent}>
                <Text style={styles.factorTitle}>{factor.title}</Text>
                <Text style={styles.factorDescription}>{factor.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.calculationSection}>
          <Text style={styles.calculationTitle}>How is your rating calculated</Text>
          <Text style={styles.calculationDescription}>
            Your rating will show once you receive ratings on minimum 5 food orders. It is calculated as an average of all your past ratings.
          </Text>
        </View>

        <TouchableOpacity style={styles.okayButton} activeOpacity={0.8} onPress={() => safeNavigation('profile')}>
          <Text style={styles.okayButtonText}>Okay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1C',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  factorsContainer: {
    marginBottom: 30,
  },
  factorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorIconContainer: {
    marginRight: 16,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1C1C1C',
  },
  factorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  calculationSection: {
    marginBottom: 30,
  },
  calculationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1C1C1C',
  },
  calculationDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  okayButton: {
    backgroundColor: '#FF424F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  okayButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});