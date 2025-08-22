import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import SearchBar from '@/components/SearchBar';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { styles } from '@/styles/TakeAwayStyles';
import FirmCard from '@/components/FirmCard';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from "@/components/BackRouting";

export default function OnMindScreens() {
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
            const response = await axios.get(`http://192.168.0.101:3000/firm/getnearbyrest?dish=${name}`);

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
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#e23845" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <Fragment>

            <View style={styles.container}>


                <BackRouting tittle={name} />

                <FlatList
                    data={allData}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No restaurants found</Text>
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