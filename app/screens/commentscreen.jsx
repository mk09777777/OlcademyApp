import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CommentsScreen = () => {
  const params = useLocalSearchParams();
  const firmId = params.firmId || params.firm || params.id;
  const reviewID=params.review;
  const reviewTypew=params.reviewType
  console.log(reviewID)
  const commentData = params.commentData ? JSON.parse(params.commentData) : null;
  console.log(commentData)
  // Initialize selectedComment directly since it's already a review object
  const [selectedComment, setSelectedComment] = useState(commentData || {});
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [reviewStatus, setReviewStatus] = useState({
    isFollowing: false,
    isLiked: false,
    followers: 0,
    likes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, profileData, api } = useAuth();
 const userId = profileData?._id || user?.id;
 console.log('userid',userId)
  useEffect(() => {
    if (selectedComment && selectedComment._id) {
      fetchReviewStatus();
      fetchComments();
    } else {
      setIsLoading(false);
    }
  }, [selectedComment]);

  const fetchReviewStatus = async () => {
    try {
      if (!selectedComment?._id) {
        setIsLoading(false);
        return;
      }
      
      const response = await api.get(`/api/reviews/${selectedComment._id}/status`, {
        withCredentials: true,
      });
      
      // Handle different response structures
      let statusData = response.data;
      if (response.data && response.data.data) {
        statusData = response.data.data;
      }
      
      const { isFollow, isLike, followers, likes } = statusData;
      setReviewStatus({
        isFollowing: isFollow || false,
        isLiked: isLike || false,
        followers: followers || 0,
        likes: likes || 0
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching review status:", error);
      // Use data from the comment object if API fails
      setReviewStatus({
        isFollowing: selectedComment.isFollowing || false,
        isLiked: selectedComment.isLiked || false,
        followers: selectedComment.followers || 0,
        likes: selectedComment.likes || 0
      });
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    const comments = selectedComment.usercomments || [];
    // Filter out any null or undefined comments
    const filteredComments = comments.filter(comment => comment && typeof comment === 'object');
    setCommentList(filteredComments);
  };

  const handleLike = async () => {
    try {
      if (!selectedComment?._id) return;
      
      const endpoint = selectedComment.reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${selectedComment._id}/like`
        : `/api/reviews/${selectedComment._id}/like`;
      
      const response = await api.post(endpoint, {}, { withCredentials: true });
      
      setReviewStatus(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: response.data.likes || prev.likes + (prev.isLiked ? -1 : 1)
      }));
    } catch (error) {
      console.error("Error liking review:", error);
      Alert.alert("Error", "Failed to like review");
    }
  };

  const handleFollow = async () => {
    try {
      if (!selectedComment?._id) return;
      
      const endpoint = selectedComment.reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${selectedComment._id}/follow`
        : `/api/reviews/${selectedComment._id}/follow`;
      
      const response = await api.post(endpoint, {}, { withCredentials: true });
      
      setReviewStatus(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: response.data.followers || prev.followers + (prev.isFollowing ? -1 : 1)
      }));
    } catch (error) {
      console.error("Error following user:", error);
      Alert.alert("Error", "Failed to follow user");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !selectedComment?._id) return;
    
    try {
      const endpoint = selectedComment.reviewType === 'tiffin' 
        ? `/api/reviews/tiffin/${selectedComment._id}/comments`
        : `/api/reviews/${selectedComment._id}/comments`;
      
      const response = await api.post(endpoint, {
        comment: comment.trim(),
        user: user?.username || "Anonymous",
      }, { withCredentials: true });
      
      const newComment = response.data.comment;
      setCommentList(prev => [...prev, newComment]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Failed to post comment");
    }
  };

const handleReply = async (commentId) => {
  const reply = replyMap[commentId];
  if (!reply?.trim()) return;
  
  // Use the reviewID from params instead of selectedComment._id
  const reviewId = reviewID || selectedComment?._id;
  const reviewType = selectedComment?.reviewType || 'regular'; // Default to regular if not specified
  
  if (!reviewId) {
    Alert.alert("Error", "Review not found");
    return;
  }

  try {
    const endpoint = reviewTypew === "tiffin" 
      ? `/api/reviews/tiffin/${reviewId}/comments/${commentId}/replies`
      : `/api/reviews/${reviewId}/comments/${commentId}/replies`;

    const res = await api.post(
      endpoint,
      {
        reply: reply,
        userId: userId,
        user: user?.username || "Anonymous",
      },
      { withCredentials: true }
    );
console.log('reply',res)
    const updatedComments = commentList.map((c) => {
      if (c._id === commentId || c.commentId === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              reply: reply.trim(),
              username: user?.username || "Anonymous",
              createdAt: new Date().toISOString(),
              _id: `reply-${Date.now()}` 
            },
          ],
        };
      }
      return c;
    });

    setCommentList(updatedComments);
    setReplyMap({ ...replyMap, [commentId]: "" });
    
  } catch (err) {
    console.error("Failed to post reply", err);
    console.error("Error status:", err.response?.status);
    console.error("Error data:", err.response?.data);
    Alert.alert("Error", err.response?.data?.message || "Failed to post reply");
  }
};

  const handleViewMoreReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
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

  // Safe function to get replies from a comment item with validation
  const getReplies = (commentItem) => {
    if (!commentItem) return [];
    if (Array.isArray(commentItem.replies)) {
      // Filter out any null or undefined replies
      return commentItem.replies.filter(reply => reply && typeof reply === 'object');
    }
    if (commentItem.replies && typeof commentItem.replies === 'object') {
      return Object.values(commentItem.replies).filter(reply => reply && typeof reply === 'object');
    }
    return [];
  };

  if (isLoading) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!selectedComment || !selectedComment._id) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>No comment data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Original Review Comment */}
        <View style={styles.commentcontainer}>
          <View style={styles.commentheadingcontainer}>
            <View style={styles.ratingStartcontainer}>
              <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
              <View style={styles.commentnamecontainer}>
                <Text style={styles.commentName}>{selectedComment.user?.username || "Anonymous"}</Text>
                <Text style={styles.commentfollowers}>{reviewStatus.followers} Followers</Text>
              </View>
              <TouchableOpacity
                onPress={handleFollow}
                style={[styles.followButton, reviewStatus.isFollowing && styles.followingButton]}
              >
                <Text style={[styles.followButtonText, reviewStatus.isFollowing && styles.followingButtonText]}>
                  {reviewStatus.isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.commentRatingcontainer}>
              <View style={styles.RatingsContainer2}>
                <Text style={styles.RatingText}>{selectedComment.rating || 0}</Text>
                <AntDesign name="star" size={11} color="white" style={styles.RatingImg} />
              </View>
              <View style={styles.commentverifiedtextcontainer}>
                {selectedComment.verified && (
                  <>
                    <MaterialIcons name="verified" size={10} color="#6b7280ef" style={styles.verifiedimg} />
                    <Text style={styles.commentverified}>Verified order</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <Text style={styles.commentText}>
            {Array.isArray(selectedComment.comment) 
              ? selectedComment.comment[0] 
              : selectedComment.comment || "No comment text available"
            }
          </Text>
          <View style={styles.LikeCommentCalculateContainer}>
            <Text style={styles.commentText2}>{getDaysAgo(selectedComment.createdAt)}</Text>
            <Text style={styles.commentText2}>
              {reviewStatus.likes} helpful votes, {commentList.length} comments
            </Text>
          </View>
        </View>
        
        <View style={styles.commenttabscontainer}>
          <TouchableOpacity onPress={handleLike} style={styles.commenttabbox}>
            <AntDesign
              name={reviewStatus.isLiked ? "like1" : "like2"}
              size={20}
              color={reviewStatus.isLiked ? "#E91E63" : "black"}
            />
            <Text style={[styles.commenttabtext, reviewStatus.isLiked && {color: "#E91E63"}]}>Helpful</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commenttabbox}>
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={20}
              color="black"
              style={styles.likeimage}
            />
            <Text style={styles.commenttabtext}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commenttabbox}>
            <Fontisto name="share" size={20} color="black" style={styles.likeimage} />
            <Text style={styles.commenttabtext}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments List - Fixed with comprehensive null checking */}
        <ScrollView style={styles.commentsList}>
          {commentList.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          ) : (
            commentList
              .filter(commentItem => commentItem && typeof commentItem === 'object')
              .map((commentItem, index) => {
                const replies = getReplies(commentItem);
                const commentId =commentItem.commentId;
                console.log('comment',commentId)
                const safeComment = commentItem || {};
                
                return (
                  <View key={commentId} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <FontAwesome name="user-circle-o" size={20} color="#b5b9dc" />
                      <Text style={styles.commentUsername}>
                        {safeComment?.username || "Anonymous"}
                      </Text>
                      <Text style={styles.commentTime}>
                        {getDaysAgo(safeComment?.date || safeComment?.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{safeComment?.comment || "No comment"}</Text>
                    
                    {/* Replies Section - Fixed with proper null checks */}
                    {replies.length > 0 && (
                      <View style={styles.repliesContainer}>
                        {replies.slice(0, visibleReplies[commentId] ? undefined : 2).map((reply, replyIndex) => {
                          // Safe reply object with fallbacks
                          const safeReply = reply || {};
                          return (
                            <View key={safeReply._id || `reply-${replyIndex}`} style={styles.replyItem}>
                              <View style={styles.replyHeader}>
                                <FontAwesome name="user-circle-o" size={16} color="#b5b9dc" />
                                <Text style={styles.replyUsername}>
                                  {safeReply?.username || "Anonymous"}
                                </Text>
                                <Text style={styles.replyTime}>
                                  {getDaysAgo(safeReply?.createdAt)}
                                </Text>
                              </View>
                              <Text style={styles.replyText}>{safeReply?.reply || "No reply"}</Text>
                            </View>
                          );
                        })}
                        
                        {replies.length > 1 && (
                          <TouchableOpacity
                            onPress={() => handleViewMoreReplies(commentId)}
                            style={styles.viewMoreButton}
                          >
                            <Text style={styles.viewMoreText}>
                              {visibleReplies[commentId] ? "View less" : `View ${replies.length} more replies`}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    
                    {/* Reply Input */}
                    <View style={styles.replyInputContainer}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder="Write a reply..."
                        value={replyMap[commentId] || ""}
                        onChangeText={(text) => setReplyMap({...replyMap, [commentId]: text})}
                      />
                      <TouchableOpacity
                        onPress={() => handleReply(commentId)}
                        style={styles.replyButton}
                      >
                        <Text style={styles.replyButtonText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
          )}
        </ScrollView>
        
        {/* Add Comment Input */}
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            multiline={true}
          />
          <TouchableOpacity
            onPress={handleCommentSubmit}
            style={styles.commentButton}
            disabled={!comment.trim()}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentcontainer: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  commentheadingcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingStartcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentnamecontainer: {
    marginLeft: 10,
  },
  commentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentfollowers: {
    fontSize: 12,
    color: '#6b7280',
  },
  followButton: {
    marginLeft: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E91E63',
    borderRadius: 15,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
  },
  followingButtonText: {
    color: '#E91E63',
  },
  commentRatingcontainer: {
    alignItems: 'flex-end',
  },
  RatingsContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 5,
  },
  RatingText: {
    color: 'white',
    fontSize: 12,
    marginRight: 3,
  },
  RatingImg: {
    marginLeft: 2,
  },
  commentverifiedtextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedimg: {
    marginRight: 3,
  },
  commentverified: {
    fontSize: 10,
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  LikeCommentCalculateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentText2: {
    fontSize: 12,
    color: '#6b7280',
  },
  commenttabscontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    marginBottom: 15,
  },
  commenttabbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commenttabtext: {
    marginLeft: 5,
    fontSize: 14,
  },
  likeimage: {
    marginRight: 5,
  },
  commentsList: {
    flex: 1,
    marginBottom: 15,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    fontSize: 16,
  },
  commentItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUsername: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  commentTime: {
    marginLeft: 10,
    fontSize: 12,
    color: '#6b7280',
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 10,
  },
  replyItem: {
    marginBottom: 10,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  replyUsername: {
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 13,
  },
  replyTime: {
    marginLeft: 8,
    fontSize: 11,
    color: '#6b7280',
  },
  replyText: {
    fontSize: 13,
    marginLeft: 25,
  },
  viewMoreButton: {
    marginTop: 5,
  },
  viewMoreText: {
    color: '#E91E63',
    fontSize: 12,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
  },
  replyButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  replyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 15,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 10,
    maxHeight: 100,
  },
  commentButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  commentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommentsScreen;