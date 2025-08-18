import React from 'react';
import { ScrollView, StyleSheet, Text, View, Linking } from 'react-native';

const TermsOfService = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.updated}>Last updated on March 31, 2023</Text>

      <Text style={styles.heading}>I. Acceptance of terms</Text>
      <Text style={styles.paragraph}>
        Thank you for using Zomato. These Terms of Service (the "Terms") are intended to make you aware of your legal rights and responsibilities with respect to your access to and use of the Zomato website at{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.zomato.com')}>
          www.zomato.com
        </Text>{' '}
        (the "Site") and any related mobile or software applications ("Zomato Platform") including but not limited to delivery of information via the website whether existing now or in the future that link to the Terms (collectively, the "Services").
      </Text>

      <Text style={styles.boldParagraph}>
        These Terms are effective for all existing and future Zomato customers, including but without limitation to users having access to 'restaurant business page' to manage their claimed business listings.
      </Text>

      <Text style={styles.paragraph}>
        Please read these Terms carefully. By accessing or using the Zomato Platform, you are agreeing to these Terms and concluding a legally binding contract with Zomato Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited) and/or its affiliates (excluding Zomato Foods Private Limited).
      </Text>

      <Text style={styles.heading}>II. Definitions</Text>

      <Text style={styles.paragraph}>
        <Text style={styles.subHeading}>Customer:</Text> "Customer" or "You" or "Your" refers to you, as a customer of the Services. A customer is someone who accesses or uses the Services for the purpose of sharing, displaying, hosting, publishing, transacting, or uploading information or views or pictures and includes other persons jointly participating in using the Services including without limitation a user having access to 'restaurant business page' to manage claimed business listings or otherwise.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.subHeading}>Content:</Text> "Content" will include (but is not limited to) reviews, images, photos, audio, video, location data, nearby places, and all other forms of information or data. "Your content" or "Customer Content" means content that you upload, share or transmit to, through or in connection with the Services, such as likes, ratings, reviews, images, photos, messages, chat communication, profile information, or any other materials that you publicly display or displayed in your account profile. "Zomato Content" means content that Zomato creates and makes available in connection with the Services including, but not limited to, visual interfaces, interactive features, graphics, design, compilation, computer code, products, software, aggregate ratings, reports and other usage-related data in connection with activities associated with your account and all other elements and components of the Services excluding Your Content and Third Party Content. "Third Party Content" means content that comes from parties other than Zomato or its Customers, such as Restaurant Partners and is available on the Services.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.subHeading}>Restaurant(s):</Text> "Restaurant" means the restaurants listed on Zomato Platform.
      </Text>

      <Text style={styles.heading}>III. Contact Us</Text>
      
      <Text style={styles.subHeading}>1. Details of the Company</Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>Legal Entity Name:</Text> Zomato Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited)
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>CIN:</Text> L93030DL2010PLC198141
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>Registered Address:</Text> GF-12A, 9A Meghdoot, Nehru Place, New Delhi-110119
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>Corporate Address:</Text> Pioneer Square, Tower 1-Ground to 6th Floor and Tower 2-1st and 2nd Floors, Near Golf Course Extension, Sector-62 Gurugram, Haryana, 122098
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>Details of website and Application:</Text>{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.zomato.com')}>
          www.zomato.com
        </Text> ("Website") and "Zomato" application for mobile and handheld devices
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.boldParagraph}>Contact Details:</Text>{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('mailto:info@zomato.com')}>
          info@zomato.com
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  updated: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  boldParagraph: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
  link: {
    color: '#d23f57',
    textDecorationLine: 'underline',
  },
  subHeading: {
    fontWeight: '600',
    color: '#000',
  },
});

export default TermsOfService;