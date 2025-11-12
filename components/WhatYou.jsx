import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const foodData = [
  { id: '1', name: 'Punjabi', image: require('@/assets/images/dish.jpg') },
  { id: '2', name: 'Gujarati', image: require('@/assets/images/dish1.jpg') },
  { id: '3', name: 'South Indian', image: require('@/assets/images/food5.jpg') },
  { id: '4', name: 'Indian', image: require('@/assets/images/food.jpg') },
  { id: '5', name: 'Marathi', image: require('@/assets/images/food1.jpg') },
  { id: '6', name: 'Jain', image: require('@/assets/images/food2.jpg') },
  { id: '7', name: 'Swaminarayan', image: require('@/assets/images/food3.jpg') },
];

const Whatsonyou = () => {
  return (
    <View className="bg-white my-2.5">
      <View className="items-center mb-4">
        <Text className="font-bold text-[16px] text-[#222222] uppercase tracking-wider mb-1 mx-2">
          WHAT'S ON YOUR MIND?
        </Text>
        <View className="w-[50px] h-[3px] bg-[#FF6B6B] rounded-md" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 0 }}
      >
        {foodData.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="w-[80px] items-center justify-center"
            onPress={() =>
              router.push({
                pathname: '/screens/tiffinonmind',
                params: { name: item?.name },
              })
            }
          >
            <Image source={item.image} className="w-[60px] h-[60px] rounded-full mb-1.5" />
            <Text className="text-[13px] font-medium text-[#333] text-center">
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Whatsonyou;

/* ---------------- OLD STYLESHEET (Commented Out) ----------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: 'outfit-Bold',
    fontSize: 14,
    color: '#3333',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 5,
    fontFamily: 'outfit',
    fontSize: 16,
    color: '#222222',
    marginHorizontal: 7
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: '#FF6B6B', 
    borderRadius: 3,
  },
  horizontalList: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

---------------------------------------------------------------- */
