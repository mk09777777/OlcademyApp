import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BackRouting from "@/components/BackRouting";
import TiffinCard from '@/components/TiffinCard';
import { API_CONFIG } from '../../config/apiConfig';

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
            const response = await axios.get(`${API_CONFIG.BACKEND_URL}/api/tiffin/tiffins/filter`, {
                params: { kitchenName: name },
                withCredentials: true,
            });

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
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#e23845" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500 text-base font-outfit text-center px-4">{error}</Text>
            </View>
        );
    }

    return (
        <Fragment>
            <View className="flex-1 bg-white">
                <BackRouting tittle={name} />

                <FlatList
                    data={allData}
                    keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500 text-base font-outfit">No restaurants found</Text>
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