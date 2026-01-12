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
      <View className="flex-1 bg-white">
        <View className="flex-1 p-5">
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!selectedComment || !selectedComment._id) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 p-5">
          <Text>No comment data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-3.75 border-b border-gray-200 pb-2.5">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Comments</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Original Review Comment */}
        <View className="bg-gray-50 p-3.75 rounded-2.5 mb-3.75">
          <View className="flex-row justify-between mb-2.5">
            <View className="flex-row items-center">
              <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
              <View className="ml-2.5">
                <Text className="text-base font-semibold">{selectedComment.user?.username || "Anonymous"}</Text>
                <Text className="text-xs text-gray-500">{reviewStatus.followers} Followers</Text>
              </View>
              <TouchableOpacity
                onPress={handleFollow}
                className={`ml-3.75 px-3 py-1.5 rounded-3.75 ${
                  reviewStatus.isFollowing 
                    ? 'bg-transparent border border-pink-500' 
                    : 'bg-pink-500'
                }`}
              >
                <Text className={`text-xs ${
                  reviewStatus.isFollowing ? 'text-pink-500' : 'text-white'
                }`}>
                  {reviewStatus.isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="items-end">
              <View className="flex-row items-center bg-green-500 px-1.5 py-0.5 rounded-1 mb-1.25">
                <Text className="text-white text-xs mr-0.75">{selectedComment.rating || 0}</Text>
                <AntDesign name="star" size={11} color="white" className="ml-0.5" />
              </View>
              <View className="flex-row items-center">
                {selectedComment.verified && (
                  <>
                    <MaterialIcons name="verified" size={10} color="#6b7280ef" className="mr-0.75" />
                    <Text className="text-xs text-gray-500">Verified order</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <Text className="text-sm mb-2.5 leading-5">
            {Array.isArray(selectedComment.comment) 
              ? selectedComment.comment[0] 
              : selectedComment.comment || "No comment text available"
            }
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">{getDaysAgo(selectedComment.createdAt)}</Text>
            <Text className="text-xs text-gray-500">
              {reviewStatus.likes} helpful votes, {commentList.length} comments
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-around border-t border-gray-200 pt-2.5 mb-3.75">
          <TouchableOpacity onPress={handleLike} className="flex-row items-center">
            <AntDesign
              name={reviewStatus.isLiked ? "like1" : "like2"}
              size={20}
              color={reviewStatus.isLiked ? "#E91E63" : "black"}
            />
            <Text className={`ml-1.25 text-sm ${reviewStatus.isLiked ? 'text-pink-500' : 'text-black'}`}>Helpful</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={20}
              color="black"
              className="mr-1.25"
            />
            <Text className="text-sm">Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Fontisto name="share" size={20} color="black" className="mr-1.25" />
            <Text className="text-sm">Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments List - Fixed with comprehensive null checking */}
        <ScrollView className="flex-1 mb-3.75">
          {commentList.length === 0 ? (
            <Text className="text-center text-gray-500 mt-5 text-base">No comments yet</Text>
          ) : (
            commentList
              .filter(commentItem => commentItem && typeof commentItem === 'object')
              .map((commentItem, index) => {
                const replies = getReplies(commentItem);
                const commentId =commentItem.commentId;
                console.log('comment',commentId)
                const safeComment = commentItem || {};
                
                return (
                  <View key={commentId} className="bg-gray-50 p-3 rounded-2 mb-2.5">
                    <View className="flex-row items-center mb-2">
                      <FontAwesome name="user-circle-o" size={20} color="#b5b9dc" />
                      <Text className="ml-2 font-semibold text-sm">
                        {safeComment?.username || "Anonymous"}
                      </Text>
                      <Text className="ml-2.5 text-xs text-gray-500">
                        {getDaysAgo(safeComment?.date || safeComment?.createdAt)}
                      </Text>
                    </View>
                    <Text className="text-sm mb-2.5 leading-5">{safeComment?.comment || "No comment"}</Text>
                    
                    {/* Replies Section - Fixed with proper null checks */}
                    {replies.length > 0 && (
                      <View className="mt-2.5 ml-5 border-l-2 border-gray-200 pl-2.5">
                        {replies.slice(0, visibleReplies[commentId] ? undefined : 2).map((reply, replyIndex) => {
                          // Safe reply object with fallbacks
                          const safeReply = reply || {};
                          return (
                            <View key={safeReply._id || `reply-${replyIndex}`} className="mb-2.5">
                              <View className="flex-row items-center mb-1.25">
                                <FontAwesome name="user-circle-o" size={16} color="#b5b9dc" />
                                <Text className="ml-1.25 font-semibold text-xs">
                                  {safeReply?.username || "Anonymous"}
                                </Text>
                                <Text className="ml-2 text-xs text-gray-500">
                                  {getDaysAgo(safeReply?.createdAt)}
                                </Text>
                              </View>
                              <Text className="text-xs ml-6.25">{safeReply?.reply || "No reply"}</Text>
                            </View>
                          );
                        })}
                        
                        {replies.length > 1 && (
                          <TouchableOpacity
                            onPress={() => handleViewMoreReplies(commentId)}
                            className="mt-1.25"
                          >
                            <Text className="text-pink-500 text-xs">
                              {visibleReplies[commentId] ? "View less" : `View ${replies.length} more replies`}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    
                    {/* Reply Input */}
                    <View className="flex-row items-center mt-2.5">
                      <TextInput
                        className="flex-1 border border-gray-200 rounded-5 px-3.75 py-2 text-sm mr-2.5"
                        placeholder="Write a reply..."
                        value={replyMap[commentId] || ""}
                        onChangeText={(text) => setReplyMap({...replyMap, [commentId]: text})}
                      />
                      <TouchableOpacity
                        onPress={() => handleReply(commentId)}
                        className="bg-pink-500 px-3.75 py-2 rounded-5"
                      >
                        <Text className="text-white text-sm">Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
          )}
        </ScrollView>
        
        {/* Add Comment Input */}
        <View className="flex-row items-center border-t border-gray-200 pt-3.75">
          <TextInput
            className="flex-1 border border-gray-200 rounded-5 px-3.75 py-2.5 text-sm mr-2.5 max-h-25"
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            multiline={true}
          />
          <TouchableOpacity
            onPress={handleCommentSubmit}
            className="bg-pink-500 px-5 py-2.5 rounded-5"
            disabled={!comment.trim()}
          >
            <Text className="text-white text-sm font-semibold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );}

/* Original CSS Reference:
const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalContent: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  commentcontainer: { backgroundColor: '#f9fafb', padding: 15, borderRadius: 10, marginBottom: 15 },
  commentheadingcontainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ratingStartcontainer: { flexDirection: 'row', alignItems: 'center' },
  commentnamecontainer: { marginLeft: 10 },
  commentName: { fontSize: 16, fontWeight: '600' },
  commentfollowers: { fontSize: 12, color: '#6b7280' },
  followButton: { marginLeft: 15, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E91E63', borderRadius: 15 },
  followingButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E91E63' },
  followButtonText: { color: 'white', fontSize: 12 },
  followingButtonText: { color: '#E91E63' },
  commentRatingcontainer: { alignItems: 'flex-end' },
  RatingsContainer2: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 5 },
  RatingText: { color: 'white', fontSize: 12, marginRight: 3 },
  RatingImg: { marginLeft: 2 },
  commentverifiedtextcontainer: { flexDirection: 'row', alignItems: 'center' },
  verifiedimg: { marginRight: 3 },
  commentverified: { fontSize: 10, color: '#6b7280' },
  commentText: { fontSize: 14, marginBottom: 10, lineHeight: 20 },
  LikeCommentCalculateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  commentText2: { fontSize: 12, color: '#6b7280' },
  commenttabscontainer: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, marginBottom: 15 },
  commenttabbox: { flexDirection: 'row', alignItems: 'center' },
  commenttabtext: { marginLeft: 5, fontSize: 14 },
  likeimage: { marginRight: 5 },
  commentsList: { flex: 1, marginBottom: 15 },
  noCommentsText: { textAlign: 'center', color: '#6b7280', marginTop: 20, fontSize: 16 },
  commentItem: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 10 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  commentUsername: { marginLeft: 8, fontWeight: '600', fontSize: 14 },
  commentTime: { marginLeft: 10, fontSize: 12, color: '#6b7280' },
  repliesContainer: { marginTop: 10, marginLeft: 20, borderLeftWidth: 2, borderLeftColor: '#e5e7eb', paddingLeft: 10 },
  replyItem: { marginBottom: 10 },
  replyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  replyUsername: { marginLeft: 5, fontWeight: '600', fontSize: 13 },
  replyTime: { marginLeft: 8, fontSize: 11, color: '#6b7280' },
  replyText: { fontSize: 13, marginLeft: 25 },
  viewMoreButton: { marginTop: 5 },
  viewMoreText: { color: '#E91E63', fontSize: 12 },
  replyInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  replyInput: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, marginRight: 10 },
  replyButton: { backgroundColor: '#E91E63', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  replyButtonText: { color: 'white', fontSize: 14 },
  addCommentContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 15 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, marginRight: 10, maxHeight: 100 },
  commentButton: { backgroundColor: '#E91E63', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  commentButtonText: { color: 'white', fontSize: 14, fontWeight: '600' }
});
*/

export default CommentsScreen;