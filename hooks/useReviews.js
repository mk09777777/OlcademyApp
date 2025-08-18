import { useState, useCallback } from 'react';
import { tiffinApi } from '../services/api';

export const useReviews = (providerId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const fetchReviews = useCallback(async () => {
    if (!providerId) return;
    
    try {
      setLoading(true);
      const data = await tiffinApi.getReviews(providerId);
      setReviews(data);
      
      // Calculate review statistics
      const total = data.length;
      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      const distribution = data.reduce((acc, review) => {
        acc[Math.floor(review.rating)]++;
        return acc;
      }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

      setStats({
        averageRating: total > 0 ? sum / total : 0,
        totalReviews: total,
        ratingDistribution: distribution,
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  const createReview = useCallback(async (reviewData) => {
    if (!providerId) return;

    try {
      setLoading(true);
      const newReview = await tiffinApi.createReview(providerId, reviewData);
      
      // Update reviews list
      setReviews(prev => [newReview, ...prev]);
      
      // Update statistics
      setStats(prev => {
        const newTotal = prev.totalReviews + 1;
        const newSum = prev.averageRating * prev.totalReviews + newReview.rating;
        const newDistribution = { ...prev.ratingDistribution };
        newDistribution[Math.floor(newReview.rating)]++;

        return {
          averageRating: newSum / newTotal,
          totalReviews: newTotal,
          ratingDistribution: newDistribution,
        };
      });
      
      setError(null);
      return newReview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  const updateReview = useCallback(async (reviewId, updateData) => {
    if (!providerId) return;

    try {
      setLoading(true);
      const updatedReview = await tiffinApi.updateReview(providerId, reviewId, updateData);
      
      // Update reviews list
      setReviews(prev => 
        prev.map(review => review.id === reviewId ? updatedReview : review)
      );
      
      // Recalculate statistics
      const total = reviews.length;
      const sum = reviews.reduce((acc, review) => 
        acc + (review.id === reviewId ? updatedReview.rating : review.rating), 0
      );
      const distribution = reviews.reduce((acc, review) => {
        if (review.id === reviewId) {
          acc[Math.floor(updatedReview.rating)]++;
        } else {
          acc[Math.floor(review.rating)]++;
        }
        return acc;
      }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

      setStats({
        averageRating: sum / total,
        totalReviews: total,
        ratingDistribution: distribution,
      });
      
      setError(null);
      return updatedReview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [providerId, reviews]);

  return {
    reviews,
    stats,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
  };
}; 