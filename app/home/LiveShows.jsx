import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

import SearchBar from '@/components/SearchBar'
import { useRouter } from 'expo-router'
import { useSafeNavigation } from '@/hooks/navigationPage';

export default function LiveShows() {
  const { safeNavigation } = useSafeNavigation();
  
  const Events = [
    {
      id: 1,
      type: 'CONCERT',
      title: 'The Weekend',
      startingTime: '2020/12/21 09:10 PM',
      image: require('@/assets/images/event_1.png'),
      description:
        'Non exercitation ullamco reprehenderit incididunt. Officia incididunt id exercitation velit aliqua ut deserunt do non. Aliquip sunt dolor enim occaecat ullamco id consectetur . h nmgodl jkdkg idngn kdkntn dnvbn ngdivn lgn lg lrtk vnnknertn nvelrkng nv rklg ndfnv lrn gndfv nlnk flgnlnglrgrltr r gkrg flkvnfld trelk nglkdfg rg',
    },
    {
      id: 2,
      type: 'SHOW',
      title: 'Firemasters',
      startingTime: '2020/12/25 08:00 PM',
      image: require('@/assets/images/event_2.png'),
      description:
        'Lorem ipsum dolor sit amet, consectetur elit adipiscing elit. Venenatis pulvinar a amet in, suspendisse vitae, posuere eu tortor et. Und commodo, fermentum, mauris leo eget.',
    },
  ];
  const getMonth = (dateString) => {
    const parts = dateString.split(" ")[0].split("/")
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const monthIndex = parseInt(parts[1], 10) - 1
    return monthNames[monthIndex]
  }
  
  const getDay = (dateString) => {
    const parts = dateString.split(" ")[0].split("/")
    return parseInt(parts[2], 10)
  }
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 py-4 mr-4 ml-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-outfit-bold text-textprimary">
            Explore Events
          </Text>
          <TouchableOpacity onPress={() => safeNavigation('/screens/User')}>
            <Ionicons name='person-circle-outline' size={40} color='#02757A' />
          </TouchableOpacity>
        </View>

        <View className="mr-1.5 ml-1.5">
          <SearchBar
            placeholder="Search events..."
            widthClass="100%"
          />
        </View>

        <View className="flex-row items-center mt-2.5 mb-2.5">
          <View className="flex-1 h-px bg-primary" />
          <Text className="font-outfit text-xs text-textprimary mx-2">
            FEATURED
          </Text>
          <View className="flex-1 h-px bg-primary" />
        </View>

        <View className="flex-row items-center mt-2.5 mb-2.5">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={{ paddingHorizontal: 0 }}
            keyExtractor={(item) => item.id}
            data={Events}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="w-80 h-48 mx-2"
                onPress={() => {
                  safeNavigation({
                    pathname: 'screens/EventDetails',
                    params: { event: JSON.stringify(item) }
                  })
                }}
              >
                <ImageBackground
                  source={item.image}
                  className="w-full h-full rounded-5xl overflow-hidden"
                  borderRadius={20}
                >
                  <View className="absolute top-4 left-4">
                    <View className="bg-white rounded-lg p-2 items-center">
                      <Text className="text-xs font-outfit-bold text-primary">
                        {getMonth(item.startingTime)}
                      </Text>
                      <Text className="text-lg font-outfit-bold text-textprimary">
                        {getDay(item.startingTime)}
                      </Text>
                    </View>
                  </View>
                  <View className="absolute bottom-4 left-4 right-4">
                    <Text className="text-xs font-outfit text-white mb-1">
                      {item.type}
                    </Text>
                    <Text className="text-xl font-outfit-bold text-white">
                      {item.title}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>

        <View className="flex-1 mt-4">
          <View className="flex-row items-center mt-2.5 mb-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="font-outfit text-xs text-textprimary mx-2">
              ALL SHOWS
            </Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            keyExtractor={(item) => item.id}
            data={Events}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row bg-white rounded-3xl mb-4 p-4 shadow-sm"
                onPress={() => {
                  safeNavigation({
                    pathname: 'screens/EventDetails',
                    params: { event: JSON.stringify(item) },
                  })
                }}
              >
                <Image
                  source={item.image}
                  className="w-20 h-20 rounded-2xl"
                />
                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-xs font-outfit text-primary mb-1">
                    {item.type}
                  </Text>
                  <Text className="text-lg font-outfit-bold text-textprimary mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-sm font-outfit text-textsecondary">
                    {item.startingTime}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  )
}