import React from 'react';
import { ScrollView, StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TermsOfService = () => {
  const router = useRouter();

  return (
    <>
      {/* REMOVE EXPO ROUTER HEADER */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>

        {/* ---------- CUSTOM HEADER (back + title) ---------- */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>Terms of Service</Text>
        </View>

        {/* LAST UPDATED */}
        <Text style={styles.updated}>Last updated on March 31, 2023</Text>

        {/* SECTION 1 */}
        <Text style={styles.heading}>I. Acceptance of terms</Text>
        <Text style={styles.paragraph}>
          Thank you for using Zomato. These Terms of Service (the "Terms") are intended to make you aware
          of your legal rights and responsibilities with respect to your access to and use of the Zomato
          website at{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.zomato.com')}>
            www.zomato.com
          </Text>{' '}
          (the "Site") and any related mobile or software applications ("Zomato Platform").
        </Text>

        <Text style={styles.boldParagraph}>
          These Terms are effective for all existing and future Zomato customers, including users having
          access to 'restaurant business page' to manage claimed business listings.
        </Text>

        <Text style={styles.paragraph}>
          Please read these Terms carefully. By accessing or using the Zomato Platform, you are agreeing
          to these Terms and concluding a legally binding contract with Zomato Limited.
        </Text>

        {/* SECTION 2 */}
        <Text style={styles.heading}>II. Definitions</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.subHeading}>Customer: </Text>
          "Customer" refers to you as a user of the Services.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.subHeading}>Content: </Text>
          Includes reviews, photos, videos, messages, profile information, etc.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.subHeading}>Restaurant(s): </Text>
          Restaurants listed on the Zomato platform.
        </Text>

        {/* SECTION 3 */}
        <Text style={styles.heading}>III. Contact Us</Text>

        <Text style={styles.subHeading}>1. Details of the Company</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>Legal Entity Name:</Text> Zomato Limited
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>CIN:</Text> L93030DL2010PLC198141
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>Registered Address:</Text> GF-12A, 9A Meghdoot, Nehru Place, New Delhi-110119
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>Corporate Address:</Text> Pioneer Square, Sector-62 Gurugram, Haryana, 122098
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>Website / App:</Text>{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.zomato.com')}>
            www.zomato.com
          </Text>
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldParagraph}>Contact:</Text>{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('mailto:info@zomato.com')}>
            info@zomato.com
          </Text>
        </Text>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    paddingTop: 10,
  },

  /* --------- NEW HEADER ROW (Back + Title) ---------- */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },

  backButton: {
    marginRight: 8,
    paddingVertical: 4,
    paddingRight: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },

  updated: {
    fontSize: 14,
    color: '#555',
    marginBottom: 25,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 20,
    color: '#111',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 14,
  },
  boldParagraph: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 14,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  link: {
    color: '#d23f57',
    textDecorationLine: 'underline',
  },
});

export default TermsOfService;
