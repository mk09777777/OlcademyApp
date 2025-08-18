import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { styles } from '@/styles/LiveShowsStyles'
import { Ionicons } from '@expo/vector-icons'
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
    <View
      style={styles.container}
    >
      <View
        style={styles.upperPannel}
      >
        <Text
          style={styles.headerText}
        >
          Explore Events
        </Text>
        <TouchableOpacity 
                       style={styles.profileButton}
                       onPress={() => safeNavigation('/screens/User')}
                     >
                      <Ionicons name='person-circle' size={40} style={{color: '#e23845'}}/>
                     </TouchableOpacity>
      </View>
      <SearchBar/>
      <View
        style={styles.separatorRow}
      >
        <View 
          style={styles.line}
        />
        <Text
          style={styles.separatorText}
        >
          FEATURED
        </Text>
        <View 
          style={styles.line}
        />
      </View>
      <View>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          contentContainerStyle={styles.featuredContainer}
          keyExtractor={(item) => item.id}
          data={Events}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => {
                safeNavigation({
                  pathname: 'screens/EventDetails',
                  params: { event: JSON.stringify(item) }
                })
              }}
            >
              <ImageBackground 
                source={item.image} 
                style={styles.featured}
                borderRadius={20}
              >
                <View
                  style={styles.dateCardContainer}
                >
                  <View
                    style={styles.dateCard}
                  >
                    <Text
                      style={styles.month}
                    >
                      {getMonth(item.startingTime)}
                    </Text>
                    <Text
                      style={styles.day}
                    >
                      {getDay(item.startingTime)}
                    </Text>
                  </View>
                </View>
                <View
                  style={styles.featuredCardBottom}
                >
                  <Text
                    style={styles.featuredEventType}
                  >
                    {item.type}
                  </Text>
                  <Text
                    style={styles.featuredEventTitle}
                  >
                    {item.title}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={styles.container1}
      >
        <View
          style={styles.separatorRow}
        >
          <View 
            style={styles.line}
          />
          <Text
            style={styles.separatorText}
          >
            ALL SHOWS
          </Text>
          <View 
            style={styles.line}
          />
        </View>
        <FlatList
        contentContainerStyle={styles.allShowsContainer}
        keyExtractor={(item) => item.id}
        data={Events}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.allShowsCard}
            onPress={() => {
              safeNavigation({
                pathname: 'screens/EventDetails',
                params: { event: JSON.stringify(item) },
              })
            }}
          >
            <Image 
              source={item.image} 
              style={styles.allShowsImage}
            />
            <View
              style={styles.allShowsCardDetails}
            >
              <Text
                style={styles.allShowsCardType}
              >
                {item.type}
              </Text>
              <Text
                style={styles.allShowsCardTitle}
              >
                {item.title}
              </Text>
              <Text
                style={styles.allShowsCardDate}
              >
                {item.startingTime}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
    </View>
  )
}