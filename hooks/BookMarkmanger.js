import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useBookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState({ restaurants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await AsyncStorage.getItem('@bookmarks');
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem('@bookmarks', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      throw error;
    }
  };

  const toggleBookmark = async (id, category = 'restaurants') => {
    const newBookmarks = { ...bookmarks };
    
    if (!newBookmarks[category]) {
      newBookmarks[category] = [];
    }

    const index = newBookmarks[category].indexOf(id);
    if (index === -1) {
      newBookmarks[category].push(id);
    } else {
      newBookmarks[category].splice(index, 1);
    }

    setBookmarks(newBookmarks);
    await saveBookmarks(newBookmarks);
    return newBookmarks;
  };

  const isBookmarked = (id, category = 'restaurants') => {
    return bookmarks[category]?.includes(id) || false;
  };

  const clearBookmarks = async () => {
    try {
      await AsyncStorage.removeItem('@bookmarks');
      setBookmarks({ restaurants: [] });
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  };

  return { 
    bookmarks, 
    toggleBookmark, 
    isBookmarked, 
    clearBookmarks,
    loading 
  };
};

export default useBookmarkManager;