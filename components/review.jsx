import React, { Fragment, useState, useEffect } from "react";
import { TouchableOpacity, View, Text, FlatList, TextInput } from "react-native";
// import CommentStyles from "../styles/commentstyles";
import Ionicons from '@expo/vector-icons/Ionicons';
// import ZomatoStyles from "../styles/zomatostyles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";
import { useRouter } from "expo-router";
import { API_CONFIG } from '../config/apiConfig';
import { useSafeNavigation } from "@/hooks/navigationPage";


const Review = (props) => {
  const {
    data: {
      _id,
      isLiked
    }
  } = props;

  const [commentData, setCommentData] = useState(null);
  const { safeNavigation } = useSafeNavigation();

  const [username, setUsername] = useState("");
  const [comments, setComments] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [commentsno, setCommentsno] = useState(0);
  const router = useRouter();

  const fetchReview = async () => {
    try {

      const response = await axios.get(`${API_CONFIG.BACKEND_URL}/api/reviews/${_id}`, {
        withCredentials: true
      });
      setCommentData(response.data.review);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_CONFIG.BACKEND_URL}/user/profileData`, {
        withCredentials: true
      });
      setUsername(res.data.user?.username || "Anonymous");
      console.log(res.data.user?.username)
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    fetchReview();
    fetchUserProfile();
  }, []);

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

  const setcommentdata = async () => {
    if (!comments.trim()) return;
    if (!_id) {
      console.error("Review ID is missing, cannot post comment.");
      return;
    }
    try {


const response = await axios.post(
  `${API_CONFIG.BACKEND_URL}/api/reviews/${_id}/comments`,
  {
    comment: comments.trim(),
    username: username,
    date: new Date().toISOString(),
  },
  {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, 
  }
);

      const result = await response.json();

      if (response.ok && result?.review) {
        const newComment = result.review.comments[result.review.comments.length - 1];
        setCommentList([...commentList, {
          name: newComment.username || "You",
          comment: newComment.comment,
          time: new Date(newComment.date).getTime()
        }]);
        setComments("");
        setCommentsno(prev => prev + 1);
        fetchReview();
      } else {
        console.error("Error posting comment:", result.message || "Review not found");
      }
    } catch (err) {
      console.error("Network error posting comment:", err);
    }
  };
  return (
    <Fragment>
      <View style={{ flex: 1 }}>
        <View style={CommentStyles.background}>
          <View style={CommentStyles.headingContainer}>
            <TouchableOpacity onPress={() => safeNavigation("/screens/Reviewsall")}>
              <Ionicons name="arrow-back" size={24} color="black" style={CommentStyles.headinImg} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Review</Text>
          </View>

          {commentData && (
            <View>
              <View className="p-4 bg-white border-b border-gray-100">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row items-center">
                    <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
                    <View className="ml-2">
                      <Text className="font-semibold text-base">{commentData.authorName}</Text>
                      <Text className="text-sm text-gray-500">{commentData.followers} Followers</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center bg-green-600 px-2 py-1 rounded">
                      <Text className="text-white font-semibold text-sm mr-1">{commentData.rating}</Text>
                      <AntDesign name="star" size={11} color="white" />
                    </View>
                    <View className="flex-row items-center mt-1">
                      <MaterialIcons name="verified" size={10} color="#6b7280ef" />
                      <Text className="text-xs text-gray-500 ml-1">Verified order</Text>
                    </View>
                  </View>
                </View>
                <Text className="text-gray-800 text-sm leading-5 mb-3">{commentData.reviewText}</Text>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500">{new Date(commentData.date).toLocaleDateString()}</Text>
                  <Text className="text-xs text-gray-500">{commentData.likes || 0} helpful votes, {commentData.comments?.length || 0} comments</Text>
                </View>
              </View>

              <View className="px-4 py-2">
                <View className="flex-row justify-around">
                  <TouchableOpacity className="flex-row items-center py-2">
                    <AntDesign name={isLiked ? "like1" : "like2"} size={20} color="black" />
                    <Text className="ml-2 text-sm text-gray-700">Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center py-2">
                    <MaterialCommunityIcons name="comment-text-outline" size={20} color="black" />
                    <Text className="ml-2 text-sm text-gray-700">Comment</Text>
                  </TouchableOpacity>
                  <View className="flex-row items-center py-2">
                    <Fontisto name="share" size={20} color="black" />
                    <Text className="ml-2 text-sm text-gray-700">Share</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {commentData?.comments?.length > 0 ? (
          <FlatList
            data={commentData.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="p-4 border-b border-gray-100">
                <Text className="font-semibold text-sm mb-1">{item.username || "NA"}</Text>
                <Text className="text-gray-800 text-sm mb-1">{item.comment}</Text>
                <Text className="text-xs text-gray-500">{getDaysAgo(item.date)}</Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-center mt-2.5 text-gray-500">No comments found.</Text>
        )}
      </View>

      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center">
          <TextInput
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-3"
            value={comments}
            onChangeText={setComments}
          />
          <TouchableOpacity onPress={setcommentdata}>
            <Text className="text-blue-600 font-semibold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
};

export default Review;