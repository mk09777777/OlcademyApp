import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
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
          className="flex-row justify-between items-center py-4 border-b border-border"
          onPress={() => setActiveIndex(isOpen ? null : index)}
        >
          <Text className="text-textprimary text-base font-outfit flex-1 mr-3">{item.q}</Text>
          <Ionicons
            name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
        {isOpen && <Text className="text-textsecondary text-sm font-outfit py-3">{item.a}</Text>}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FF002E" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-primary text-base font-outfit text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <BackRouting title="FAQ" />
      <FlatList
        data={faqData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
  
      {/* Footer message */}
      <View className="mt-5 py-5 border-t border-border mb-5">
        <Text className="text-textsecondary text-sm font-outfit text-center leading-6">
          If you have any queries, please feel free to contact us at{' '}
          <Text className="text-primary font-outfit-bold">+91-9876543210</Text> or email us at{' '}
          <Text className="text-primary font-outfit-bold">support@zomato.com</Text>.
        </Text>
      </View>
    </ScrollView>
  );
};



export default FAQScreen;