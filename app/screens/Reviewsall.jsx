import { Fragment, useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, Modal, Image, ActivityIndicator, Alert } from "react-native";
import ZomatoStyles from "../../styles/zomatostyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RatingsCalculated from "../../components/calculated";
import Preference from "../../components/preference";
import Review from "../../components/review";
import Entypo from '@expo/vector-icons/Entypo';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Reviewsall() {
  const [calculatedboxvisible, setcalculatedboxvisible] = useState(false);
  const [perfervisible, setprefervisible] = useState(false);
  const [commentvisible, setcommentvisible] = useState(false);
  const [pref, setpref] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [selectedComment, setSelectedComment] = useState(null);
  const [recivecommentno, setrecivecommentno] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedReviewType, setSelectedReviewType] = useState('');

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
  const { user, profileData } = useAuth();
  const currentUserData = profileData?.email ? profileData : (user ? { username: user } : null);
  console.log('id', firmId)
  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.0.100:3000/api/reviews`, {
        params: { firm: firmId, page: pageNum },
        withCredentials: true
      });

      if (response.data?.reviews) {
        setTotalReviews(response.data.total);
        setHasMore(pageNum * 10 < response.data.total);
        console.log('review', response.data)
        const transformedData = response.data.reviews.map(review => ({
          _id: review._id,
          user: {
            username: review.authorName?.username ||
              (review.email ? review.email.split('@')[0] : "Anonymous"),
            followers: 0
          },
          comment: review.reviewText,
          rating: review.rating,
          createdAt: review.date || review.createdAt,
          verified: true,
          images: [],
          detailedReview: review.reviewText.length > 100,
          likes: review.likes,
          commentsCount: review.comments?.length || 0,
          likedBy: review.likedBy || [],
          isLiked: review.likedBy?.includes(profileData?.email || user?.username) || false
        }));

        if (pageNum === 1) {
          setData(transformedData);
          setFilteredData(transformedData);
          setSortedData(transformedData);

          const initialLikes = {};
          transformedData.forEach(review => {
            initialLikes[review._id] = review.isLiked;
          });
          setLikes(initialLikes);
        } else {
          setData(prev => [...prev, ...transformedData]);
          setFilteredData(prev => [...prev, ...transformedData]);
          setSortedData(prev => [...prev, ...transformedData]);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firmId) {
      fetchReviews();
    }
  }, [firmId]);

  useEffect(() => {
    applyFilters(filtersActive);
  }, [filtersActive, data]);

  useEffect(() => {
    handleSorting();
  }, [sortActive, filteredData]);

  const handleSorting = () => {
    let sortedArray = [...filteredData];

    if (sortActive.rating) {
      sortedArray.sort((a, b) => b.rating - a.rating);
    } else if (sortActive.date) {
      sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedData(sortedArray);
  };

  const applyFilters = (activeFilters) => {
    const filtered = data.filter(item => {
      if (activeFilters.verified && !item.verified) return false;
      if (activeFilters.withPhotos && (!item.images || item.images.length === 0)) return false;
      if (activeFilters.detailedReview && !item.detailedReview) return false;
      return true;
    });

    setFilteredData(filtered);
  };

  const handleActive = (filter) => {
    setFiltersActive(prev => {
      const updatedFilters = { ...prev, [filter]: !prev[filter] };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const handlechildpref = (childdata) => {
    setpref(childdata);
    if (childdata === "High Rating") {
      setSortActive(prev => ({ ...prev, rating: true, date: false }));
    } else if (childdata === "Latest") {
      setSortActive(prev => ({ ...prev, rating: false, date: true }));
    }
  };

  const handlecommentcount = (childData) => {
    setrecivecommentno((prev) => ({
      ...prev,
      [selectedComment._id]: childData,
    }));
  };

  const handleLikeReview = async (reviewId) => {
    try {
      if (!user) {
        Alert.alert(
          "Login Required",
          "You need to login to like reviews",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push('/auth/LoginScreen') }
          ]
        );
        return;
      }

      const userIdentifier = profileData?.email || user?.username;
      const response = await axios.post(
        `http://192.168.0.102:3000/api/reviews/${reviewId}/like`,
        { email: userIdentifier },
        { withCredentials: true }
      );
      console.log("like posted", reviewId)
      setData(prev => prev.map(review =>
        review._id === reviewId ? {
          ...review,
          likes: response.data.likes,
          likedBy: response.data.likedBy,
          isLiked: response.data.likedBy.includes(userIdentifier)
        } : review
      ));
      setLikes(prev => ({
        ...prev,
        [reviewId]: response.data.likedBy.includes(userIdentifier)
      }));

    } catch (error) {
      console.error('Error liking review:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to like review',
        [{ text: "OK" }]
      );
    }
  };
  const handleAddComment = async (reviewId, newComment) => {
    try {
      if (!user) {
        Alert.alert(
          "Login Required",
          "You need to login to add comments",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push('/auth/LoginScreen') }
          ]
        );
        return false;
      }

      const response = await axios.post(
        `http://192.168.0.102:3000/api/reviews/${reviewId}/comments`,
        { comment: newComment },
        { withCredentials: true }
      );
      console.log("comment posted", newComment)
      // Update all state arrays consistently
      const updateState = (prev) => prev.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            comments: [...(review.comments || []), response.data.comment],
            commentsCount: (review.commentsCount || 0) + 1
          };
        }
        return review;
      });

      setData(updateState);
      setFilteredData(updateState);
      setSortedData(updateState);

      setrecivecommentno(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1
      }));

      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add comment');
      return false;
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
    return `${diffDays} days ago`;
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
      fetchReviews(page + 1);
    }
  };

  const togglevisible = () => {
    setcalculatedboxvisible(!calculatedboxvisible);
  };

  const togglepref = () => {
    setprefervisible(!perfervisible);
  };

  const togglecomment = (comment = null) => {
    setSelectedComment(comment);
    setcommentvisible(!commentvisible);
  };
  const filters = ["verified", "withPhotos", "detailedReview"];

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

        <View style={ZomatoStyles.TotalRatingContainer}>
          <View style={ZomatoStyles.ratingStartcontainer}>
            <View style={ZomatoStyles.RatingsContainer}>
              <Text style={ZomatoStyles.RatingText}>{params.averageRating || "4.5"}</Text>
              <AntDesign name="star" size={11} color="white" style={ZomatoStyles.RatingImg} />
            </View>
            <Text style={ZomatoStyles.TotalText}>{params.reviewCount || "0"} RATED</Text>
          </View>

          <TouchableOpacity onPress={togglevisible}>
            <Text style={ZomatoStyles.TotalText2}>How are ratings calculated? <AntDesign name="caretright" size={10} color="black" /></Text>
          </TouchableOpacity>

          <Modal animationType="slide" transparent={true} visible={calculatedboxvisible} onRequestClose={togglevisible}>
            <RatingsCalculated toggle={togglevisible} />
          </Modal>
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
          <TouchableOpacity style={ZomatoStyles.RevanceActive} onPress={togglepref}>
            <Text style={ZomatoStyles.RelevanceText}>{pref || "Relevance"}</Text>
            <MaterialIcons name="arrow-drop-down" size={22} color="black" style={ZomatoStyles.DropImg} />
          </TouchableOpacity>
          <Modal animationType="slide" transparent={true} visible={perfervisible} onRequestClose={togglepref}>
            <Preference togglepref={togglepref} senddatatoparent={handlechildpref} message={pref} />
          </Modal>

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
                    <Text style={ZomatoStyles.RelevanceText}>{item}</Text>
                    {filtersActive[item] && <Entypo name="cross" size={20} color="black" style={ZomatoStyles.DropImg} />}
                  </View>
                </TouchableOpacity>
              </View>
            )}
            horizontal={true}
          />
        </View>
      </View>

      <FlatList
        data={sortActive.rating || sortActive.date ? sortedData : filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <View style={ZomatoStyles.commentcontainer}>
              <View style={ZomatoStyles.commentheadingcontainer}>
                <View style={ZomatoStyles.ratingStartcontainer}>
                  <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
                  <View style={ZomatoStyles.commentnamecontainer}>
                    <Text style={ZomatoStyles.commentName}>{item.user?.username || "Anonymous"}</Text>
                    {/* {item.user?.followers ? (
                      <Text style={ZomatoStyles.commentfollowers}>{item.user.followers} Followers</Text>
                    ) : null} */}
                    <Text style={ZomatoStyles.commentfollowers}>{item.user.followers} Followers</Text>
                  </View>
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
              {item.images && item.images.length > 0 && (
                <View style={ZomatoStyles.commentimgContainer}>
                  <Image source={{ uri: item.images[0] }} style={ZomatoStyles.commentimg} />
                </View>
              )}
              <View style={ZomatoStyles.LikeCommentCalculateContainer}>
                <Text style={ZomatoStyles.commentText2}>{getDaysAgo(item.createdAt)}</Text>
                <Text style={ZomatoStyles.commentText2}>
                  {item.likes || 0} helpful votes
                  {recivecommentno[item._id] ? `, ${recivecommentno[item._id]} comments` : `, ${item.commentsCount || 0} comments`}
                </Text>
              </View>
            </View>
            <View style={ZomatoStyles.commenttabscontainer}>
              <TouchableOpacity
                onPress={() => handleLikeReview(item._id)}
                style={ZomatoStyles.commenttabbox}
              >
                <AntDesign
                  name={item.isLiked ? "like1" : "like2"}
                  size={20}
                  color={item.isLiked ? "black" : "black"}
                />
                <Text style={ZomatoStyles.commenttabtext}>Helpful</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => togglecomment(item)}
                style={ZomatoStyles.commenttabbox}
              >
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={20}
                  color="black"
                  style={ZomatoStyles.likeimage}
                />
                <Text style={ZomatoStyles.commenttabtext}>Comment</Text>
              </TouchableOpacity>
              <Modal animationType="slide" visible={commentvisible} onRequestClose={() => togglecomment(null)}>
                {selectedComment && (
                  <Review
                    data={{
                      authorName: selectedComment.user?.username,
                      email: selectedComment.user?.email,
                      date: selectedComment.createdAt,
                      days: getDaysAgo(selectedComment.createdAt),
                      rating: selectedComment.rating,
                      comments: selectedComment.comments,
                      likes: selectedComment.likes,
                      reviewType: selectedReviewType,
                      _id: selectedComment._id,
                      reviewText: selectedComment.comment,
                      isLiked: selectedComment.isLiked
                    }}
                    onLike={() => handleLikeReview(selectedComment._id)}
                    onComment={(comment) => handleAddComment(selectedComment._id, comment)}
                  />
                )}
              </Modal>

              <View style={ZomatoStyles.commenttabbox}>
                <Fontisto name="share" size={20} color="black" style={ZomatoStyles.likeimage} />
                <Text style={ZomatoStyles.commenttabtext}>Share</Text>
              </View>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading && page > 1 ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        )}
      />

      <TouchableOpacity
        style={ZomatoStyles.commentButton}
        onPress={() => router.push({
          pathname: "/screens/Userrating",
          params: {
            firmId: firmId,
            reviewType: selectedReviewType,
            restaurantName: params.restaurantName,
            currentUser: currentUserData
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