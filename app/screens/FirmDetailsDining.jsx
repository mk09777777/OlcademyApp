import { View, Text, FlatList, TouchableOpacity, Linking, Platform, Modal, ActivityIndicator, Dimensions, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import OffersCard from '@/components/OffersCard'
import ReviewCard from '@/components/ReviewCard'
import ImageGallery from '@/components/ImageGallery'
import MiniRecommendedCard from '@/components/MiniRecommendedCard'
import { useSafeNavigation } from '@/hooks/navigationPage'

import { API_CONFIG } from '../../config/apiConfig';
const API_URL = API_CONFIG.BACKEND_URL;
const PRODUCT_API_URL =  API_CONFIG.BACKEND_URL;

export default function FirmDetailsDining() {
  /* Original CSS Reference:
   * container: { flex: 1, backgroundColor: '#f8f7f7ff', paddingBottom: 20 }
   * imageContainer: { width: '100%', height: windowHeight * 0.40 }
   * primaryImage: { width: '100%', height: '100%' }
   * upperPannel: { position: 'absolute', top: 10, left: 0, right: 0, zIndex: 10, paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
   * rightPannel: { flexDirection: 'row' }
   * loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
   * loadingText: { marginTop: 16, color: '#666' }
   * bottomPannel: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
   * reviewBox: { borderRadius: 10, marginTop: 110, marginRight: 10 }
   * gradientOverlay: { position: 'absolute', height: '100%', width: '100%' }
   * reviewBoxTopContainer: { backgroundColor: '#048520', padding: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 }
   * reviewBoxUpperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
   * reviewBoxBottomContainer: { backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }
   * subHeader: { fontFamily: 'outfit-bold', marginTop: 16, marginLeft: 10, fontSize: 20 }
   * reviewText: { fontFamily: 'outfit', color: 'white', fontSize: 15, marginRight: 7 }
   * reviewCount: { fontFamily: 'outfit', fontSize: 12, textAlign: 'center', marginTop: 4, color: "#333333" }
   * reviewCount2: { fontFamily: 'outfit', fontSize: 12, textAlign: 'center', color: "#333333" }
   * restaurantName: { fontFamily: 'outfit-bold', fontSize: 30, color: 'white' }
   * restaurantAddress: { width: 250, fontFamily: 'outfit', fontSize: 16, color: '#eee', marginTop: 4, textShadowColor: 'rgba(0, 0, 0, 0.63)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }
   * cuisines: { width: 250, fontFamily: 'outfit', color: 'white', fontSize: 18 }
   * openingHrs: { fontFamily: 'outfit', fontSize: 16, color: "white", fontWeight: "400" }
   * openingHrsBackground: { marginTop: 12, marginBottom: 20, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.71)", alignSelf: 'flex-start', flexDirection: "row", alignItems: "center" }
   * price: { fontFamily: 'outfit', fontSize: 16, color: 'white' }
   * separatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 10, paddingHorizontal: 10 }
   * line: { flex: 1, height: 0.4, backgroundColor: '#E03A48' }
   * separatorText: { fontFamily: 'outfit', fontSize: 14, color: '#444444', marginHorizontal: 7, fontWeight: 700 }
   * button: { marginTop: 10, marginRight: 10, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 40, elevation: 1, flex: 1, padding: 10 }
   * button2: { marginTop: 10, marginRight: 10, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20, elevation: 1, padding: 9, paddingLeft: 20, paddingRight: 20 }
   * buttonViewContainer: { display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: 10, position: "absolute", top: 320 }
   * buttonText: { fontFamily: 'outfit-medium', fontSize: 15, color: '#333333' }
   * filterBox: { marginLeft: 20, marginRight: 20, borderRadius: 30, padding: 3, backgroundColor: "#F8F8FA", display: "flex", flexDirection: "row", marginTop: 50, justifyContent: "space-between", borderWidth: 1, borderColor: "#D9D9D9" }
   * imageBoxContainer: { marginTop: 10, marginRight: 20, marginLeft: 20, borderRadius: 20, display: "flex" }
   * imageBox: { height: undefined, aspectRatio: 9/12, width: 100, borderRadius: 10 }
   * filterValueText: { color: "#333333", fontWeight: "400", fontSize: 13, marginRight: 15, fontFamily: "outfit" }
   * filterTextActive: { color: "#333333", fontWeight: "600", fontSize: 13, fontFamily: "outfit" }
   * filterActive: { backgroundColor: "white", borderWidth: 1, borderRadius: 18, borderColor: "#E03A48", paddingHorizontal: 11, paddingVertical: 5, justifyContent: "center", alignItems: "center" }
   * modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.5)" }
   * popup: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }
   * popupTitle: { fontSize: 20, fontFamily: 'outfit-bold', marginBottom: 20, textAlign: "center" }
   * guestControls: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 }
   * guestButton: { backgroundColor: "#e23845", borderRadius: 20, width: 40, height: 40, marginHorizontal: 10, alignItems: "center", justifyContent: "center" }
   * guestButtonText: { color: "#fff", fontSize: 25, fontFamily: "outfit-bold" }
   * guestCount: { fontSize: 18, fontFamily: "outfit-bold" }
   * proceedButton: { backgroundColor: "#e23845", padding: 10, borderRadius: 10, alignItems: "center" }
   * proceedButtonText: { color: "#fff", fontSize: 18, fontFamily: "outfit-bold" }
   * categoryContainer: { marginBottom: 10, borderRadius: 8, overflow: "hidden" }
   * categoryHeader: { flexDirection: "row", justifyContent: "space-between", padding: 12 }
   * categoryTitle: { fontSize: 18, fontFamily: "outfit-medium" }
   * toggleIcon: { fontSize: 18 }
   * galleryImage: { width: '30%', height: 100, borderRadius: 10, marginLeft: 10, marginTop: 4 }
   * galleryOverlayContainer: { position: 'relative', width: '30%', margin: 4 }
   * galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
   * galleryOverlayText: { color: '#fff', fontSize: 16, fontFamily: 'outfit-bold' }
   * openingHrsModalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)", justifyContent: "center", alignItems: "center" }
   * openingHrsModalContainer: { width: "90%", backgroundColor: "#FFF", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }
   * openingHrsModalHeader: { fontFamily: 'outfit-bold', fontSize: 20 }
   * openingHrsModalText: { fontFamily: 'outfit', fontSize: 16 }
   * openingHrsCloseButton: { marginTop: 10, padding: 8, backgroundColor: '#e23845', borderRadius: 10 }
   * openingHrsCloseButtonText: { fontFamily: 'outfit-medium', textAlign: 'center', fontSize: 16, color: 'white' }
   */
  const { firmId } = useGlobalSearchParams()
  const router = useRouter()
  const { safeNavigation } = useSafeNavigation()
  const [firmDetails, setFirmDetails] = useState({
    restaurantInfo: {},
    opening_hours: {},
    features: [],
    insights: [],
    faqs: [],
    reviews: []
  })
  const [products, setProducts] = useState([])
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [guests, setGuests] = useState(1)
  const [toggleBookmark, setToggleBookmark] = useState(false)
  const [openingHrsVisible, setOpeningHrsVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [similar, setsimilar] = useState([])
  const [filtersActive, setFiltersActive] = useState({
    Prebook: false,
    walkin: false,
    Menu: false,
    Photos: false,
    Reviews: false,
    About: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const windowHeight = Dimensions.get('window').height

  const offers = [
    { id: 1, title: "Flat 10% Off on Orders Above 399", validity: "Valid till 15th February" },
    { id: 2, title: "Flat 20% Off on Orders Upto 200", validity: "Valid till 28th February" },
    { id: 3, title: "Items @99", validity: "Valid Today" }
  ]

  const fetchRestaurantDetails = async (id) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/firm/getOne/${id}`, { timeout: 5000 })
      if (!response.data) throw new Error('Restaurant data not available')
      const restaurantData = response.data
      setFirmDetails({
        restaurantInfo: {
          name: restaurantData.restaurantInfo?.name || "Restaurant",
          address: restaurantData.restaurantInfo?.address || "",
          cuisines: restaurantData.restaurantInfo?.cuisines || [],
          additionalInfo: restaurantData.restaurantInfo?.additionalInfo || {},
          ratings: restaurantData.restaurantInfo?.ratings || { overall: 0, totalReviews: 0 },
          phoneNo: restaurantData.restaurantInfo?.phoneNo || "",
          website: restaurantData.restaurantInfo?.website || "",
          priceRange: restaurantData.restaurantInfo?.priceRange || "",
          overview: restaurantData.restaurantInfo?.overview || "",
          image_urls: restaurantData.image_urls || []
        },
        opening_hours: restaurantData.opening_hours || {},
        features: restaurantData.features || [],
        insights: restaurantData.insights || [],
        faqs: restaurantData.faqs || [],
        reviews: restaurantData.reviews || []
      })

      const productIds = restaurantData?.product || []
      if (productIds.length > 0) {
        const productsResponse = await axios.get(`${PRODUCT_API_URL}?ids=${productIds.join(',')}`)
        setProducts(productsResponse.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

const UploadRecentlyViewed = async () => {
  try {
    const restId = firmId;
    if (!restId) {
      console.warn("No restaurant ID available for recently viewed tracking");
      return;
    }

    const response = await axios.post(
      `${API_URL}/firm/recently-viewed/${restId}`,
      {},
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    console.log("Recently viewed uploaded successfully:", response.data);
  } catch (err) {
    console.error("Failed to upload recently viewed:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
};

  const getSimilar = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/recommend?restaurant=${firmDetails.restaurantInfo.name}`)
      setsimilar(res.data)
      setLoading(false)
    } catch (err) {
      console.log("Error fetching similar restaurants:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (firmId) {
      fetchRestaurantDetails(firmId)
      UploadRecentlyViewed()
    }
  }, [firmId])

  useEffect(() => {
    if (firmDetails?.restaurantInfo?.name) {
      getSimilar()
    }
  }, [firmDetails])

  const groupedProducts = products.reduce((acc, item) => {
    const category = item.category.length > 0 ? item.category[0] : "Others"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  const categories = Object.keys(groupedProducts)

  const [collapsed, setCollapsed] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: true }), {})
  )

  const toggleCategory = (category) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const makeCall = (number) => {
    let link = Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`
    Linking.openURL(link)
  }

  const togglePopup = () => setIsPopupVisible(!isPopupVisible)

  const handleProceed = () => {
    setIsPopupVisible(false)
    safeNavigation({
      pathname: 'screens/FirmBookingSelectDateTime',
      params: {
        firmId,
        guestCount: guests,
        firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
        offers: JSON.stringify(offers),
        firmadd: firmDetails?.restaurantInfo?.address || "nan",
        time: encodeURIComponent(JSON.stringify(firmDetails?.opening_hours || "closed")),
      }
    })
  }

  const FilterValues = [
    { id: 'Menu', value: 'Menu' },
    { id: 'Prebook', value: 'offers' },
    { id: 'Photos', value: 'Photos' },
    { id: 'Reviews', value: 'Reviews' },
  ]

  const handleActive = (filter) => {
    setFiltersActive(prev => {
      const updated = {}
      Object.keys(prev).forEach(key => {
        updated[key] = false
      })
      updated[filter.id] = true
      return updated
    })
  }

  const formatOpeningHours = (hours) => {
    if (!hours) return []
    return Object.entries(hours).map(([day, time]) => ({
      day: day.replace(/([a-z])([A-Z])/g, '$1 $2'),
      time
    }))
  }

  const renderContent = () => {
    if (filtersActive.Prebook && offers.length > 0) {
      return (
        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>OFFERS</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            data={offers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <OffersCard offerTitle={item.title} offerValidity={item.validity} />}
          />
        </View>
      )
    }

    if (filtersActive.Photos && firmDetails?.restaurantInfo?.image_urls?.length > 0) {
      const previewImages = firmDetails.restaurantInfo.image_urls.slice(0, 5)
      const totalImages = firmDetails.restaurantInfo.image_urls.length
      return (
        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>Photos</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            data={[...previewImages, 'last']}
            numColumns={3}
            renderItem={({ item, index }) => {
              if (item === 'last') {
                return (
                  <TouchableOpacity
                    className="relative w-1/3 m-1"
                    onPress={() => router.navigate({
                      pathname: 'screens/PhotoGallery',
                      params: {
                        image_urls: JSON.stringify(firmDetails.restaurantInfo.image_urls),
                        firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
                        price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
                      }
                    })}
                  >
                    <Image source={{ uri: previewImages[previewImages.length - 2] }} className="rounded-lg" style={{ width: 100, height: 100 }} />
                    <View className="absolute inset-0 bg-black/50 justify-center items-center rounded-lg">
                      <Text className="text-white text-base font-outfit-bold">+{totalImages - 6} More</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
              return <Image source={{ uri: item }} className="rounded-lg m-1" style={{ width: 100, height: 100 }} />
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )
    }

    if (filtersActive.Reviews && firmDetails?.reviews?.length > 0) {
      return (
        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>REVIEWS</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            data={firmDetails.reviews}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <ReviewCard
                name={item.author_name}
                date={item.date}
                rating={item.rating}
                review={item.comments?.[0] || ""}
                firmName={firmDetails?.restaurantInfo?.name || "Restaurant"}
                details={firmDetails?.restaurantInfo?.address || ""}
                followers={item.followers || 0}
              />
            )}
          />
        </View>
      )
    }

    if (filtersActive.Menu) {
      return (
        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>MENU</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <View className="mt-2.5 mx-5 rounded-2xl flex">
            <Image className="rounded-lg" style={{ width: 70, height: 50 }} source={require("../../assets/images/menu.jpeg")} />
          </View>
        </View>
      )
    }

    return (
      <View>
        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>Menu</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <TouchableOpacity
            className="mt-2.5 mx-5 rounded-2xl flex"
            onPress={() => router.navigate({
              pathname: 'screens/PhotoGallery',
              params: {
                image_urls: require("../../assets/images/menu.jpeg"),
                firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
                price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
              }
            })}
          >
            <Image className="rounded-lg" style={{ width: 90, height: 110 }} source={require("../../assets/images/menu.jpeg")} />
          </TouchableOpacity>

          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>Offers</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            data={offers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <OffersCard offerTitle={item.title} offerValidity={item.validity} />}
          />
        </View>

        {firmDetails?.restaurantInfo?.image_urls?.length > 0 && (
          <View>
            <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
              <View className="flex-1 h-px bg-primary" />
              <Text className="text-sm text-gray-700 mx-2 font-outfit-bold">Photos</Text>
              <View className="flex-1 h-px bg-primary" />
            </View>
            <View className="items-center">
              <FlatList
                data={[...firmDetails.restaurantInfo.image_urls.slice(0, 5), 'last']}
                numColumns={3}
                renderItem={({ item, index }) => {
                  if (item === 'last') {
                    return (
                      <TouchableOpacity
                        className="relative m-1"
                        onPress={() => router.navigate({
                          pathname: 'screens/PhotoGallery',
                          params: {
                            image_urls: JSON.stringify(firmDetails.restaurantInfo.image_urls),
                            firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
                            price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
                          }
                        })}
                      >
                        <Image source={{ uri: firmDetails.restaurantInfo.image_urls[firmDetails.restaurantInfo.image_urls.length - 1] }} className="rounded-lg justifiy-center items-center" style={{ width: 100, height: 100 }} />
                        <View className="absolute inset-0 bg-black/50 justify-center items-center rounded-lg">
                          <Text className="text-white text-sm font-outfit-bold">
                            +{firmDetails.restaurantInfo.image_urls.length - 5} More
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }
                  return <Image source={{ uri: item }} className="rounded-lg m-1" style={{ width: 100, height: 100 }} />
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        )}

        <View>
          <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
            <View className="flex-1 h-px bg-primary" />
            <Text className="text-sm text-gray-700 mx-2 font-outfit-bold">Reviews</Text>
            <View className="flex-1 h-px bg-primary" />
          </View>
          <FlatList
            data={firmDetails?.reviews || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <ReviewCard
                name={item.author_name}
                date={item.date}
                rating={item.rating}
                review={item.comments?.[0] || ""}
                firmName={firmDetails?.restaurantInfo?.name || "Restaurant"}
                details={firmDetails?.restaurantInfo?.address || ""}
                followers={item.followers || 0}
              />
            )}
          />
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f0fafaff]">
        <ActivityIndicator size="large" color="#02757A" />
        <Text className="text-textsecondary font-outfit mt-4">Loading service details...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-background">
        <Text className="text-primary font-outfit p-4">Error: {error}</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 pb-5">
      <FlatList
        data={categories}
        ListHeaderComponent={
          <View>
            <View className="relative h-80">
              <ImageGallery
                style={{ backgroundColor: "rgba(0, 0, 0, 0.63)" }}
                images={
                  firmDetails?.restaurantInfo?.image_urls?.length > 0
                    ? firmDetails.restaurantInfo.image_urls
                    : [require('@/assets/images/food1.jpg')]
                }
                currentIndex={currentImageIndex}
                onIndexChange={(index) => setCurrentImageIndex(index)}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                className="absolute inset-0"
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 0.5, y: 1 }}
              />
              <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center z-10">
                <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-black/40 p-2 items-center justify-center">
                  <Ionicons name='chevron-back' size={28} color='white' />
                </TouchableOpacity>
                <View></View>
              </View>
              <View className="absolute bottom-0 left-0 right-0 h-[60%] flex-row justify-between items-center">
                <LinearGradient
                  colors={["#18181800", "#18181866", "#181818CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="flex-row w-full justify-between mr-10"
                >
                  <View className="w-[80%] p-1">
                    <View>
                      <Text className="text-xl text-white font-outfit-bold">
                        {firmDetails?.restaurantInfo?.name || "Restaurant"}
                      </Text>
                      <Text className="text-base text-gray-200 mt-1 font-outfit" style={{ width: 250, textShadowColor: 'rgba(0, 0, 0, 0.63)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
                        {firmDetails?.restaurantInfo?.address || ""}
                      </Text>
                      <Text className="text-lg text-white font-outfit" style={{ width: 250 }}>
                        {Array.isArray(firmDetails?.restaurantInfo?.cuisines)
                          ? firmDetails.restaurantInfo.cuisines.join(' • ')
                          : firmDetails?.restaurantInfo?.cuisines || 'Italian • Dessert'}
                      </Text>
                      <Text className="text-base text-white font-outfit">
                        {firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'}
                      </Text>
                      <TouchableOpacity
                        className="mt-3 mb-5 px-3.5 py-2 rounded-2xl flex-row items-center self-start"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.71)" }}
                        onPress={() => setOpeningHrsVisible(true)}
                      >
                        <View className="bg-white rounded-full mr-2.5 w-5 h-5 justify-center items-center">
                          <AntDesign name="check-circle" size={18} color="#048520" />
                        </View>
                        <Text className="text-white text-base font-outfit-medium">Open From | </Text>
                        <Text className="text-white text-base font-outfit">
                          {Object.values(firmDetails?.opening_hours || {})[0] || 'Opening hrs 12:00 to 23:00'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="rounded-lg mt-28 mr-2.5"
                    onPress={() => safeNavigation({
                      pathname: "/screens/Reviewsall",
                      params: {
                        firmId: firmId,
                        restaurantName: firmDetails?.restaurantInfo?.name,
                        averageRating: firmDetails?.restaurantInfo?.ratings?.overall,
                        reviewCount: firmDetails?.restaurantInfo?.ratings?.totalReviews,
                         reviewType:"dining"
                      }
                    })}
                  >
                    <View className="bg-green-600 p-2 rounded-t-lg">
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white text-base mr-2 font-outfit">
                          {firmDetails?.restaurantInfo?.ratings?.overall?.toFixed(1) || '4.5'}
                        </Text>
                        <FontAwesome name='star' size={18} color='white' />
                      </View>
                    </View>
                    <View className="bg-white rounded-b-lg">
                      <Text className="text-xs text-gray-800 text-center mt-1 font-outfit">
                        {firmDetails?.restaurantInfo?.ratings?.totalReviews || '2179'}
                      </Text>
                      <Text className="text-xs text-gray-800 text-center" style={{ fontFamily: 'outfit' }}>Reviews</Text>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
            <View className="flex-row items-center justify-between p-4 bg-white border-b border-border">
              <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg mr-3" onPress={togglePopup}>
                <Text className="text-white text-center font-outfit-bold">Book a table</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-3 border border-primary rounded-lg mr-2" onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${firmDetails?.restaurantInfo?.name || "Restaurant"}`)}>
                <FontAwesome5 name='directions' size={22} color='#02757A' />
              </TouchableOpacity>
              <TouchableOpacity className="p-3 border border-primary rounded-lg" onPress={() => makeCall(firmDetails?.restaurantInfo?.phoneNo || '0123456789')}>
                <MaterialIcons name="call" size={22} color="#02757A" />
              </TouchableOpacity>
            </View>
            <View className="mx-5 rounded-3xl p-1 bg-gray-50 flex-row mt-12 justify-between border border-gray-300">
              <FlatList
                data={FilterValues}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity className="justify-center items-center ml-5" onPress={() => handleActive(item)}>
                    <View className={filtersActive[item.id] ? "bg-white border border-red-500 rounded-2xl px-3 py-1 justify-center items-center" : ""}>
                      <Text className={`text-xs ${filtersActive[item.id] ? "text-gray-800 font-semibold" : "text-gray-800 mr-4"}`} style={{ fontFamily: "outfit" }}>
                        {item.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            {renderContent()}
            <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
              <View className="flex-1 h-px bg-primary" />
              <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>About</Text>
              <View className="flex-1 h-px bg-primary" />
            </View>
            <View style={{ padding: 20 }}>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#D9D9D9"
              }}>
                <Text style={{ fontSize: 14, color: '#444444', fontWeight: '700' }}>
                  {(() => {
                    const overview = firmDetails?.restaurantInfo?.overview || "Experience authentic Italian-inspired cuisine crafted with passion, combining traditional flavors and modern presentation in a stylishly elegant setting. Our chefs carefully select the freshest seasonal ingredients to create dishes that delight the senses, whether you are enjoying a romantic dinner, a casual gathering with friends, or a family celebration. With a warm ambiance, attentive service, and thoughtfully curated menu, we strive to make every dining experience memorable, offering a perfect blend of comfort and sophistication.";
                    const words = overview.split(" ");
                    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : overview;
                  })()}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 20 }}>
                  <FontAwesome5 name="rupee-sign" size={16} color="#02757A" />
                  <Text style={{ fontSize: 12, marginLeft: 10, color: '#444444' }}>
                    {firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialIcons name="restaurant" size={16} color="#02757A" />
                  <Text style={{ fontSize: 12, marginLeft: 10, color: '' }}>
                    {Array.isArray(firmDetails?.restaurantInfo?.cuisines)
                      ? firmDetails.restaurantInfo.cuisines.join(', ')
                      : firmDetails?.restaurantInfo?.cuisines || 'Italian, Dessert'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="access-time" size={16} color="#02757A" />
                  <Text style={{ fontSize: 12, marginLeft: 10, color: '#444444' }}>
                    {firmDetails?.restaurantInfo?.timings || '11:00 AM - 11:00 PM'}
                  </Text>
                </View>
              </View>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#D9D9D9"
              }}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#444444', marginBottom: 12 }}>Facilities</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {firmDetails?.features?.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10, paddingRight: 34 }}>
                      <AntDesign name="check-circle" size={16} color="#048520" style={{ marginRight: 12 }} />
                      <Text style={{ fontSize: 12, color: '#444444' }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {similar ? (
                <View className="mb-5">
                  <View className="flex-row items-center mt-6 mb-2.5 px-2.5">
                    <View className="flex-1 h-px bg-primary" />
                    <Text className="text-sm text-gray-700 mx-2 font-bold" style={{ fontFamily: 'outfit' }}>Explore other restaurants</Text>
                    <View className="flex-1 h-px bg-primary" />
                  </View>
                  <FlatList
                    data={similar}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    className="ml-2.5"
                    renderItem={({ item }) => (
                      <MiniRecommendedCard
                        name={item.restaurant_name}
                        address={item.address}
                        image={item.image_url}
                        rating={item.rating}
                        onPress={() => safeNavigation({ pathname: '/screens/FirmDetailsDining', params: { firmId: item.id } })}
                      />
                    )}
                  />
                </View>
              ) : null}
            </View>
          </View>
        }
        keyExtractor={category => category}
        renderItem={({ item: category }) => (
          <View className="mb-2.5 rounded-lg overflow-hidden">
            <TouchableOpacity className="flex-row justify-between p-3" onPress={() => toggleCategory(category)}>
              <Text className="text-lg" style={{ fontFamily: "outfit-medium" }}>{category}</Text>
              <Text className="text-lg">{collapsed[category] ? "▼" : "▲"}</Text>
            </TouchableOpacity>
            {!collapsed[category] && (
              <FlatList
                data={groupedProducts[category]}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <ProductCard
                    productName={item.productName}
                    price={item.price}
                    description={item.description}
                    diatry={item.category[0]}
                  />
                )}
              />
            )}
          </View>
        )}
      />

      <Modal transparent visible={isPopupVisible} animationType="slide" onRequestClose={togglePopup}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 mx-4 w-80">
            <Text className="text-textprimary text-lg font-outfit-bold text-center mb-6">Choose Number of Guests</Text>
            <View className="flex-row items-center justify-center mb-6">
              <TouchableOpacity className="bg-border w-10 h-10 rounded-full items-center justify-center" onPress={() => setGuests(Math.max(1, guests - 1))}>
                <Text className="text-textprimary text-xl font-outfit-bold">-</Text>
              </TouchableOpacity>
              <Text className="text-textprimary text-2xl font-outfit-bold mx-8">{guests}</Text>
              <TouchableOpacity className="bg-border w-10 h-10 rounded-full items-center justify-center" onPress={() => setGuests(guests + 1)}>
                <Text className="text-textprimary text-xl font-outfit-bold">+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-primary py-3 rounded-lg" onPress={handleProceed}>
              <Text className="text-white text-center font-outfit-bold">Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={openingHrsVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="w-11/12 bg-white rounded-xl p-4 shadow-lg">
            <Text className="text-xl mb-4" style={{ fontFamily: 'outfit-bold' }}>Opening Hours</Text>
            <FlatList
              data={formatOpeningHours(firmDetails?.opening_hours)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="flex-row justify-between py-2">
                  <Text className="text-base" style={{ fontFamily: 'outfit' }}>{item.day}</Text>
                  <Text className="text-base" style={{ fontFamily: 'outfit' }}>{item.time}</Text>
                </View>
              )}
            />
            <TouchableOpacity className="mt-2.5 p-2 bg-primary rounded-lg" onPress={() => setOpeningHrsVisible(false)}>
              <Text className="text-white text-center text-base" style={{ fontFamily: 'outfit-medium' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}