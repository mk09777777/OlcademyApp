import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { CartProvider } from '@/context/CartContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider } from '@/context/PreferencesContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import NotificationWatcher from '@/Model/Notifications';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
import { LocationProvider } from '@/context/LocationContext';
import { useRouter } from 'expo-router';
import { OffersProvider } from '@/context/OfferContext';
import { FirmProvider } from '@/context/FirmContext';

export const unstable_settings = {
  initialRouteName: 'auth',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('@/assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('@/assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('@/assets/fonts/Outfit-Medium.ttf'),
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
                        <SafeAreaView style={{ flex: 1 }} >
                          <LocationProvider>
                            <NotificationHandler />
                            <NotificationWatcher />
                            <Stack>
                              <Stack.Screen name="home" options={{ headerShown: false }} />
                              <Stack.Screen name="auth" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/FirmBookingSelectDateTime" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/ReviewDetails" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/PhotoGallery" options={{ headerShown: false, animation: 'fade' }} />
                              <Stack.Screen name="screens/FullScreenGallery" options={{ headerShown: false, presentation: 'modal' }} />
                              <Stack.Screen name="screens/Collections" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/FirmBookingSummary" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/EventBooking" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/FavoriteOrders" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/FirmDetailsDining" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/FirmDetailsTakeAway" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/EventDetails" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/TakeAwayCart" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/User" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Activity" options={{ title: 'Activity' }} />
                              <Stack.Screen name="screens/Address" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/AddAddress" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Collection" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Order" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Rating" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/DiningBooking" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/DiningBookingDetails" options={{ title: 'Booking' }} />
                              <Stack.Screen name="screens/TakewayCollection" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/DiningCollection" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/LiveEventPage" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/EventCollection" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/RecommendationScreen" options={{ title: 'Recommendations' }} />
                              <Stack.Screen name="screens/PopularService" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/NearByService" options={{ title: 'Nearby Restaurants' }} />
                              <Stack.Screen name="screens/ReviewsScreen" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/TiffinDetails" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Checkout" options={{ title: '' }} />
                              <Stack.Screen name="screens/ProfileScreen"  options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Settings" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/SettingNotifications" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/AccountSettings" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/DeleteAccount" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Reviewsall" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/RestaurantDetailsScreen" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Logout" options={{ title: '' }} />
                              <Stack.Screen name="screens/FQA" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/OnMindScreens" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Userrating" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/Userreview" options={{ title: '' }} />
                              <Stack.Screen name="screens/TiffinDetailsScreen" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/MealCustomizeScreen" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/OrderSummary" options={{ title: 'Order Summary' }} />
                              <Stack.Screen name="screens/OrderSupportChat" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/DiningBookingHelp" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/SendFeedback" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/OrderSceess" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/SelectLocation" options={{ headerShown: false }} />
                              <Stack.Screen name="screens/NoficationsPage" options={{ headerShown: false }} />
                              <Stack.Screen name="MapPicker" options={{ headerShown: false }} />
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
    if (isExpoGo) {
      console.log('📱 Notification handling limited in Expo Go');
      return;
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/screens/NoficationsPage');
    });

    return () => subscription.remove();
  }, []);

  return null;
};
