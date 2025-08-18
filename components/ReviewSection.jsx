import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReviewSection = ({ reviews = [], firmId = '' }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleSubmitReview = () => {
    if (!review.trim() || rating === 0) {
      setError('Please provide both rating and review');
      return;
    }
    try {
      // Here you would typically submit the review to your backend
      console.log('Submitting review:', { firmId, rating, review });
      setRating(0);
      setReview('');
      setError('');
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const renderStars = (count, onPress = null) => {
    return Array(5).fill(0).map((_, index) => (
      <TouchableOpacity 
        key={index} 
        onPress={() => onPress?.(index + 1)}
        disabled={!onPress}
      >
        <MaterialCommunityIcons
          name={index < count ? 'star' : 'star-outline'}
          size={24}
          color="#FFD700"
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Review Input Section */}
      <Card style={styles.reviewInputCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Write a Review</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Rating:</Text>
            <View style={styles.starsContainer}>
              {renderStars(rating, setRating)}
            </View>
          </View>
          <TextInput
            mode="outlined"
            label="Your Review"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            style={styles.reviewInput}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button 
            mode="contained" 
            onPress={handleSubmitReview}
            style={styles.submitButton}
          >
            Submit Review
          </Button>
        </Card.Content>
      </Card>

      {/* Reviews List */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <ScrollView style={styles.reviewsList}>
          {reviews && reviews.length > 0 ? (
            reviews.map((item, index) => (
              <Card key={`${item.user || 'anonymous'}-${index}`} style={styles.reviewCard}>
                <Card.Content>
                  <View style={styles.reviewHeader}>
                    <Avatar.Text 
                      size={40} 
                      label={(item.user || 'A').charAt(0).toUpperCase()} 
                      style={styles.avatar}
                    />
                    <View style={styles.reviewHeaderText}>
                      <Text style={styles.userName}>{item.user || 'Anonymous'}</Text>
                      <View style={styles.starsContainer}>
                        {renderStars(item.rating || 0)}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{item.comment || 'No comment provided'}</Text>
                  <Text style={styles.reviewDate}>
                    {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  reviewInputCard: {
    margin: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
  reviewInput: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  reviewsContainer: {
    flex: 1,
    padding: 16,
  },
  reviewsList: {
    flex: 1,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#FF4B3A',
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
});

export default ReviewSection;
