import { useState, useCallback, useRef } from 'react';
// import { tiffinApi } from '../services/api';
// import { API_SORT } from '../config/api';

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchTimeout = useRef(null);

  const searchProviders = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tiffinApi.searchProviders(searchQuery, {
        sort: API_SORT.RELEVANCE,
        limit: 20
      });

      setResults(response);

      // Add to recent searches if not already present
      if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
      }

    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [recentSearches]);

  // Debounced search handler
  const handleSearch = useCallback((searchQuery) => {
    setQuery(searchQuery);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Set new timeout
    searchTimeout.current = setTimeout(() => {
      searchProviders(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchProviders]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    recentSearches,
    handleSearch,
    clearSearch,
    clearRecentSearches,
  };
}; 