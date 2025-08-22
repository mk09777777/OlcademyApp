import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { styles } from '@/styles/TakeAwayStyles';
import { useNavigation } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from "@/components/BackRouting";
import TiffinCard from '@/components/TiffinCard';

export default function OnMindScreens() {
    const route = useRoute();
    const { name, image } = route.params;
    const navigation = useNavigation();
    const [allData, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { safeNavigation } = useSafeNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: name || 'On Mind',
        });
    }, [name, navigation]);

    const fetchFirms = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://192.168.0.101:3000/api/tiffin/tiffins/filter?kitchenName=${name}`);

            if (!response.data || (!Array.isArray(response.data) && !Array.isArray(response.data.tiffins))) {
                throw new Error('Invalid data format from API');
            }

            const data = Array.isArray(response.data) ? response.data : response.data.tiffins;

            const transformedData = data.map(tiffin => {
                if (!tiffin) return null;

                return {
                    id: tiffin._id || tiffin.id,
                    Title: tiffin.kitchenName || tiffin.tiffin_name || 'Unknown Kitchen',
                    Rating: tiffin.ratings || tiffin.rating || 0,
                    Images: Array.isArray(tiffin.images) ? tiffin.images : (tiffin.image_url ? [tiffin.image_url] : []),
                    Prices: tiffin.menu?.mealTypes?.reduce((acc, mealType) => {
                        if (mealType?.prices && typeof mealType.prices === 'object') {
                            const priceValues = Object.values(mealType.prices);
                            if (priceValues.length > 0) {
                                acc[mealType.label || 'default'] = priceValues[0];
                            }
                        }
                        return acc;
                    }, {}) || {},
                    Meal_Types: tiffin.menu?.mealTypes?.map(meal => meal?.label).filter(Boolean) || [],
                    Delivery_Cities: typeof tiffin.deliveryCity === 'string'
                        ? tiffin.deliveryCity.split(',').map(c => c.trim()).filter(Boolean)
                        : [],
                    category: Array.isArray(tiffin.category) ? tiffin.category : [],
                    menu: tiffin.menu || {},
                    isVeg: tiffin.category?.includes('veg') || false,
                    mincost: tiffin.minCost,
                };
            }).filter(Boolean);

            setAllData(transformedData);
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
    }, [name]);

    const toggleFavorite = (id, title) => {
        console.log(`Toggling favorite for ${title} (ID: ${id})`);
        setIsFavorite(prev => !prev);
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
                    keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No restaurants found</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TiffinCard
                            firm={{
                                id: item.id,
                                image: item.Images?.[0] || require('../../assets/images/food1.jpg'),
                                title: item.Title || 'Unknown',
                                rating: item.Rating || 0,
                                priceRange: item.mincost || 'N/A',
                                mealTypes: item.Meal_Types || [],
                                deliveryCities: item.Delivery_Cities || [],
                                isVeg: item.isVeg,
                            }}
                            onPress={() => {
                                safeNavigation({
                                    pathname: '/screens/TiffinDetails',
                                    params: { tiffinId: item.id }
                                });
                            }}
                            onFavoriteToggle={() => toggleFavorite(item.id, item.Title)}
                            isFavorite={isFavorite}
                        />
                    )}
                />
            </View>
        </Fragment>
    );
}