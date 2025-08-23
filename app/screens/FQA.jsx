import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from '@/components/BackRouting';
import { API_CONFIG } from '../../config/apiConfig';
const FAQScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { safeNavigation } = useSafeNavigation();
  useEffect(() => {
    const fetchFAQs = async () => {
      try {

        const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/faq`);
        const data = await response.json();
        if (data.faqs) {
          setFaqData(data.faqs);
        } else {
          setError('No FAQs found');
        }
      } catch (err) {
        setError('Failed to fetch FAQs');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const renderItem = ({ item, index }) => {
    const isOpen = activeIndex === index;

    return (
      <View>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => setActiveIndex(isOpen ? null : index)}
        >
          <Text style={styles.questionText}>{item.q}</Text>
          <Ionicons
            name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
        {isOpen && <Text style={styles.answerText}>{item.a}</Text>}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BackRouting />
      <FlatList
        data={faqData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
  
      {/* Footer message */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If you have any queries, please feel free to contact us at{' '}
          <Text style={styles.highlight}>+91-9876543210</Text> or email us at{' '}
          <Text style={styles.highlight}>support@zomato.com</Text>.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  questionText: {
    fontSize: 16,
    color: '#111',
    flex: 1,
    marginHorizontal: 10
  },
  answerText: {
    fontSize: 15,
    color: '#555',
    paddingVertical: 10
  },
  footer: {
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginBottom:20
  },
  footerText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center'
  },
  highlight: {
    color: '#e91e63', 
    fontWeight: '600'
  },
  errorText: {
    color: '#e91e63',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default FAQScreen;