import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SupportScreen = () => {
  const supportEmail = 'ap9377016@gmail.com';
  const whatsappNumber = '+916392006091';
  const whatsappMessage = 'Hello, I need help with...';

  const handleEmailPress = () => {
    const subject = 'Support Request';
    const body = 'Dear Support Team,\n\nI need assistance with...';
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(err => {
      console.error('Failed to open email client:', err);
      alert('Failed to open email client. Please email us directly at ' + supportEmail);
    });
  };

  const handleWhatsAppPress = () => {
    let url;
    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    } else {
      url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }
    
    Linking.openURL(url).catch(err => {
      console.error('Failed to open WhatsApp:', err);
      alert('WhatsApp is not installed. Please install it to chat with us.');
    });
  };

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <View className="mb-7.5">
        <Text className="text-xl font-bold text-gray-800 mb-2">Contact Support</Text>
        <Text className="text-base text-gray-500 leading-5.5">We're here to help you with any questions or issues</Text>
      </View>
      
      <View className="mb-5">
        <TouchableOpacity 
          className="flex-row items-center justify-between bg-white p-3.75 rounded-xl mb-4 shadow-sm border-l-4 border-blue-500"
          onPress={handleEmailPress}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full justify-center items-center mr-3.75 bg-blue-500">
              <Ionicons name="mail" size={22} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-0.75">Email Support</Text>
              <Text className="text-sm text-gray-400">Get a response within 24 hours</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center justify-between bg-white p-3.75 rounded-xl mb-4 shadow-sm border-l-4 border-green-500"
          onPress={handleWhatsAppPress}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full justify-center items-center mr-3.75 bg-green-500">
              <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-0.75">WhatsApp Chat</Text>
              <Text className="text-sm text-gray-400">Instant messaging support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center justify-center mt-auto pt-5 border-t border-gray-200">
        <Ionicons name="time" size={16} color="#7f8c8d" />
        <Text className="text-sm text-gray-500 ml-2">Available 24/7 for your convenience</Text>
      </View>
    </View>
  );
};

/* Original CSS Reference:
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa' },
  header: { marginBottom: 30 },
  title: { fontSize: 20, fontWeight: '700', color: '#2c3e50', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7f8c8d', lineHeight: 22 },
  optionsContainer: { marginBottom: 20 },
  supportOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  emailOption: { borderLeftWidth: 4, borderLeftColor: '#3498db' },
  whatsappOption: { borderLeftWidth: 4, borderLeftColor: '#25D366' },
  optionContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  emailIcon: { backgroundColor: '#3498db' },
  whatsappIcon: { backgroundColor: '#25D366' },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 3 },
  optionDescription: { fontSize: 14, color: '#95a5a6' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#ecf0f1' },
  footerText: { fontSize: 14, color: '#7f8c8d', marginLeft: 8 }
});
*/

export default SupportScreen;