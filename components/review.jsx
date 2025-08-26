import React, { Fragment, useState, useEffect } from "react";
import { TouchableOpacity, View, Text, FlatList, TextInput } from "react-native";
import CommentStyles from "../styles/commentstyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import ZomatoStyles from "../styles/zomatostyles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";
import { useRouter } from "expo-router";

const Review = (props) => {
  const {
    data: {
      _id,
      isLiked
    }
  } = props;

  const [commentData, setCommentData] = useState(null);
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [commentsno, setCommentsno] = useState(0);
  const router = useRouter();

  const fetchReview = async () => {
    try {
import { API_CONFIG } from '../config/apiConfig';
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
            <TouchableOpacity onPress={() => router.push("/screens/Reviewsall")}>
              <Ionicons name="arrow-back" size={24} color="black" style={CommentStyles.headinImg} />
            </TouchableOpacity>
            <Text style={CommentStyles.headingText}>Review</Text>
          </View>

          {commentData && (
            <View>
              <View style={ZomatoStyles.commentcontainer}>
                <View style={ZomatoStyles.commentheadingcontainer}>
                  <View style={ZomatoStyles.ratingStartcontainer}>
                    <FontAwesome name="user-circle-o" size={33} color="#b5b9dc" />
                    <View style={ZomatoStyles.commentnamecontainer}>
                      <Text style={ZomatoStyles.commentName}>{commentData.authorName}</Text>
                      <Text style={ZomatoStyles.commentfollowers}>{commentData.followers} Followers</Text>
                    </View>
                  </View>
                  <View style={ZomatoStyles.commentRatingcontainer}>
                    <View style={ZomatoStyles.RatingsContainer2}>
                      <Text style={ZomatoStyles.RatingText}>{commentData.rating}</Text>
                      <AntDesign name="star" size={11} color="white" />
                    </View>
                    <View style={ZomatoStyles.commentverifiedtextcontainer}>
                      <MaterialIcons name="verified" size={10} color="#6b7280ef" />
                      <Text style={ZomatoStyles.commentverified}>Verified order</Text>
                    </View>
                  </View>
                </View>
                <Text style={ZomatoStyles.commentText}>{commentData.reviewText}</Text>
                <View style={ZomatoStyles.LikeCommentCalculateContainer}>
                  <Text style={ZomatoStyles.commentText2}>{new Date(commentData.date).toLocaleDateString()}</Text>
                  <Text style={ZomatoStyles.commentText2}>{commentData.likes || 0} helpful votes, {commentData.comments?.length || 0} comments</Text>
                </View>
              </View>

              <View style={CommentStyles.commentValuesContainer}>
                <View style={ZomatoStyles.commenttabscontainer}>
                  <TouchableOpacity style={ZomatoStyles.commenttabbox}>
                    <AntDesign name={isLiked ? "like1" : "like2"} size={20} color="black" />
                    <Text style={ZomatoStyles.commenttabtext}>Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={ZomatoStyles.commenttabbox}>
                    <MaterialCommunityIcons name="comment-text-outline" size={20} color="black" />
                    <Text style={ZomatoStyles.commenttabtext}>Comment</Text>
                  </TouchableOpacity>
                  <View style={ZomatoStyles.commenttabbox}>
                    <Fontisto name="share" size={20} color="black" />
                    <Text style={ZomatoStyles.commenttabtext}>Share</Text>
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
              <View style={CommentStyles.commentNameContainer}>
                <Text style={CommentStyles.commentName}>{item.username || "NA"}</Text>
                <Text style={CommentStyles.commentvalue}>{item.comment}</Text>
                <Text style={CommentStyles.commenttime}>{getDaysAgo(item.date)}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 10 }}>No comments found.</Text>
        )}
      </View>

      <View style={CommentStyles.commeninputboc}>
        <View style={CommentStyles.commentinputContainer}>
          <TextInput
            placeholder="Write a comment..."
            style={CommentStyles.commentInput}
            value={comments}
            onChangeText={setComments}
          />
          <TouchableOpacity onPress={setcommentdata}>
            <Text style={CommentStyles.Post}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
};

export default Review;