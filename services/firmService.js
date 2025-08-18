// import { tiffinApi } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local storage keys
const BOOKMARK_STORAGE_KEY = 'zamato_bookmarks';

class FirmService {
  // async getAllFirms() {
  //   try {
  //     return await tiffinApi.getAllFirms();
  //   } catch (error) {
  //     console.error('Error fetching firms:', error);
  //     throw error;
  //   }
  // }

  // Alias for compatibility with existing components
  // async getFirms() {
  //   return this.getAllFirms();
  // }

  // async getFirmById(firmId) {
  //   try {
  //     return await tiffinApi.getFirmById(firmId);
  //   } catch (error) {
  //     console.error('Error fetching firm details:', error);
  //     throw error;
  //   }
  // }

  // async getFirmMenu(firmId) {
  //   try {
  //     return await tiffinApi.getFirmMenu(firmId);
  //   } catch (error) {
  //     console.error('Error fetching firm menu:', error);
  //     throw error;
  //   }
  // }

  // async getFirmReviews(firmId) {
  //   try {
  //     return await tiffinApi.getFirmReviews(firmId);
  //   } catch (error) {
  //     console.error('Error fetching firm reviews:', error);
  //     throw error;
  //   }
  // }

  // async getFirmOffers(firmId) {
  //   try {
  //     return await tiffinApi.getFirmOffers(firmId);
  //   } catch (error) {
  //     console.error('Error fetching firm offers:', error);
  //     throw error;
  //   }
  // }

  // async searchFirms(query) {
  //   try {
  //     return await tiffinApi.searchFirms(query);
  //   } catch (error) {
  //     console.error('Error searching firms:', error);
  //     throw error;
  //   }
  // }

  // async getNearbyFirms(lat, lng, radius) {
  //   try {
  //     return await tiffinApi.getNearbyFirms(lat, lng, radius);
  //   } catch (error) {
  //     console.error('Error fetching nearby firms:', error);
  //     throw error;
  //   }
  // }

  // async getFeaturedFirms() {
  //   try {
  //     const firms = await tiffinApi.getAllFirms();
  //     return firms.filter(firm => firm.rating >= 4.5);
  //   } catch (error) {
  //     console.error('Error fetching featured firms:', error);
  //     throw error;
  //   }
  // }

  // async getPopularFirms() {
  //   try {
  //     const firms = await tiffinApi.getAllFirms();
  //     return firms.sort((a, b) => b.rating - a.rating).slice(0, 5);
  //   } catch (error) {
  //     console.error('Error fetching popular firms:', error);
  //     throw error;
  //   }
  // }

  // Bookmark management
  async getBookmarks() {
    try {
      const bookmarks = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  }

  async addBookmark(firmId) {
    try {
      const bookmarks = await this.getBookmarks();
      if (!bookmarks.includes(firmId)) {
        bookmarks.push(firmId);
        await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
      }
      return bookmarks;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(firmId) {
    try {
      const bookmarks = await this.getBookmarks();
      const updatedBookmarks = bookmarks.filter(id => id !== firmId);
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

//   async getBookmarkedFirms() {
//     try {
//       const bookmarks = await this.getBookmarks();
//       const firms = await tiffinApi.getAllFirms();
//       return firms.filter(firm => bookmarks.includes(firm.id));
//     } catch (error) {
//       console.error('Error fetching bookmarked firms:', error);
//       throw error;
//     }
//   }
 }

export const firmService = new FirmService();
