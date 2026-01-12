import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

const DetailHeader = ({
  title,
  onBack,
  onShare,
  onFavorite,
  isFavorite,
  scrollY,
  headerHeight,
  cartItems = [],
}) => {
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 2],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View
        className="absolute top-0 left-0 right-0 z-50"
        style={{
          height: headerHeight + STATUSBAR_HEIGHT,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 bg-white border-b border-gray-200"
          style={{
            opacity: headerOpacity,
          }}
        />
        <View className="flex-1 flex-row items-center justify-between px-4" style={{ marginTop: STATUSBAR_HEIGHT }}>
          <TouchableOpacity 
            onPress={onBack} 
            className="p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Animated.Text 
            className="text-lg font-outfit-semibold color-gray-900 flex-1 text-center mx-4" 
            style={{ opacity: titleOpacity }}
            numberOfLines={1}
          >
            {title || ''}
          </Animated.Text>

          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={onShare} 
              className="p-2 ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onFavorite} 
              className="p-2 ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF4B4B' : '#000'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

/* COMMENTED OUT STYLESHEET - CONVERTED TO NATIVEWIND
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
*/

export default DetailHeader; 