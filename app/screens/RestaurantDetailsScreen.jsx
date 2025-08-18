import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView, Image, FlatList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const RestaurantDetailsScreen = () => {
  const params = useLocalSearchParams();
  
  // Parse the restaurant data passed from FirmDetailsTakeAway
  const restaurant = params.restaurant ? JSON.parse(params.restaurant) : {
    restaurantInfo: {
      name: "The Spice Garden",
      ratings: {
        overall: 4.5,
        totalReviews: 1200
      },
      cuisines: ["Indian, Chinese, Continental"],
      priceRange: "CAN$31 to CAN$50",
      address: "123 Food Street, Bangalore, Karnataka 560001",
      phoneNo: "+919876543210",
      website: "http://example.com",
      additionalInfo: {
        parking: "Available",
        diningStyle: "Casual Dining",
        dressCode: "Casual",
        publicTransit: "Nearby station"
      },
      overview: "A wonderful dining experience with authentic flavors and excellent service. Our chefs bring decades of experience to create memorable dishes."
    },
    opening_hours: {
      MondayMon: "11:30AM-10PM",
      TuesdayTue: "11:30AM-10PM",
      WednesdayWed: "11:30AM-10:30PM",
      ThursdayThu: "11:30AM-11PM",
      FridayFri: "11:30AM-11PM",
      SaturdaySat: "10:30AM-11PM",
      SundaySun: "10:30AM-10PM"
    },
    features: ["Outdoor seating", "Takeaway", "Сredit cards accepted", "Full Bar", "Free Wifi"],
    image_urls: []
  };

  const renderHours = () => {
    if (!restaurant.opening_hours) return null;
    
    return Object.entries(restaurant.opening_hours).map(([day, hours]) => (
      <View key={day} style={styles.hoursRow}>
        <Text style={styles.hoursDay}>{day.replace(/[a-z]/gi, '')}:</Text>
        <Text style={styles.hoursTime}>{hours}</Text>
      </View>
    ));
  };

  const renderFeatures = () => {
    if (!restaurant.features) return null;
    
    return (
      <View style={styles.featuresContainer}>
        {restaurant.features.slice(0, 5).map((feature, index) => (
          <View key={index} style={styles.featurePill}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restaurant Details</Text>
        </View>

        {/* Restaurant Image */}
        {restaurant.image_urls?.length > 0 ? (
          <Image 
            source={{ uri: restaurant.image_urls[0] }} 
            style={styles.restaurantImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome name="cutlery" size={50} color="#fff" />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{restaurant.restaurantInfo?.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <FontAwesome name="star" size={14} color="#fff" />
              <Text style={styles.ratingText}>{restaurant.restaurantInfo?.ratings?.overall || '4.2'}</Text>
            </View>
            <Text style={styles.ratingCount}>({restaurant.restaurantInfo?.ratings?.totalReviews || '500+'} reviews)</Text>
          </View>

          {restaurant.restaurantInfo?.cuisines && (
            <Text style={styles.subtitle}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="#666" /> 
              {Array.isArray(restaurant.restaurantInfo.cuisines) 
                ? restaurant.restaurantInfo.cuisines.join(", ") 
                : restaurant.restaurantInfo.cuisines}
            </Text>
          )}
          
          {restaurant.restaurantInfo?.priceRange && (
            <Text style={styles.subtitle}>
              <Entypo name="price-tag" size={14} color="#666" /> 
              {restaurant.restaurantInfo.priceRange}
            </Text>
          )}

          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.address}>{restaurant.restaurantInfo?.address}</Text>
          </View>

          {/* Features */}
          {renderFeatures()}
        </View>

        {/* Action Icons */}
        <View style={styles.actionsRow}>
          {restaurant.restaurantInfo?.phoneNo && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => Linking.openURL(`tel:${restaurant.restaurantInfo.phoneNo}`)}
            >
              <Ionicons name="call-outline" size={20} color="#E03546" />
              <Text style={styles.iconButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          
          {restaurant.restaurantInfo?.address && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.restaurantInfo.address}`)}
            >
              <MaterialIcons name="directions" size={20} color="#E03546" />
              <Text style={styles.iconButtonText}>Directions</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={20} color="#E03546" />
            <Text style={styles.iconButtonText}>Share</Text>
          </TouchableOpacity>
          
          {restaurant.restaurantInfo?.website && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => Linking.openURL(restaurant.restaurantInfo.website)}
            >
              <MaterialCommunityIcons name="web" size={20} color="#E03546" />
              <Text style={styles.iconButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Restaurant Overview */}
        {restaurant.restaurantInfo?.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.infoText}>{restaurant.restaurantInfo.overview}</Text>
          </View>
        )}

        {/* Additional Info */}
        {restaurant.restaurantInfo?.additionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            {restaurant.restaurantInfo.additionalInfo.diningStyle && (
              <View style={styles.infoRow}>
                <FontAwesome5 name="utensils" size={16} color="#666" />
                <Text style={styles.infoText}> {restaurant.restaurantInfo.additionalInfo.diningStyle}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.dressCode && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="tshirt-crew-outline" size={16} color="#666" />
                <Text style={styles.infoText}> {restaurant.restaurantInfo.additionalInfo.dressCode}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.parking && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="parking" size={16} color="#666" />
                <Text style={styles.infoText}> {restaurant.restaurantInfo.additionalInfo.parking}</Text>
              </View>
            )}
            {restaurant.restaurantInfo.additionalInfo.publicTransit && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="train-car" size={16} color="#666" />
                <Text style={styles.infoText}> {restaurant.restaurantInfo.additionalInfo.publicTransit}</Text>
              </View>
            )}
          </View>
        )}

        {/* Hours */}
        {restaurant.opening_hours && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours</Text>
            {renderHours()}
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <Text style={styles.feedbackText}>Had a bad experience here?</Text>
          <TouchableOpacity style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>Report an issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  restaurantImage: {
    height: 220,
    width: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 220,
    backgroundColor: '#E03546',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#51C452',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 12,
  },
  ratingCount: {
    color: '#666',
    fontSize: 12,
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
  },
  address: {
    color: '#666',
    marginLeft: 4,
    fontSize: 14,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  featurePill: {
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureText: {
    color: '#666',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  iconButton: {
    alignItems: 'center',
    padding: 8,
    minWidth: 60,
  },
  iconButtonText: {
    color: '#E03546',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingRight: 16,
  },
  hoursDay: {
    fontWeight: '500',
    color: '#333',
  },
  hoursTime: {
    color: '#666',
  },
  feedbackText: {
    color: '#666',
    marginBottom: 8,
  },
  feedbackButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E03546',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#E03546',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#E03546',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailsScreen; 