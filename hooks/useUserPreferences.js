import { useState, useCallback, useEffect } from 'react';
import { tiffinApi } from '../services/api';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    favoriteCuisines: [],
    dietaryPreferences: [],
    pricePreference: 'medium',
    deliveryTime: [],
    mealTypes: [],
    maxDistance: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tiffinApi.getUserPreferences();
      setPreferences(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      setLoading(true);
      const updatedPreferences = await tiffinApi.updateUserPreferences(newPreferences);
      setPreferences(updatedPreferences);
      setError(null);
      return updatedPreferences;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tiffinApi.getFavorites();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (providerId) => {
    try {
      setLoading(true);
      await tiffinApi.toggleFavorite(providerId);
      
      // Update local state
      const provider = await tiffinApi.getProviderById(providerId);
      setFavorites(prev => {
        const isCurrentlyFavorite = prev.some(f => f.id === providerId);
        if (isCurrentlyFavorite) {
          return prev.filter(f => f.id !== providerId);
        }
        return [...prev, provider];
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPreferences();
    fetchFavorites();
  }, [fetchPreferences, fetchFavorites]);

  return {
    preferences,
    favorites,
    loading,
    error,
    updatePreferences,
    toggleFavorite,
    refetchPreferences: fetchPreferences,
    refetchFavorites: fetchFavorites,
  };
}; 