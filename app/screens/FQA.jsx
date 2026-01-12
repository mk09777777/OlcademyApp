import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';
import { API_CONFIG } from '../../config/apiConfig';

const FAQScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <Fragment>
      <BackRouting title="FAQ" />
      <View className="flex-1 bg-background p-4">
        <View className="flex-1 bg-white rounded-lg border border-border p-4">
          <Text className="text-textprimary text-xl font-outfit-bold">Got Queries?</Text>
          <Text className="text-textsecondary text-sm font-outfit mt-1 mb-4">
            Find quick answers to common questions.
          </Text>

          {loading ? (
            <View className="flex-1 justify-center items-center py-10">
              <ActivityIndicator size="large" color="#FF002E" />
            </View>
          ) : error ? (
            <Text className="text-primary text-base font-outfit text-center mt-4">{error}</Text>
          ) : faqData.length === 0 ? (
            <Text className="text-textsecondary text-base font-outfit text-center mt-4">
              No FAQs available right now.
            </Text>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {faqData.map((item, index) => {
                const isOpen = activeIndex === index;
                return (
                  <View
                    key={item._id ?? index}
                    className="border border-border rounded-lg mb-3 overflow-hidden"
                  >
                    <TouchableOpacity
                      className="flex-row justify-between items-center px-4 py-4 bg-white"
                      onPress={() => setActiveIndex(isOpen ? null : index)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-textprimary text-base font-outfit flex-1 mr-3">
                        {item.q}
                      </Text>
                      <Ionicons
                        name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={20}
                        color="#222"
                      />
                    </TouchableOpacity>
                    {isOpen && (
                      <View className="border-t border-border px-4 py-3 bg-background">
                        <Text className="text-textsecondary text-sm font-outfit leading-6">
                          {item.a}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}

              <View className="mt-5 pt-5 border-t border-border">
                <Text className="text-textsecondary text-sm font-outfit text-center leading-6">
                  If you have any queries, please feel free to contact us at{' '}
                  <Text className="text-primary font-outfit-bold">+91-9876543210</Text> or email us at{' '}
                  <Text className="text-primary font-outfit-bold">support@zomato.com</Text>.
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Fragment>
  );
};



export default FAQScreen;