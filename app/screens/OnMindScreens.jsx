import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import SearchBar from '@/components/SearchBar';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import FirmCard from '@/components/FirmCard';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from "@/components/BackRouting";
import { API_CONFIG } from '../../config/apiConfig';

export default function OnMindScreens() {
    /* Original CSS Reference:
     * container: { flex: 1, backgroundColor: 'white', padding: 5 }
     * center: { justifyContent: 'center', alignItems: 'center' }
     * errorText: { fontSize: 16, color: '#d32f2f', textAlign: 'center', fontFamily: 'outfit' }
     * emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
     * emptyText: { fontSize: 18, color: '#666', textAlign: 'center', fontFamily: 'outfit-medium' }
     * topContainer: { flexDirection: 'row', justifyContent: 'space-between' }
     * locationContainer: { flexDirection: 'row' }
     * topActionPannel: { flexDirection: 'row' }
     * locationName: { fontFamily: 'outfit-medium', fontSize: 16 }
     * locationAddress: { fontFamily: 'outfit', fontSize: 14, color: 'gray' }
     * offerBanner: { marginTop: 20, width: '100%', height: 270, borderRadius: 10 }
     * searchAndVegContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, minHeight: 0 }
     * searchBarWrapper: { flex: 1, marginRight: 0 }
     * searchBar: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 50, backgroundColor: '#f0f0f0' }
     * vegFilterContainer: { flexDirection: "column", alignItems: 'center', justifyContent: "flex-start", marginLeft: 10 }
     * vegFilterText: { fontSize: 14, fontFamily: 'outfit', fontWeight: 'bold', color: '#333', textAlign: 'center', fontWeight: '500' }
     * vegFilterText2: { fontSize: 12, fontFamily: 'outfit', fontWeight: '900', color: '#333', textAlign: 'center' }
     * separatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 10 }
     * line: { flex: 1, height: 1, backgroundColor: '#FF002E' }
     * separatorText: { fontFamily: 'outfit', fontSize: 13, color: '#222222', marginHorizontal: 7 }
     * filterContainer: { marginBottom: 10 }
     * filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e23845' }
     * filterText: { fontFamily: 'outfit-medium', fontSize: 14, fontWeight: '500' }
     * modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.5)" }
     * modalContent: { height: windowHeight * 0.35, backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }
     * modalTitle: { fontSize: 20, fontFamily: "outfit-bold", marginBottom: 20, textAlign: "center" }
     * modalButton: { backgroundColor: "#e23845", padding: 10, borderRadius: 10, alignItems: "center", marginBottom: 10 }
     * modalButtonText: { color: "#fff", fontSize: 16, fontFamily: "outfit-bold" }
     * radioText: { fontSize: 18, fontFamily: "outfit-bold" }
     * proceedButton: { backgroundColor: "#e23845", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 10, width: 60 }
     * proceedButtonText: { color: "#fff", fontSize: 16, fontFamily: "outfit-bold" }
     * cuisinesList: { paddingVertical: 5 }
     * checkBoxIcon: { borderColor: "#e23845", borderWidth: 2 }
     * checkBoxText: { textDecorationLine: "none", fontSize: 20, fontFamily: 'outfit-medium', color: "#333" }
     * checkBoxContainer: { height: '65%', paddingBottom: 10 }
     * selectedFilterButton: { backgroundColor: '#e23845' }
     * selectedFilterText: { fontFamily: 'outfit', color: '#fff' }
     * featuredContainer: { flexGrow: 0, overflow: 'hidden' }
     * featuredCard: { paddingHorizontal: 10, width: 0.9*windowWidth, height: 0.25*windowHeight }
     * featured: { borderRadius: 10, flex: 1 }
     * featuredCardBottom: { position: 'absolute', bottom: 10, paddingLeft: 10 }
     * featuredEventType: { fontFamily: 'outfit', fontSize: 16, color: '#ccc' }
     * featuredEventTitle: { fontFamily: 'outfit-meduim', fontSize: 20, color: 'white' }
     * mindScrollContainer: { flexDirection: 'row', justifyContent: 'space-evenly', paddingLeft: 10 }
     * mindCard: { alignItems: 'center', marginHorizontal: 8 }
     * mindImage: { width: 60, height: 60, borderRadius: 35 }
     * mindTitle: { fontSize: 14, fontFamily: 'outfit-medium', marginTop: 2, textAlign: 'center', marginBottom: 12 }
     * mindSeparator: { width: 10 }
     */
    // const { name } = useLocalSearchParams();
    const route = useRoute();
    const { name, image } = route.params;
    console.log('Received params:', { name, image });

    const navigation = useNavigation();
    const [allData, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { safeNavigation } = useSafeNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: name || 'On Mind',
        });
    }, [name, navigation]);



    const fetchFirms = async () => {
        console.log("name is", name);
        console.log("Fetching firms...");
        setIsLoading(true);
        try {

            const response = await axios.get(`${API_CONFIG.BACKEND_URL}/firm/getnearbyrest?dish=${name}`);

            let firmsData;

            if (Array.isArray(response.data)) {
                firmsData = response.data;
            } else if (Array.isArray(response.data.restaurants)) {
                firmsData = response.data.restaurants;
            } else if (Array.isArray(response.data.data)) {
                firmsData = response.data.data;
            } else {
                throw new Error('Unexpected API response structure');
            }

            setAllData(firmsData);
            setError(null);
        } catch (error) {
            console.error('Error fetching firms:', error);
            setError(error.message || 'Failed to load restaurants. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFirms();
    }, []);

    const handleBookmarkPress = (id) => {
        console.log(`Bookmark pressed for firm ${id}`);
    };

    const isBookmarked = (id, type) => {
        return false;
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-white p-1 justify-center items-center">
                <ActivityIndicator size="large" color="#e23845" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white p-1 justify-center items-center">
                <Text className="text-base text-red-700 text-center" style={{ fontFamily: 'outfit' }}>{error}</Text>
            </View>
        );
    }

    return (
        <Fragment>

            <View className="flex-1 bg-white p-1">


                <BackRouting tittle={name} />

                <FlatList
                    data={allData}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center p-5">
                            <Text className="text-lg text-gray-600 text-center" style={{ fontFamily: 'outfit-medium' }}>No restaurants found</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        if (!item || !item.restaurantInfo) {
                            console.warn('Invalid restaurant item:', item);
                            return null;
                        }

                        return (
                            <FirmCard
                                firmId={item._id}
                                restaurantInfo={item.restaurantInfo}
                                firmName={item.restaurantInfo.name}
                                area={item.restaurantInfo.address}
                                rating={item.restaurantInfo.ratings?.overall}
                                cuisines={item.restaurantInfo.cuisines}
                                price={item.restaurantInfo.priceRange}
                                image={item.image_urls}
                                onPress={() =>
                                    safeNavigation({
                                        pathname: 'screens/FirmDetailsTakeAway',
                                        params: { firmId: item._id },
                                    })
                                }
                                offer={item.offer}
                                onBookmark={() => handleBookmarkPress(item._id)}
                                isBookmarked={isBookmarked(item._id, 'restaurants')}
                            />
                        );
                    }}
                />
            </View>
        </Fragment>
    );
}