import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackRouting from '@/components/BackRouting';

const SupportScreen = () => {
  /* Original CSS Reference:
   * container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa' }
   * header: { marginBottom: 30 }
   * title: { fontSize: 20, fontWeight: '700', color: '#2c3e50', marginBottom: 8 }
   * subtitle: { fontSize: 15, color: '#7f8c8d', lineHeight: 22 }
   * optionsContainer: { marginBottom: 20 }
   * supportOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 }
   * emailOption: { borderLeftWidth: 4, borderLeftColor: '#3498db' }
   * whatsappOption: { borderLeftWidth: 4, borderLeftColor: '#25D366' }
   * optionContent: { flexDirection: 'row', alignItems: 'center', flex: 1 }
   * iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 }
   * emailIcon: { backgroundColor: '#3498db' }
   * whatsappIcon: { backgroundColor: '#25D366' }
   * textContainer: { flex: 1 }
   * optionTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 3 }
   * optionDescription: { fontSize: 14, color: '#95a5a6' }
   * footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#ecf0f1' }
   * footerText: { fontSize: 14, color: '#7f8c8d', marginLeft: 8 }
   */
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
    <Fragment>
      <BackRouting title="Order Help" />
      <View className="flex-1 bg-background p-4">
        <View className="bg-white rounded-lg border border-border p-4 mb-4">
          <Text className="text-textprimary text-lg font-outfit-bold mb-1">Need help with your order?</Text>
          <Text className="text-textsecondary text-sm font-outfit leading-6">
            Choose how you'd like to reach us and our support team will get back to you.
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg mb-3 border border-border"
          onPress={handleEmailPress}
          activeOpacity={0.7}
        >
          <View className="flex-1 mr-3">
            <Text className="text-textprimary text-base font-outfit">Email support</Text>
            <Text className="text-textsecondary text-sm font-outfit mt-1">Get a response within 24 hours</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#222" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between py-4 px-4 bg-white rounded-lg border border-border"
          onPress={handleWhatsAppPress}
          activeOpacity={0.7}
        >
          <View className="flex-1 mr-3">
            <Text className="text-textprimary text-base font-outfit">WhatsApp chat</Text>
            <Text className="text-textsecondary text-sm font-outfit mt-1">Instant messaging support</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#222" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-auto pt-6">
          <Ionicons name="time-outline" size={18} color="#7f8c8d" />
          <Text className="text-sm text-textsecondary font-outfit ml-2">Support is available 24/7</Text>
        </View>
      </View>
    </Fragment>
  );
};

export default SupportScreen;