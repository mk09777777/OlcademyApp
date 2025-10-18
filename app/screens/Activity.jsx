import React, { useState, useEffect } from 'react'; 
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
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

        console.log('Fetching reviews for user profile');
        const reviewsResponse = await api.get('/api/reviews/user/profile');
        
        console.log('Reviews API Response:', {
          status: reviewsResponse.status,
          data: reviewsResponse.data,
          config: reviewsResponse.config
        });

        const reviewsData = Array.isArray(reviewsResponse.data) 
          ? reviewsResponse.data 
          : reviewsResponse.data?.reviews || [];
          
        console.log('Processed reviews data:', JSON.stringify(reviewsData));

        if (!Array.isArray(reviewsData)) {
          throw new Error('Invalid reviews data format');
        }

        const reviewsWithLikeStatus = reviewsData.map(review => {
          if (!review) return null;
          
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
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={24} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>
              {item.title || 'Untitled Review'}
            </Text>
            {item.address && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                <Text style={styles.placeLocation} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.rating}>
              {item.rating ? `${item.rating}` : 'N/A'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.reviewText} numberOfLines={3}>
          {item.reviewText || 'No review text available'}
        </Text>
        <Text style={styles.dateText}>
          {item.date ? new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) : 'Unknown date'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeReview(item._id)}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome 
                name={item.isLiked ? "heart" : "heart-o"} 
                size={18} 
                color={item.isLiked ? "#FF3B30" : "#6B7280"} 
              />
              <Text style={[
                styles.actionButtonText, 
                item.isLiked && styles.actionButtonTextActive
              ]}>
                {item.likes || 0}
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
                }
              });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome name="comment-o" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>
                {(item.comments || []).length}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="share-outline" size={20} color="#6B7280" />
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
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={24} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>
              {item.title || 'Untitled Review'}
            </Text>
            {item.address && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                <Text style={styles.placeLocation} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
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
          {item.date ? new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }) : 'Unknown date'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeReview(item._id)}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome 
                name={item.isLiked ? "heart" : "heart-o"} 
                size={18} 
                color={item.isLiked ? "#FF3B30" : "#6B7280"} 
              />
              <Text style={[
                styles.actionButtonText, 
                item.isLiked && styles.actionButtonTextActive
              ]}>
                {item.likes || 0}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <FontAwesome name="comment-o" size={18} color="#6B7280" />
              <Text style={styles.actionButtonText}>
                {(item.comments || []).length}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="share-outline" size={20} color="#6B7280" />
              <Text style={styles.actionButtonText}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBlogItem = ({ item }) => (
    <View style={styles.blogCard}>
      <View style={styles.blogHeader}>
        <View style={styles.blogIconContainer}>
          <Ionicons name="document-text-outline" size={20} color="#1A73E8" />
        </View>
        <View style={styles.blogHeaderText}>
          <Text style={styles.blogTitle} numberOfLines={2}>
            {item.title || 'Untitled Blog'}
          </Text>
          <Text style={styles.blogDate}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }) : 'Unknown date'}
          </Text>
        </View>
      </View>
      <Text style={styles.blogExcerpt} numberOfLines={3}>
        {item.content || 'No content available'}
      </Text>
      <TouchableOpacity style={styles.readMoreButton} activeOpacity={0.7}>
        <Text style={styles.readMoreText}>Read More</Text>
        <Ionicons name="arrow-forward" size={16} color="#1A73E8" />
      </TouchableOpacity>
    </View>
  );

  const renderAvatar = () => {
    if (user.avatar) {
      return (
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatarImage} 
            onError={() => console.log('Avatar load failed')}
          />
        </View>
      );
    }
    return (
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
            activeOpacity={0.8}
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
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A73E8" />
                <Text style={styles.loadingText}>Loading reviews...</Text>
              </View>
            ) : reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No reviews to display</Text>
                }
              />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                <Text style={styles.emptySubtitle}>Start sharing your experiences with the community</Text>
              </View>
            )}
          </View>
        );
      case 'Photos':
        return (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A73E8" />
                <Text style={styles.loadingText}>Loading photos...</Text>
              </View>
            ) : photos.length > 0 ? (
              <FlatList
                key={`photos-${activeTab}`} 
                data={photos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                numColumns={1}
                contentContainerStyle={styles.photoGrid}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="images-outline" size={64} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>No Photos Yet</Text>
                <Text style={styles.emptySubtitle}>Capture and share your favorite moments</Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleAddPhoto}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.emptyActionText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'Blog':
        return (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A73E8" />
                <Text style={styles.loadingText}>Loading blogs...</Text>
              </View>
            ) : blogs.length > 0 ? (
              <FlatList
                data={blogs}
                renderItem={renderBlogItem}
                keyExtractor={(item) => item._id || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="book-outline" size={64} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>No Blogs Yet</Text>
                <Text style={styles.emptySubtitle}>Share your stories and insights</Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleWriteBlog}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={20} color="#FFF" />
                  <Text style={styles.emptyActionText}>Write Blog</Text>
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
    <View style={styles.container}>
      <BackRouting tittle="Activity" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerWrapper}>
          <Image
            source={require('../../assets/images/food2.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
        </View>

        <View style={styles.profileSection}>
          {renderAvatar()}
          <Text style={styles.usernameText}>{user.username || 'User'}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#02757A" />
            <Text style={styles.verifiedText}>Active User</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Followers')}
            activeOpacity={0.7}
          >
            <Text style={styles.statValue}>{user.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Following')}
            activeOpacity={0.7}
          >
            <Text style={styles.statValue}>{user.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Reviews' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Reviews')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={activeTab === 'Reviews' ? "chatbubbles" : "chatbubbles-outline"} 
              size={18} 
              color={activeTab === 'Reviews' ? "#02757A" : "#02757A"} 
            />
            <Text style={[styles.tabLabel, activeTab === 'Reviews' && styles.tabLabelActive]}>
              Reviews
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Photos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Photos')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={activeTab === 'Photos' ? "images" : "images-outline"} 
              size={18} 
              color={activeTab === 'Photos' ? "#02757A" : "#02757A"} 
            />
            <Text style={[styles.tabLabel, activeTab === 'Photos' && styles.tabLabelActive]}>
              Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Blog' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Blog')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={activeTab === 'Blog' ? "book" : "book-outline"} 
              size={18} 
              color={activeTab === 'Blog' ? "#02757A" : "#02757A"} 
            />
            <Text style={[styles.tabLabel, activeTab === 'Blog' && styles.tabLabelActive]}>
              Blog
            </Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  bannerWrapper: {
    width: '92%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
  },
  avatarWrapper: {
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    borderRadius: 60,
    marginBottom: 12,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9e9e9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#02757A',
    fontWeight: '600',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 80,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#02757A',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#02757A',
    marginTop: 4,
    fontWeight: '500',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#d9e9e9ff',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#02757A',
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeInfo: {
    flex: 1,
    marginRight: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeLocation: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  reviewText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  photoItem: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E5E7EB',
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  blogHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  blogIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  blogHeaderText: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 14,
    lineHeight: 21,
  },
  blogDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '600',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#1A73E8',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  contentContainer: {
    marginTop: 16,
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyActionButton: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#1A73E8',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  emptyActionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  photoGrid: {
    paddingBottom: 24,
  },
});

export default ActivityPage;