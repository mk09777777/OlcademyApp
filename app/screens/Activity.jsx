import React, { useState, useEffect } from 'react'; 
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import styles from '../../styles/Activity';
import { useAuth } from '../../context/AuthContext';
import BackRouting from '@/components/BackRouting';
import { router } from 'expo-router';

const ActivityPage = () => {
  const { user: authUser, profileData, api } = useAuth();
  const [activeTab, setActiveTab] = useState('Reviews');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    username: authUser?.username || 'User',
    followers: profileData?.followers || 0,
    following: profileData?.following || 0,
    avatar: authUser?.avatar || null,
  });

  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  const [selectedComment, setSelectedComment] = useState(null);
  const [commentvisible, setCommentvisible] = useState(false);
  const [comment, setComment] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [reviewStatus, setReviewStatus] = useState({
    isFollowing: false,
    isLiked: false,
    followers: 0,
    likes: 0
  });
  const [comments, setComments] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    if (authUser) {
      setUser({
        username: authUser.username,
        followers: profileData?.followers || 0,
        following: profileData?.following || 0,
        avatar: authUser.avatar,
      });
    }
  }, [authUser, profileData]);

  useEffect(() => {
    if (selectedComment) {
      fetchReviewStatus(selectedComment._id, selectedComment.reviewType);
      // Set the comments for the selected review
      setComments(selectedComment.comments || []);
      setCommentList(selectedComment.usercomments || []);
    }
  }, [selectedComment]);

  const fetchReviewStatus = async (reviewId, reviewType) => {
    try {
      if (!reviewId) return;    
      const response = await api.get(`/api/reviews/${reviewId}/status`, {
        withCredentials: true,
      });
      
      const { isFollow, isLike, followers, likes } = response.data.data;
      console.log('like', response.data);
      
      setReviewStatus({
        isFollowing: isFollow,
        isLiked: isLike,
        followers: followers,
        likes: likes
      });
    } catch (error) {
      console.error("Error fetching review status:", error);
      setReviewStatus({
        isFollowing: false,
        isLiked: false,
        followers: 0,
        likes: 0
      });
    }
  };

  const handleLike = async (reviewId, reviewType) => {
    try {
      const endpoint = reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${reviewId}/like` 
        : `/api/reviews/${reviewId}/like`;
      
      const response = await api.post(endpoint, {}, { withCredentials: true });
      
      setReviews(prevData => 
        prevData.map(item => 
          item._id === reviewId 
            ? { 
                ...item, 
                isLiked: !item.isLiked, 
                likes: response.data.likes 
              } 
            : item
        )
      );
      
      // Update review status if this is the selected comment
      if (selectedComment && selectedComment._id === reviewId) {
        setReviewStatus(prev => ({
          ...prev,
          isLiked: !prev.isLiked,
          likes: response.data.likes
        }));
      }
    } catch (error) {
      console.error("Error liking review:", error);
      Alert.alert("Error", "Failed to like review");
    }
  };

  const handleFollow = async (reviewId, reviewType) => {
    try {
      const endpoint = reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${reviewId}/follow` 
        : `/api/reviews/${reviewId}/follow`;
      
      const response = await api.post(endpoint, {}, { withCredentials: true });
      
      setReviews(prevData => 
        prevData.map(item => 
          item._id === reviewId 
            ? { 
                ...item, 
                isFollowing: !item.isFollowing, 
                user: {
                  ...item.user,
                  followers: response.data.followers
                }
              } 
            : item
        )
      );
      
      // Update review status if this is the selected comment
      if (selectedComment && selectedComment._id === reviewId) {
        setReviewStatus(prev => ({
          ...prev,
          isFollowing: !prev.isFollowing,
          followers: response.data.followers
        }));
      }
    } catch (error) {
      console.error("Error following user:", error);
      Alert.alert("Error", "Failed to follow user");
    }
  };

  useEffect(() => {
    const fetchUserActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!authUser?.id) {
          throw new Error('User not authenticated');
        }

        // Updated review fetching logic
        console.log('Fetching reviews for user profile');
        const reviewsResponse = await api.get('/api/reviews/user/profile');
        
        console.log('Reviews API Response:', {
          status: reviewsResponse.status,
          data: reviewsResponse.data,
          config: reviewsResponse.config
        });

        // Check if response is an array (direct response) or has a reviews property
        const reviewsData = Array.isArray(reviewsResponse.data) 
          ? reviewsResponse.data 
          : reviewsResponse.data?.reviews || [];
          
        console.log('Processed reviews data:', JSON.stringify(reviewsData));

        if (!Array.isArray(reviewsData)) {
          throw new Error('Invalid reviews data format');
        }

        const reviewsWithLikeStatus = reviewsData.map(review => {
          if (!review) return null;
          
          // Extract firm details based on the structure from the provided data
          const firmDetails = review.firmDetails || {};
          const firmType = review.firmType || 'restaurant';
          
          return {
            imgSrc: firmDetails.imageUrl || require('../../assets/images/food.jpg'),
            title: firmDetails.name || 'General Review',
            address: firmDetails.address || '',
            rating: review.rating || 0,
            reviewText: review.comments || '',
            reviewType: review.reviewType || 'N/A',
            likes: review.likes || 0,
            date: review.createdAt || review.date || new Date(),
            comments: review.usercomments || review.comments || [],
            _id: review._id || Math.random().toString(),
            authorName: typeof review.author_name === 'string' 
              ? review.author_name 
              : (review.authorId?.username || 'User'),
            isLiked: Array.isArray(review.likedBy) 
              ? review.likedBy.includes(authUser.id) || review.likedBy.includes(authUser.email)
              : false,
            likedBy: Array.isArray(review.likedBy) ? review.likedBy : []
          };
        }).filter(Boolean);

        setReviews(reviewsWithLikeStatus);

        // Mock photo and blog data for testing
        setPhotos([
          { _id: '1', imageUrl: require('../../assets/images/food.jpg')},
          { _id: '2', imageUrl: require('../../assets/images/food1.jpg') }
        ]);

        setBlogs([
          { 
            _id: '1', 
            title: 'Sample Blog', 
            content: 'This is a sample blog post content...', 
            createdAt: new Date() 
          }
        ]);

      } catch (error) {
        console.error('Error fetching activity:', error);
        setError(error.message);
        
        let errorMessage = 'Failed to fetch user activity';
        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
          console.error('Error response data:', error.response.data);
        } else if (error.request) {
          errorMessage = 'No response received from server';
          console.error('No response received:', error.request);
        } else {
          console.error('Error config:', error.config);
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, [authUser, api]);

  const togglecomment = (comment = null) => {
    setSelectedComment(comment);
    setCommentvisible(!commentvisible);
    if (!commentvisible) {
      setComment("");
      setReplyMap({});
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      if (!authUser?.id && !authUser?.email) {
        throw new Error('User not available');
      }

      const userIdentifier = authUser.id || authUser.email;
      
      const response = await api.post(`/api/reviews/${reviewId}/like`, { 
        userId: userIdentifier 
      });

      const updatedReviews = reviews.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            likes: response.data.likes || review.likes,
            likedBy: response.data.likedBy || review.likedBy,
            isLiked: Array.isArray(response.data.likedBy) 
              ? response.data.likedBy.includes(userIdentifier) 
              : review.isLiked
          };
        }
        return review;
      });
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error liking review:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to like review'
      );
    }
  };

  const handleComment = (reviewId) => {
    navigation.navigate('/screens/Reviewsall', { 
      reviewId,
      onCommentAdded: async (newComment) => {
        try {
          const response = await api.post(
            `/api/reviews/${reviewId}/comments`,
            { comment: newComment }
          );

          const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
              return {
                ...review,
                comments: [...(review.comments || []), response.data.comment]
              };
            }
            return review;
          });
          setReviews(updatedReviews);
        } catch (error) {
          console.error('Error adding comment:', error);
          Alert.alert('Error', error.response?.data?.message || 'Failed to add comment');
        }
      }
    });
  };

  const handleAddPhoto = () => {
    navigation.navigate('UploadPhoto');
  };

  const handleWriteBlog = () => {
    navigation.navigate('CreateBlog');
  };

  const renderReviewItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          {item.imgSrc ? (
            typeof item.imgSrc === 'string' ? (
              <Image 
                source={{ uri: item.imgSrc }} 
                style={styles.placeImage} 
                onError={() => console.log('Image load failed')}
              />
            ) : (
              <Image source={item.imgSrc} style={styles.placeImage} />
            )
          ) : (
            <Image 
              source={require('../../assets/images/food.jpg')} 
              style={styles.placeImage} 
            />
          )}
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>
              {item.title || 'Untitled Review'}
            </Text>
            {item.address && (
              <Text style={styles.placeLocation} numberOfLines={1}>
                {item.address}
              </Text>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {item.rating ? `${item.rating}★` : 'N/A'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.reviewText}>
          {item.reviewText || 'No review text available'}
        </Text>
        <Text style={styles.dateText}>
          {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown date'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeReview(item._id)}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome 
                name={item.isLiked ? "heart" : "heart-o"} 
                size={18} 
                color={item.isLiked ? "#FF3B30" : "#666"} 
              />
              <Text style={[
                styles.actionButtonText, 
                item.isLiked && styles.actionButtonTextActive
              ]}>
                Like ({item.likes || 0})
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setSelectedComment(item);
              router.push({
                pathname: '/screens/commentscreen',
                params: {
                  commentData: JSON.stringify(item),
                  review: item._id,
                  // firmId: firmId,
                  // restaurantName: params.restaurantName,
                  // reviewType: reviewType,
                }
              });
            }}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome name="comment-o" size={18} color="#666" />
              <Text style={styles.actionButtonText}>
                Comment ({(item.comments || []).length})
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <FontAwesome name="share" size={18} color="#666" />
              <Text style={styles.actionButtonText}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPhotoItem = ({ item }) => {
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          {item.imgSrc ? (
            typeof item.imgSrc === 'string' ? (
              <Image 
                source={{ uri: item.imgSrc }} 
                style={styles.placeImage} 
                onError={() => console.log('Image load failed')}
              />
            ) : (
              <Image source={item.imgSrc} style={styles.placeImage} />
            )
          ) : (
            <Image 
              source={require('../../assets/images/food.jpg')} 
              style={styles.placeImage} 
            />
          )}
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>
              {item.title || 'Untitled Review'}
            </Text>
            {item.address && (
              <Text style={styles.placeLocation} numberOfLines={1}>
                {item.address}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.photoItem}>
          <Image 
            source={item.imageUrl} 
            style={styles.photoImage} 
            onError={() => console.log('Photo load failed')}
          />
        </View>
        <Text style={styles.dateText}>
          {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown date'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeReview(item._id)}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome 
                name={item.isLiked ? "heart" : "heart-o"} 
                size={18} 
                color={item.isLiked ? "#FF3B30" : "#666"} 
              />
              <Text style={[
                styles.actionButtonText, 
                item.isLiked && styles.actionButtonTextActive
              ]}>
                Like ({item.likes || 0})
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome name="comment-o" size={18} color="#666" />
              <Text style={styles.actionButtonText}>
                Comment ({(item.comments || []).length})
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <FontAwesome name="share" size={18} color="#666" />
              <Text style={styles.actionButtonText}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBlogItem = ({ item }) => (
    <View style={styles.blogCard}>
      <Text style={styles.blogTitle}>{item.title || 'Untitled Blog'}</Text>
      <Text style={styles.blogExcerpt} numberOfLines={2}>
        {item.content || 'No content available'}
      </Text>
      <Text style={styles.blogDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
      </Text>
    </View>
  );

  const renderAvatar = () => {
    if (user.avatar) {
      return (
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatarImage} 
          onError={() => console.log('Avatar load failed')}
        />
      );
    }
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'Reviews':
        return (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#1A73E8" />
            ) : reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No reviews to display</Text>
                }
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reviews yet</Text>
              </View>
            )}
          </View>
        );
      case 'Photos':
        return (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#1A73E8" />
            ) : photos.length > 0 ? (
              <FlatList
                key={`photos-${activeTab}`} 
                data={photos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                numColumns={1}
                contentContainerStyle={styles.photoGrid}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No photos yet</Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleAddPhoto}
                >
                  <Text style={styles.emptyActionText}>Add your first photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'Blog':
        return (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#1A73E8" />
            ) : blogs.length > 0 ? (
              <FlatList
                data={blogs}
                renderItem={renderBlogItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No blogs yet</Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleWriteBlog}
                >
                  <Text style={styles.emptyActionText}>Write your first blog</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <BackRouting tittle="Activity"/>
      <ScrollView>
        <View className="items-center p-2.5">
          <View className="w-full h-45 rounded-2.5 overflow-hidden">
            <Image source={require('../../assets/images/food2.jpg')} className="w-full h-full" />
          </View>
          
          {/* User Profile Section */}
          <View className="items-center p-5 border-b border-gray-200">
            {renderAvatar()}
            <Text className="pb-2.5 text-2xl font-bold my-1.5">{user.username || 'User'}</Text>
          </View>
          
          <View className="flex-row justify-center w-full">
            <TouchableOpacity 
              className="items-center px-5"
              onPress={() => navigation.navigate('Followers')}
            >
              <Text className="text-lg font-bold text-gray-800">{user.followers || 0}</Text>
              <Text className="text-sm text-gray-600">Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="items-center px-5"
              onPress={() => navigation.navigate('Following')}
            >
              <Text className="text-lg font-bold text-gray-800">{user.following || 0}</Text>
              <Text className="text-sm text-gray-600">Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 py-2.5 items-center ${activeTab === 'Reviews' ? 'border-b-3 border-blue-600' : ''}`}
            onPress={() => setActiveTab('Reviews')}
          >
            <Text className={`text-base font-medium ${activeTab === 'Reviews' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              Reviews
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2.5 items-center ${activeTab === 'Photos' ? 'border-b-3 border-blue-600' : ''}`}
            onPress={() => setActiveTab('Photos')}
          >
            <Text className={`text-base font-medium ${activeTab === 'Photos' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              Photos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2.5 items-center ${activeTab === 'Blog' ? 'border-b-3 border-blue-600' : ''}`}
            onPress={() => setActiveTab('Blog')}
          >
            <Text className={`text-base font-medium ${activeTab === 'Blog' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              Blog
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1">
          {renderContent()}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default ActivityPage;