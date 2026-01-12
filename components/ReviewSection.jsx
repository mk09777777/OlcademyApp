import React, { useState } from 'react';
import {
  View,
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
          className="mr-1"
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View className="flex-1 bg-white">
      {/* Review Input Section */}
      <Card className="m-4 shadow-md">
        <Card.Content>
          <Text className="text-lg font-bold mb-4 text-gray-800">Write a Review</Text>

          <View className="flex-row items-center mb-4">
            <Text className="text-base text-gray-600 mr-2">Rating:</Text>
            <View className="flex-row items-center">{renderStars(rating, setRating)}</View>
          </View>

          <TextInput
            mode="outlined"
            label="Your Review"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            className="mb-4"
          />

          {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}

          <Button mode="contained" onPress={handleSubmitReview} className="mt-2 bg-green-600">
            Submit Review
          </Button>
        </Card.Content>
      </Card>

      {/* Reviews List */}
      <View className="flex-1 px-4 pb-4">
        <Text className="text-lg font-bold mb-4 text-gray-800">Customer Reviews</Text>

        <ScrollView className="flex-1">
          {reviews && reviews.length > 0 ? (
            reviews.map((item, index) => (
              <Card key={`${item.user || 'anonymous'}-${index}`} className="mb-4">
                <Card.Content>
                  <View className="flex-row items-center mb-2">
                    <Avatar.Text
                      size={40}
                      label={(item.user || 'A').charAt(0).toUpperCase()}
                      className="mr-3 bg-red-500"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-800 mb-1">{item.user || 'Anonymous'}</Text>
                      <View className="flex-row items-center">{renderStars(item.rating || 0)}</View>
                    </View>
                  </View>

                  <Text className="text-sm text-gray-600 my-2">{item.comment || 'No comment provided'}</Text>
                  <Text className="text-xs text-gray-400">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">No reviews yet. Be the first to review!</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ReviewSection;

/* ---------------- OLD STYLESHEET (COMMENTED OUT) ----------------
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
------------------------------------------------------------------ */
