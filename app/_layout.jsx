import React, { useEffect } from 'react';
import { Stack , Redirect, router , useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { CartProvider } from '@/context/CartContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from '@/context/PreferencesContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '../context/AuthContext';
import NotificationWatcher from '@/Model/Notifications';
import * as Notifications from 'expo-notifications';
import { LocationProvider } from '@/context/LocationContext';
import { OffersProvider } from '@/context/OfferContext';
import { FirmProvider } from '@/context/FirmContext';


export const unstable_settings = {
  initialRouteName: 'auth',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('@/assets/fonts/Urbanist-Regular.ttf'),
    'outfit-bold': require('@/assets/fonts/Urbanist-Bold.ttf'),
    'outfit-medium': require('@/assets/fonts/Urbanist-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {({ isAuthenticated, loading }) => {
          if (!isAuthenticated && router.canGoBack()) {
            return <Redirect href="/auth/LoginScreen" />;
          }

            return (
            <CartProvider>
              <OffersProvider>
              <PreferencesProvider>
                <FirmProvider value={{ firms: [], loading: false }}>
                <PaperProvider>
                  <ErrorBoundary>
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: '#ffffff' }}
                    edges={['right', 'left', 'bottom', 'top']}
                  >
                    <StatusBar style="dark" />
                    <LocationProvider>
                    <NotificationHandler />
                    <NotificationWatcher />
                    <Stack>
                      {/* Core Screens */}
                      <Stack.Screen name="home" options={{ headerShown: false }} />
                      <Stack.Screen name="auth" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Order" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/User" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Address" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Collection" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/FavoriteOrders" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/NoficationsPage" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/MapPicker" options={{ headerShown: false }} />

                      {/* Dining and Booking Screens */}
                      <Stack.Screen name="screens/DiningBooking" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/DiningBookingDetails" options={{ title: 'Booking' }} />
                      <Stack.Screen name="screens/DiningBookingHelp" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/FirmBookingSelectDateTime" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/FirmBookingSummary" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/DiningCollection" options={{ headerShown: false }} />

                      {/* Takeaway Screens */}
                      <Stack.Screen name="screens/TakeAwayCart" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/TakewayCollection" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/FirmDetailsTakeAway" options={{ headerShown: false }} />

                      {/* Tiffin Screens */}
                      <Stack.Screen name="screens/TiffinDetails" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/TiffinDetailsScreen" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/MealCustomizeScreen" options={{ headerShown: false }} />

                      {/* Event Screens */}
                      <Stack.Screen name="screens/EventBooking" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/EventDetails" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/EventCollection" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/LiveEventPage" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/LiveEventHelp" options={{ headerShown: false }} />

                      {/* Review and Rating Screens */}
                      <Stack.Screen name="screens/ReviewDetails" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/ReviewsScreen" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Rating" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Reviewsall" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Userrating" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Userreview" options={{ title: '' }} />
                      <Stack.Screen name="screens/commentscreen" options={{ headerShown: false }} />

                      {/* Firm and Restaurant Screens */}
                      <Stack.Screen name="screens/FirmDetailsDining" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/RestaurantDetailsScreen" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Collections" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/PopularService" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/NearByService" options={{ title: 'Nearby Restaurants' }} />

                      {/* Order and Checkout Screens */}
                      <Stack.Screen name="screens/Checkout" options={{ title: '' }} />
                      <Stack.Screen name="screens/OrderSummary" options={{ title: 'Order Summary' }} />
                      <Stack.Screen name="screens/OrderSceess" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/OrderSupportChat" options={{ headerShown: false }} />

                      {/* Settings and Profile Screens */}
                      <Stack.Screen name="screens/ProfileScreen" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/Settings" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/About" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/SettingNotifications" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/AccountSettings" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/DeleteAccount" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/FQA" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/SendFeedback" options={{ headerShown: false }} />

                      {/* Miscellaneous Screens */}
                      <Stack.Screen name="screens/Activity" options={{ headerShown: false, title: 'Activity' }}                      />
                      <Stack.Screen name="screens/RecommendationScreen" options={{ title: 'Recommendations' }} />
                      <Stack.Screen name="screens/OnMindScreens" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/SelectLocation" options={{ headerShown: false }} />
                      <Stack.Screen name="screens/PhotoGallery" options={{ headerShown: false, animation: 'fade' }} />
                      <Stack.Screen name="screens/FullScreenGallery" options={{ headerShown: false, presentation: 'modal' }} />
                    </Stack>
                    </LocationProvider>
                  </SafeAreaView>
                  </ErrorBoundary>
                </PaperProvider>
                </FirmProvider>
              </PreferencesProvider>
              </OffersProvider>
            </CartProvider>
            );
        }}
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const NotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/screens/NoficationsPage');
    });

    return () => subscription.remove();
  }, []);

  return null;
};