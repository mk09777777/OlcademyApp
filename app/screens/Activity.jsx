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
import styles from '../../styles/Activity';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

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
  const fetchUserActivity = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!authUser?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching reviews for user:', authUser.id);
      const reviewsResponse = await axios.get(
        `http://192.168.0.101:3000/api/reviews/user/${authUser.id}`
      );

      console.log('Reviews API Response:', {
        status: reviewsResponse.status,
        data: reviewsResponse.data,
        config: reviewsResponse.config
      });

      const reviews = reviewsResponse.data?.reviews;
      if (!Array.isArray(reviews)) {
        throw new Error('Invalid reviews data format');
      }

      const reviewsWithLikeStatus = reviews
        .map((review) => {
          if (!review) return null;

          return {
            imgSrc:
              review.firm?.restaurantInfo?.imageUrl ||
              require('../../assets/images/food.jpg'),
            title: review.firm?.restaurantInfo?.name || 'General Review',
            address: review.firm?.restaurantInfo?.address || '',
            rating: review.rating || 0,
            reviewText: review.reviewText || '',
            reviewType: review.reviewType || 'N/A',
            likes: review.likes || 0,
            date: review.createdAt || new Date(),
            comments: review.comments || [],
            _id: review._id || Math.random().toString(),
            authorName:
              typeof review.authorName === 'object'
                ? review.authorName?.username || 'User'
                : review.authorName || 'User',
            isLiked: Array.isArray(review.likedBy)
              ? review.likedBy.includes(authUser.email)
              : false,
            likedBy: Array.isArray(review.likedBy) ? review.likedBy : []
          };
        })
        .filter(Boolean);

      setReviews(reviewsWithLikeStatus);

      // Sample mock data for photos and blogs
      setPhotos([
        { _id: '1', imageUrl: require('../../assets/images/food.jpg') },
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


  const handleLikeReview = async (reviewId) => {
    try {
      if (!authUser?.email) {
        throw new Error('User email not available');
      }

      const response = await api.post(`/reviews/${reviewId}/like`, { 
        email: authUser.email 
      });

      const updatedReviews = reviews.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            likes: response.data.likes || review.likes,
            likedBy: response.data.likedBy || review.likedBy,
            isLiked: Array.isArray(response.data.likedBy) 
              ? response.data.likedBy.includes(authUser.email) 
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
            `/reviews/${reviewId}/comments`,
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
            onPress={() => handleComment(item._id)}
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
    // <TouchableOpacity style={styles.photoItem}>
    //   <Image 
    //     source={ item.imageUrl } 
    //     style={styles.photoImage} 
    //     onError={() => console.log('Photo load failed')}
    //   />
    // </TouchableOpacity>
      //  if (!item) return null;
    
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
     source={ item.imageUrl } 
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
            onPress={() => handleComment(item._id)}
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
  }
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
                {/* <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={() => navigation.navigate('AddReview')}
                >
                  <Text style={styles.emptyActionText}>Write your first review</Text>
                </TouchableOpacity> */}
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
    <View style={styles.container}>
      <ScrollView>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Activity</Text>
        <View style={styles.headerRight} />
      </View> */}
          <View style={styles.profileHeader}>
            <View style={styles.headerBackground}>
              <Image source={require('../../assets/images/food2.jpg')} style={styles.headerImage} />
            </View>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        {renderAvatar()}
        <Text style={styles.username}>{user.username || 'User'}</Text>
         </View>
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Followers')}
          >
            <Text style={styles.statNumber}>{user.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Following')}
          >
            <Text style={styles.statNumber}>{user.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Reviews' && styles.activeTab]}
          onPress={() => setActiveTab('Reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Photos' && styles.activeTab]}
          onPress={() => setActiveTab('Photos')}
        >
          <Text style={[styles.tabText, activeTab === 'Photos' && styles.activeTabText]}>
            Photos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Blog' && styles.activeTab]}
          onPress={() => setActiveTab('Blog')}
        >
          <Text style={[styles.tabText, activeTab === 'Blog' && styles.activeTabText]}>
            Blog
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.mainContent}>
        {renderContent()}
      </ScrollView>
    </ScrollView>
    </View>
  );
};

export default ActivityPage;