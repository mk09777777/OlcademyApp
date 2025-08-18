import { useState, useEffect, useCallback } from 'react';
import { firmService } from '../services/firmService';
import { API_ERRORS } from '../config/api';

export const useFirms = () => {
  // Data states
  const [firms, setFirms] = useState({
    featured: [],
    popular: [],
    nearby: [],
    all: []
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    cuisine: [],
    sort: 'rating'
  });

  // Load initial data
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load all data in parallel
      const [featuredFirms, popularFirms, allFirms, userBookmarks] = await Promise.all([
        // firmService.getFeaturedFirms(),
        // firmService.getPopularFirms(),
        // firmService.getFirms(),
        firmService.getBookmarks()
      ]);

      setFirms({
        featured: featuredFirms,
        popular: popularFirms,
        nearby: [],
        all: allFirms
      });
      setBookmarks(userBookmarks);

    } catch (error) {
      console.error('Error loading firms:', error);
      setError(error.message || API_ERRORS.UNKNOWN);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Search firms
  const searchFirms = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await firmService.searchFirms(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching firms:', error);
      setError(error.message || API_ERRORS.UNKNOWN);
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (firmId) => {
    try {
      const isBookmarked = await firmService.toggleBookmark(firmId);
      if (isBookmarked) {
        setBookmarks(prev => [...prev, firmId]);
      } else {
        setBookmarks(prev => prev.filter(id => id !== firmId));
      }
      return isBookmarked;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setError(error.message || API_ERRORS.UNKNOWN);
      return null;
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, []);

  return {
    firms,
    bookmarks,
    searchResults,
    isLoading,
    error,
    refreshing,
    filters,
    searchFirms,
    toggleBookmark,
    updateFilters,
    refreshData
  };
};
