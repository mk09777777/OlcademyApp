import { Fragment, useEffect, useState } from "react";
import { 
  FlatList, Text, TextInput, TouchableOpacity, View, Modal, Image, 
  ActivityIndicator, Alert, RefreshControl, ScrollView 
} from "react-native";
import ZomatoStyles from "../../styles/zomatostyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RatingsCalculated from "../../components/calculated";
import Preference from "../../components/preference";
import Entypo from '@expo/vector-icons/Entypo';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from '../../config/apiConfig';

export default function Reviewsall() {
  const [calculatedboxvisible, setcalculatedboxvisible] = useState(false);
  const [perfervisible, setprefervisible] = useState(false);
  const [commentvisible, setcommentvisible] = useState(false);
  const [pref, setpref] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);
  
  // New states for comment functionality
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [reviewStatus, setReviewStatus] = useState({
    isFollowing: false,
    isLiked: false,
    followers: 0,
    likes: 0
  });

  const [filtersActive, setFiltersActive] = useState({
    verified: false,
    withPhotos: false,
    detailedReview: false
  });

  const [sortActive, setSortActive] = useState({
    rating: false,
    date: false,
  });

  const params = useLocalSearchParams();
  const firmId = params.firmId || params.firm || params.id;
  const reviewType= params.reviewType;

  console.log('id',firmId)
  const { user, profileData, api } = useAuth();
  const currentUserData = profileData?.email ? profileData : (user ? { username: user } : null);
  const userId = profileData?._id || user?.id;

  useEffect(() => {
    const fetchReviews = async (pageNum = 1, isRefreshing = false) => {
      try {
        if (pageNum === 1) setLoading(true);

        let restaurantReviews = [];
        let tiffinReviews = [];

        // Fetch restaurant reviews
        try {
          const restaurantResponse = await axios.get(

            `${API_CONFIG.BACKEND_URL}/firm/restaurants/get-reviews/${firmId}`,
            { params: { page: pageNum }, withCredentials: true }
          );
          
          if (restaurantResponse.data && Array.isArray(restaurantResponse.data.reviews)) {
            restaurantReviews = restaurantResponse.data.reviews;
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
            console.log("No restaurant reviews found");
          } else {
            console.error("Error fetching restaurant reviews:", err);
          }
        }

        // Fetch tiffin reviews
        try {
          const tiffinResponse = await axios.get(
            `${API_CONFIG.BACKEND_URL}/api/tiffin-Reviews/${firmId}`,
            { params: { page: pageNum }, withCredentials: true }
          );
          
          if (tiffinResponse.data && Array.isArray(tiffinResponse.data.reviews)) {
            tiffinReviews = tiffinResponse.data.reviews;
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
            console.log("No tiffin reviews found");
          } else {
            console.error("Error fetching tiffin reviews:", err);
          }
        }

        // Combine and transform the reviews
        const allReviews = [...restaurantReviews, ...tiffinReviews];
        
        if (allReviews.length > 0) {
          const transformedData = allReviews.map(review => ({
            _id: review._id,
            user: {
              username: review.author_name || review.authorName?.username || 
                       (review.email ? review.email.split('@')[0] : "Anonymous"),
              followers: review.followers || (review.followBy ? review.followBy.length : 0),
              userId: review.authorId || review.userId || review.authorName?._id
            },
            comment: review.comments||[],
            reviewType: review.reviewType,
            rating: review.rating,
            createdAt: review.date || review.createdAt,
            verified: review.verified || true,
            images: review.images || [],
            detailedReview: (review.reviewText || review.comment)?.length > 100,
            likes: review.likes || (review.likedBy ? review.likedBy.length : 0),
            commentsCount: review.comments?.length || review.usercomments?.length || 0,
            likedBy: review.likedBy || [],
            usercomments: review.usercomments || [],
            isLiked: review.likedBy?.includes(profileData?.email || user?.username) || false,
            isFollowing: review.isFollowing || false
          }));

          if (pageNum === 1 || isRefreshing) {
            setData(transformedData);
            setHasMore(false);
          } else {
            setData(prev => [...prev, ...transformedData]);
          }
        } else {
          if (pageNum === 1 || isRefreshing) {
            setData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.response?.data?.error || error.message);
        Alert.alert("Error", "Failed to load reviews");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    if (firmId) {
      fetchReviews();
    }
  }, [firmId]);

  useEffect(() => {
    applyFilters();
  }, [filtersActive, data]);

  useEffect(() => {
    handleSorting();
  }, [sortActive, filteredData]);

  // Fetch review status and comments when a review is selected for comments
  useEffect(() => {
    if (selectedComment) {
      fetchReviewStatus(selectedComment._id, selectedComment.reviewType,);
      // Set the comments for the selected review
  setComments(selectedComment.comment)
      setCommentList(selectedComment.usercomments || []);
    }
  }, [selectedComment]);

  const fetchReviewStatus = async (reviewId, reviewType) => {
    try {
      if (!reviewId) return;
      
      // const endpoint = reviewType === 'tiffin' 
      //   ? `/api/reviews/tiffin/${reviewId}/status` 
      //   : `/api/reviews/${reviewId}/status`;
      
      const response = await api.get(`/api/reviews/${reviewId}/status`, {
          withCredentials: true,
        });
      const { isFollow, isLike, followers, likes } = response.data.data;
      console.log('like',response.data)
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
  
  const applyFilters = () => {
    const filtered = data.filter(item => {
      if (filtersActive.verified && !item.verified) return false;
      if (filtersActive.withPhotos && item.images.length === 0) return false;
      if (filtersActive.detailedReview && !item.detailedReview) return false;
      return true;
    });
    setFilteredData(filtered);
  };

  const handleSorting = () => {
    let sortedArray = [...filteredData];
    if (sortActive.rating) {
      sortedArray.sort((a, b) => b.rating - a.rating);
    } else if (sortActive.date) {
      sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setSortedData(sortedArray);
  };

  const handleActive = (filter) => {
    setFiltersActive(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handlechildpref = (childdata) => {
    setpref(childdata);
    if (childdata === "High Rating") {
      setSortActive({ rating: true, date: false });
    } else if (childdata === "Latest") {
      setSortActive({ rating: false, date: true });
    } else {
      setSortActive({ rating: false, date: false });
    }
  };

  const handleLike = async (reviewId, reviewType) => {
    try {
       const endpoint = reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${reviewId}/like` 
        : `/api/reviews/${reviewId}/like`;
      const response = await api.post(endpoint, {}, { withCredentials: true });
      
      setData(prevData => 
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
      
      setData(prevData => 
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

  const getDaysAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} min ago`;
      }
      return `${diffHours} hours ago`;
    }

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      // You'll need to implement fetchReviews with pagination
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    // You'll need to implement fetchReviews with refresh
  };

  const togglevisible = () => setcalculatedboxvisible(!calculatedboxvisible);
  const togglepref = () => setprefervisible(!perfervisible);
  const togglecomment = (comment = null) => {
    setSelectedComment(comment);
    setcommentvisible(!commentvisible);
    if (!commentvisible) {
      setComment("");
      setReplyMap({});
    }
  };

  const filters = ["verified", "withPhotos"];

  if (loading && page === 1) {
    return (
      <View style={ZomatoStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={ZomatoStyles.errorContainer}>
        <Text style={ZomatoStyles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()} style={ZomatoStyles.retryButton}>
          <Text style={ZomatoStyles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Fragment>
      <View style={ZomatoStyles.background}>
        <View style={ZomatoStyles.headercontainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={32} color="black" style={ZomatoStyles.headingImg} />
          </TouchableOpacity>
          <Text style={ZomatoStyles.HeadingText}>{params.restaurantName || "Reviews"}</Text>
          <MaterialCommunityIcons name="share-outline" size={32} color="black" style={ZomatoStyles.headingImg2} />
        </View>

        

        <View style={ZomatoStyles.SearchContainer}>
          <AntDesign name="search1" size={24} color="#E91E63" style={ZomatoStyles.searchImg} />
          <View style={ZomatoStyles.SearchInput}>
            <TextInput
              style={ZomatoStyles.SearchInput}
              placeholder="Search in reviews"
              placeholderTextColor={"#6b7280ef"}
            />
          </View>
        </View>

        <View style={ZomatoStyles.filters}>
          <FlatList
            data={filters}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={ZomatoStyles.otherfilters}>
                <TouchableOpacity onPress={() => handleActive(item)}>
                  <View style={[
                    ZomatoStyles.verified,
                    filtersActive[item] && ZomatoStyles.VerifiedActive
                  ]}>
                    
                    <Text style={ZomatoStyles.RelevanceText}>
                      <MaterialIcons name={item === "verified" ? "verified" : "photo"} size={16} color="black" />
                      {"  "}{item === "verified" ? "Verified" : "With Photos"}
                    </Text>
                    {filtersActive[item] && <Entypo name="cross" size={20} color="black" style={ZomatoStyles.DropImg} />}
                  </View>
                </TouchableOpacity>
              </View>
            )}
            horizontal={true}
          />
          
          <TouchableOpacity style={ZomatoStyles.RevanceActive} onPress={togglepref}>
            <Text style={ZomatoStyles.RelevanceText}>{pref || "Relevance"}</Text>
            <MaterialIcons name="arrow-drop-down" size={22} color="black" style={ZomatoStyles.DropImg} />
          </TouchableOpacity>
          <Modal animationType="slide" transparent={true} visible={perfervisible} onRequestClose={togglepref}>
            <Preference togglepref={togglepref} senddatatoparent={handlechildpref} message={pref} />
          </Modal>
        </View>
      </View>

      <FlatList
        data={sortActive.rating || sortActive.date ? sortedData : filteredData}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={ZomatoStyles.emptyContainer}>
            <Text style={ZomatoStyles.emptyText}>No reviews found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={ZomatoStyles.commentMainContainer}>
            <View style={ZomatoStyles.commentcontainer}>
              <View style={ZomatoStyles.commentheadingcontainer}>
                <View style={ZomatoStyles.ratingStartcontainer}>
                  <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
                  <View style={ZomatoStyles.commentnamecontainer}>
                    <Text style={ZomatoStyles.commentName}>{item.user?.username || "Anonymous"}</Text>
                    <Text style={ZomatoStyles.commentfollowers}>{item.user.followers} Followers • {getDaysAgo(item.createdAt)}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleFollow(item._id, item.reviewType)}
                    style={[ZomatoStyles.followButton, item.isFollowing && ZomatoStyles.followingButton]}
                  >
                    {/* <Text style={[ZomatoStyles.followButtonText, item.isFollowing && ZomatoStyles.followingButtonText]}>
                      {item.isFollowing : "Following" : "Follow"}
                    </Text> */}
                  </TouchableOpacity>
                </View>
                <View style={ZomatoStyles.commentRatingcontainer}>
                  <View style={ZomatoStyles.RatingsContainer2}>
                    <Text style={ZomatoStyles.RatingText}>{item.rating}</Text>
                    <AntDesign name="star" size={11} color="white" style={ZomatoStyles.RatingImg} />
                  </View>
                  <View style={ZomatoStyles.commentverifiedtextcontainer}>
                    {item.verified && (
                      <>
                        <MaterialIcons name="verified" size={10} color="#6b7280ef" style={ZomatoStyles.verifiedimg} />
                        <Text style={ZomatoStyles.commentverified}>Verified order</Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <Text style={ZomatoStyles.commentText}>{item.comment}</Text>
              {/* {item.images && item.images.length > 0 && (
                <View style={ZomatoStyles.commentimgContainer}>
                  <Image source={{ uri: item.images[0] }} style={ZomatoStyles.commentimg} />
                </View>
              )} */}
              
            </View>
            <View style={ZomatoStyles.commenttabscontainer}>
              <TouchableOpacity
                onPress={() => handleLike(item._id, item.reviewType)}
                style={ZomatoStyles.commenttabbox}
              >
                <AntDesign
                  name={item.isLiked ? "like1" : "like2"}
                  size={20}
                  color={item.isLiked ? "#E91E63" : "black"}
                />
                <Text style={[ZomatoStyles.commenttabtext, item.isLiked && {color: "#E91E63"}]}>{item.likes || 0}  </Text>
              </TouchableOpacity>
             <TouchableOpacity
  onPress={() => {
    setSelectedComment(item);
    router.push({
      pathname: '/screens/commentscreen',
      params: {
        commentData: JSON.stringify(item),
        review:item._id,
        firmId: firmId,
        restaurantName: params.restaurantName,
        reviewType:reviewType,
      }
    });
  }}
  style={ZomatoStyles.commenttabbox}
>
  <MaterialCommunityIcons
    name="comment-text-outline"
    size={20}
    color="black"
    style={ZomatoStyles.likeimage}
  />
  <Text style={ZomatoStyles.commenttabtext}> Comment</Text>
</TouchableOpacity>
              <TouchableOpacity style={ZomatoStyles.commenttabbox}>
                <Fontisto name="share" size={20} color="black" style={ZomatoStyles.likeimage} />
                <Text style={ZomatoStyles.commenttabtext}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading && page > 1 ? (
            <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 20 }} />
          ) : null
        )}
      />
      <TouchableOpacity
        style={ZomatoStyles.commentButton}
        onPress={() => router.push({
          pathname: "/screens/Userrating",
          params: {
            firmId: firmId,
            restaurantName: params.restaurantName,
            currentUser: currentUserData,
            reviewType:reviewType,
          }
        })}
        activeOpacity={0.9}
      >
        <View style={ZomatoStyles.commentButtonContent}>
          <MaterialIcons name="rate-review" size={20} color="#FFF" />
          <Text style={ZomatoStyles.commentButtonText}>Write a Review</Text>
        </View>
      </TouchableOpacity>
    </Fragment>
  );
}