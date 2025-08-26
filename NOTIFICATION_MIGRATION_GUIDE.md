# Notification Migration Guide

## Overview
This guide explains the changes made to handle the expo-notifications limitation in Expo Go (SDK 53+) and how to use notifications in your app.

## What Changed?

### The Problem
Starting with Expo SDK 53, remote push notifications are no longer supported in Expo Go. This means:
- `Notifications.scheduleNotificationAsync()` won't work in Expo Go
- Push notifications require a development build or production build

### The Solution
We've implemented a fallback system that:
1. **Development Build**: Uses full notification functionality
2. **Expo Go**: Shows alerts instead of notifications as a fallback

## Updated Files

### Core Files Updated:
1. `app/screens/FirmBookingSummary.jsx`
2. `app/screens/DiningBookingDetails.jsx`
3. `app/screens/SettingNotifications.jsx`
4. `app/screens/TakeAwayCart.jsx`
5. `app/_layout.jsx`
6. `components/NotificationModal.jsx`
7. `Model/Notifications.jsx`

### New Utility File:
- `utils/notificationUtils.js` - Centralized notification handling

## How It Works

### Detection
```javascript
import Constants from 'expo-constants';
const isExpoGo = Constants.appOwnership === 'expo';
```

### Notification Scheduling
```javascript
// Before (would fail in Expo Go)
await Notifications.scheduleNotificationAsync({...});

// After (works in both environments)
if (!isExpoGo) {
  await Notifications.scheduleNotificationAsync({...});
} else {
  Alert.alert(title, message); // Fallback for Expo Go
}
```

## Using the New Notification Utility

### Import the utility:
```javascript
import { 
  scheduleNotification, 
  requestNotificationPermissions,
  checkNotificationPermissions,
  setupNotificationHandler 
} from '@/utils/notificationUtils';
```

### Schedule a notification:
```javascript
// Simple usage
await scheduleNotification('Order Confirmed', 'Your order has been placed successfully!');

// With custom trigger time
await scheduleNotification('Reminder', 'Your booking is in 1 hour', 3600);
```

### Request permissions:
```javascript
const { status } = await requestNotificationPermissions();
if (status === 'granted') {
  // Notifications enabled
} else if (status === 'limited') {
  // Running in Expo Go
} else {
  // Permission denied
}
```

## Development vs Production

### For Development (Expo Go):
- Notifications show as alerts
- Limited functionality
- Good for testing UI flows

### For Production (Development Build):
- Full notification functionality
- Push notifications work
- Background notifications work

## Building for Production

To get full notification functionality, you need to create a development build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS  
eas build --platform ios --profile development
```

## Testing Notifications

### In Expo Go:
1. Notifications appear as alerts
2. Test the notification flow
3. Verify alert messages

### In Development Build:
1. Full notification functionality
2. Test actual push notifications
3. Test notification interactions

## Migration Checklist

- [x] Updated all notification imports
- [x] Added Constants import where needed
- [x] Implemented Expo Go detection
- [x] Added fallback alerts for Expo Go
- [x] Created notification utility
- [x] Updated notification handlers
- [x] Added proper error handling

## Best Practices

1. **Always use the utility functions** instead of direct Notifications API calls
2. **Test in both environments** (Expo Go and development build)
3. **Provide meaningful fallback messages** for Expo Go users
4. **Handle permission states properly** across different environments
5. **Log notification events** for debugging

## Troubleshooting

### Common Issues:

1. **Notifications not showing in Expo Go**
   - Expected behavior - check console for alert fallbacks

2. **Permission errors**
   - Check if running in development build
   - Verify device notification settings

3. **Build errors**
   - Ensure expo-constants is installed
   - Check import statements

### Debug Logs:
Look for these console messages:
- `📱 Running in Expo Go - notifications limited`
- `✅ Notification scheduled: [title]`
- `📱 Notification would be shown: [title]`

## Next Steps

1. **For immediate testing**: Continue using Expo Go with alert fallbacks
2. **For full functionality**: Create a development build using EAS
3. **For production**: Build and deploy with full notification support

## Support

If you encounter issues:
1. Check the console logs for debug messages
2. Verify you're using the utility functions
3. Test in both Expo Go and development build environments
4. Check Expo documentation for the latest notification guidelines