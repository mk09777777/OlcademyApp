import { View, Text, FlatList, TouchableOpacity, Linking, Platform, Modal, SafeAreaView, ActivityIndicator, Dimensions, Image, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { styles } from '@/styles/FirmDetailsDiningStyles'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import OffersCard from '@/components/OffersCard'
import ReviewCard from '@/components/ReviewCard'
import ImageGallery from '@/components/ImageGallery'
import MiniRecommendedCard from '@/components/MiniRecommendedCard'
import { useSafeNavigation } from '@/hooks/navigationPage'
const API_URL = 'http://192.168.0.101:3000'
const PRODUCT_API_URL = 'http://192.168.0.101:8000/api/collection/products'

export default function FirmDetailsDining() {
  const { firmId } = useGlobalSearchParams()
  const router = useRouter()
  const { safeNavigation } = useSafeNavigation();
  const [firmDetails, setFirmDetails] = useState(null)
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

  const reviews = [
    { id: "1", name: "Rakesh", date: "2 days ago", rating: 5, review: "Great ambiance and service!" },
    { id: "2", name: "Sneha", date: "1 week ago", rating: 4, review: "Amazing food but slow service." },
    { id: "3", name: "Amit", date: "3 days ago", rating: 5, review: "One of the best places around!" }
  ]

  const fetchRestaurantDetails = async (id) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://192.168.0.101:3000/firm/getOne/${id}`, { timeout: 5000 })
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
        faqs: restaurantData.faqs || []
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

  const UploadRecentlyViewd = async () => {
    try {
      // getSimilar()
      const restId = firmId
      if (!restId) return
      await axios.post(`${API_URL}/firm/recently-viewed/${restId}`, null, {
        withCredentials: true
      });
      console.log("recently viewed uploaded successfully")
    } catch (err) {
      console.error("Failed to upload recently viewed:", err)
    }
  }




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
      UploadRecentlyViewd()
    }
  }, [firmId])

  useEffect(() => {
    if (firmDetails && firmDetails.restaurantInfo && firmDetails.restaurantInfo.name) {
      getSimilar();
    }
  }, [firmDetails]);

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
    { id: 'Prebook', value: 'offers' },
    { id: 'Menu', value: 'Menu' },
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
          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>OFFERS</Text>
            <View style={styles.line} />
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
          <Text style={styles.subHeader}>Photos</Text>
          <FlatList
            data={[...previewImages, 'last']}
            numColumns={3}
            renderItem={({ item, index }) => {
              if (item === 'last') {
                return (
                  <TouchableOpacity
                    style={styles.galleryOverlayContainer}
                    onPress={() => router.navigate({
                      pathname: 'screens/PhotoGallery',
                      params: {
                        image_urls: JSON.stringify(firmDetails.restaurantInfo.image_urls),
                        firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
                        price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
                      }
                    })}
                  >
                    <Image source={{ uri: previewImages[previewImages.length - 1] }} style={styles.galleryImage} />
                    <View style={styles.galleryOverlay}>
                      <Text style={styles.galleryOverlayText}>+{totalImages - 5} More</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
              return <Image source={{ uri: item }} style={styles.galleryImage} />
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )
    }

    if (filtersActive.Reviews && reviews.length > 0) {
      return (
        <View>
          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>REVIEWS</Text>
            <View style={styles.line} />
          </View>
          <FlatList
            data={reviews}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ReviewCard
                name={item.name}
                date={item.date}
                rating={item.rating}
                review={item.review}
                firmName={firmDetails?.restaurantInfo?.name || "Restaurant"}
                details={firmDetails?.restaurantInfo?.address || ""}
                followers={45}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )
    }

    if (filtersActive.Menu) {
      return (
        <View>
          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>MENU</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.imageBoxContainer}>
            <Image style={styles.imageBox} source={require("../../assets/images/menu.jpeg")} />
          </View>
        </View>
      )
    }

    return (
      <View>
        <View>
          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>OFFERS</Text>
            <View style={styles.line} />
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
            <Text style={styles.subHeader}>Photos</Text>
            <FlatList
              data={[...firmDetails.restaurantInfo.image_urls.slice(0, 5), 'last']}
              numColumns={3}
              renderItem={({ item, index }) => {
                if (item === 'last') {
                  return (
                    <TouchableOpacity
                      style={styles.galleryOverlayContainer}
                      onPress={() => router.navigate({
                        pathname: 'screens/PhotoGallery',
                        params: {
                          image_urls: JSON.stringify(firmDetails.restaurantInfo.image_urls),
                          firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
                          price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
                        }
                      })}
                    >
                      <Image source={{ uri: firmDetails.restaurantInfo.image_urls[firmDetails.restaurantInfo.image_urls.length - 1] }} style={styles.galleryImage} />
                      <View style={styles.galleryOverlay}>
                        <Text style={styles.galleryOverlayText}>
                          +{firmDetails.restaurantInfo.image_urls.length - 5} More
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                }
                return <Image source={{ uri: item }} style={styles.galleryImage} />
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

        <View>
          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>REVIEWS</Text>
            <View style={styles.line} />
          </View>
          <FlatList
            data={reviews}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ReviewCard
                name={item.name}
                date={item.date}
                rating={item.rating}
                review={item.review}
                firmName={firmDetails?.restaurantInfo?.name || "Restaurant"}
                details={firmDetails?.restaurantInfo?.address || ""}
                followers={45}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <View style={styles.separatorRow}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>MENU</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity
          style={styles.imageBoxContainer}
          onPress={() => router.navigate({
            pathname: 'screens/PhotoGallery',
            params: {
              image_urls: require("../../assets/images/menu.jpeg"),
              firmName: firmDetails?.restaurantInfo?.name || "Restaurant",
              price: firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'
            }
          })}
        >
          <Image style={styles.imageBox} source={require("../../assets/images/menu.jpeg")} />
        </TouchableOpacity>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        ListHeaderComponent={
          <View>
            <View style={styles.imageContainer}>
              <ImageGallery
              style={{backgroundColor:"rgba(0, 0, 0, 0.63)"}}
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
                style={styles.gradientOverlay}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 0.5, y: 1 }}
              />
              <View style={styles.upperPannel}>
                <TouchableOpacity onPress={() => router.back()} style={{borderRadius:"100%",backgroundColor:"#00000066",padding:2,alignItems:"center",justifyContent:"center"}}>
                  <Ionicons name='chevron-back' size={28} color='white' />
                </TouchableOpacity>
                <View style={styles.rightPannel}>
                 
                </View>
              </View>
              <View style={styles.bottomPannel}>
                <LinearGradient
                 colors={[
              '#181818CC',
              '#18181866',
              '#18181800'
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={{flexDirection:"row"}}
                >
                  <View style={{padding:10}}>
                    <View style={styles.mainPannel}>
                  <Text style={styles.restaurantName}>
                    {firmDetails?.restaurantInfo?.name || "Restaurant"}
                  </Text>
                  <Text style={styles.restaurantAddress}>
                    {firmDetails?.restaurantInfo?.address || ""}
                  </Text>
                  <Text style={styles.cuisines}>
                    {Array.isArray(firmDetails?.restaurantInfo?.cuisines) ?
                      firmDetails.restaurantInfo.cuisines.join(' • ') :
                      firmDetails?.restaurantInfo?.cuisines || 'Italian • Dessert'}
                  </Text>
                  <Text style={styles.price}>
                    {firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'}
                  </Text>
                  <TouchableOpacity
                    style={styles.openingHrsBackground}
                    onPress={() => setOpeningHrsVisible(true)}
                  >
                           <View style={{backgroundColor:"white",borderRadius:"100%",marginRight:10}}>
                              <AntDesign name="checkcircle" size={18} color="#048520" />
                           </View>
                    <Text style={{color:"white",fontFamily:"outfit-medium",fontSize:16}} >Open From | </Text>
          
                    <Text style={styles.openingHrs}>
                      {Object.values(firmDetails?.opening_hours || {})[0] || 'Opening hrs 12:00 to 23:00'}
                    </Text>
                  </TouchableOpacity>
                </View>
                  </View>
           
                <TouchableOpacity
                  style={styles.reviewBox}
                  onPress={() => safeNavigation({
                    pathname: "/screens/Reviewsall",
                    params: {
                      firmId: firmId,
                      restaurantName: firmDetails?.restaurantInfo?.name,
                      averageRating: firmDetails?.restaurantInfo?.ratings?.overall,
                      reviewCount: firmDetails?.restaurantInfo?.ratings?.totalReviews
                    }
                  })}
                >
                  <View style={styles.reviewBoxTopContainer}>
                    <View style={styles.reviewBoxUpperContainer}>
                      <Text style={styles.reviewText}>
                        {firmDetails?.restaurantInfo?.ratings?.overall?.toFixed(1) || '4.5'}
                      </Text>
                      <FontAwesome name='star' size={24} color='white' />
                    </View>
                  </View>
                  <View style={styles.reviewBoxBottomContainer}>
                    <Text style={styles.reviewCount}>
                      {firmDetails?.restaurantInfo?.ratings?.totalReviews || '2918'}
                    </Text>
                    <Text style={styles.reviewCount}>
                      Reviews
                    </Text>
                  </View>
                </TouchableOpacity>
                     </LinearGradient>
              </View>
            </View>
            <View style={styles.buttonViewContainer}>
              <TouchableOpacity style={styles.button} onPress={togglePopup}>
                <Text style={styles.buttonText}>Book a table</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${firmDetails?.restaurantInfo?.name || "Restaurant"}`)}>
                <FontAwesome5 name='directions' size={24} color='#e23845' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => makeCall(firmDetails?.restaurantInfo?.phoneNo || '0123456789')}>
                <Feather name="phone-call" size={24} color="#e23845" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterBox}>
              <FlatList
                data={FilterValues}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleActive(item)}>
                    <View style={filtersActive[item.id] ? styles.filterActive : styles.filterInactive}>
                      <Text style={filtersActive[item.id] ? styles.filterTextActive : styles.filterValueText}>
                        {item.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            {renderContent()}
            <View style={styles.separatorRow}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>ABOUT</Text>
              <View style={styles.line} />
            </View>
            <View style={{ padding: 20, backgroundColor: '#fff' }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12 }}>About the Restaurant</Text>
                <Text style={{
                  fontSize: 15,
                  lineHeight: 22,
                  color: '#555',
                  borderLeftWidth: 3,
                  borderLeftColor: '#FF6B6B',
                  paddingLeft: 12
                }}>
                  {firmDetails?.restaurantInfo?.overview || "Italian inspired cuisine in a stylishly elegant setting."}
                </Text>
              </View>
              <View style={{
                backgroundColor: '#F8F9FA',
                borderRadius: 10,
                padding: 16,
                marginBottom: 20
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <FontAwesome5 name="rupee-sign" size={16} color="#28A745" />
                  <Text style={{ fontSize: 15, marginLeft: 10, color: '#333' }}>
                    {firmDetails?.restaurantInfo?.priceRange || '₹1010 for Two'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <MaterialIcons name="restaurant" size={18} color="#FF6B6B" />
                  <Text style={{ fontSize: 15, marginLeft: 10, color: '#333' }}>
                    {Array.isArray(firmDetails?.restaurantInfo?.cuisines) ?
                      firmDetails.restaurantInfo.cuisines.join(', ') :
                      firmDetails?.restaurantInfo?.cuisines || 'Italian, Dessert'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="access-time" size={18} color="#007BFF" />
                  <Text style={{ fontSize: 15, marginLeft: 10, color: '#333' }}>
                    {firmDetails?.restaurantInfo?.timings || '11:00 AM - 11:00 PM'}
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12 }}>Available Facilities</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {firmDetails?.features?.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10, paddingRight: 10 }}>
                      <FontAwesome5 name="check-circle" size={14} color="#28A745" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 14, color: '#555' }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {similar ? <View style={{ marginBottom: 20 }}>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>Similar Restaurants</Text>
                <FlatList
                  data={similar}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id}
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
              </View> : <></>}
              {firmDetails?.faqs?.length > 0 && (
                <View>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 12 }}>Frequently Asked Questions</Text>
                  {firmDetails.faqs.map((faq) => (
                    <View key={faq._id} style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 16 }}>
                      <Text style={{ fontWeight: '600', fontSize: 15, color: '#333', marginBottom: 6 }}>{faq.question}</Text>
                      <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{faq.answer}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        }
        keyExtractor={category => category}
        renderItem={({ item: category }) => (
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(category)}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.toggleIcon}>{collapsed[category] ? "▼" : "▲"}</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Choose Number of Guests</Text>
            <View style={styles.guestControls}>
              <TouchableOpacity style={styles.guestButton} onPress={() => setGuests(Math.max(1, guests - 1))}>
                <Text style={styles.guestButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.guestCount}>{guests}</Text>
              <TouchableOpacity style={styles.guestButton} onPress={() => setGuests(guests + 1)}>
                <Text style={styles.guestButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={openingHrsVisible} transparent animationType="slide">
        <View style={styles.openingHrsModalOverlay}>
          <View style={styles.openingHrsModalContainer}>
            <Text style={styles.openingHrsModalHeader}>Opening Hours</Text>
            <FlatList
              data={formatOpeningHours(firmDetails?.opening_hours)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <Text style={styles.openingHrsModalText}>{item.day}</Text>
                  <Text style={styles.openingHrsModalText}>{item.time}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.openingHrsCloseButton} onPress={() => setOpeningHrsVisible(false)}>
              <Text style={styles.openingHrsCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}