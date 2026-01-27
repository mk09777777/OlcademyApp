// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Modal,
//   Image,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import Fontisto from "@expo/vector-icons/Fontisto";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import RatingsCalculated from "../../components/calculated";
// import Preference from "../../components/preference";
// import Entypo from "@expo/vector-icons/Entypo";
// import { router, useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import { API_CONFIG } from "../../config/apiConfig";
// import { useSafeNavigation } from "@/hooks/navigationPage";

// function Reviewsall() {
//   const [calculatedboxvisible, setcalculatedboxvisible] = useState(false);
//   const [perfervisible, setprefervisible] = useState(false);
//   const [commentvisible, setcommentvisible] = useState(false);
//   const [pref, setpref] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const { safeNavigation } = useSafeNavigation();

//   const [filteredData, setFilteredData] = useState([]);
//   const [sortedData, setSortedData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [selectedComment, setSelectedComment] = useState(null);

//   const [commentList, setCommentList] = useState([]);
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState("");
//   const [replyMap, setReplyMap] = useState({});
//   const [visibleReplies, setVisibleReplies] = useState({});
//   const [reviewStatus, setReviewStatus] = useState({
//     isFollowing: false,
//     isLiked: false,
//     followers: 0,
//     likes: 0,
//   });

//   const [filtersActive, setFiltersActive] = useState({
//     verified: false,
//     withPhotos: false,
//     detailedReview: false,
//   });

//   const [sortActive, setSortActive] = useState({
//     rating: false,
//     date: false,
//   });

//   const params = useLocalSearchParams();
//   const firmId = params.firmId || params.firm || params.id;
//   const reviewType = params.reviewType;

//   const { user, profileData, api } = useAuth();
//   const currentUserData = profileData?.email
//     ? profileData
//     : user
//     ? { username: user }
//     : null;
//   const userId = profileData?._id || user?.id;

//   useEffect(() => {
//     const fetchReviews = async (pageNum = 1, isRefreshing = false) => {
//       try {
//         if (pageNum === 1) setLoading(true);

//         let restaurantReviews = [];
//         let tiffinReviews = [];

//         try {
//           const restaurantResponse = await axios.get(
//             `${API_CONFIG.BACKEND_URL}/firm/restaurants/get-reviews/${firmId}`,
//             { params: { page: pageNum }, withCredentials: true }
//           );

//           if (
//             restaurantResponse.data &&
//             Array.isArray(restaurantResponse.data.reviews)
//           ) {
//             restaurantReviews = restaurantResponse.data.reviews;
//           }
//         } catch (err) {
//           if (
//             axios.isAxiosError(err) &&
//             err.response &&
//             err.response.status === 404
//           ) {
//             console.log("No restaurant reviews found");
//           } else {
//             console.error("Error fetching restaurant reviews:", err);
//           }
//         }

//         try {
//           const tiffinResponse = await axios.get(
//             `${API_CONFIG.BACKEND_URL}/api/tiffin-Reviews/${firmId}`,
//             { params: { page: pageNum }, withCredentials: true }
//           );

//           if (
//             tiffinResponse.data &&
//             Array.isArray(tiffinResponse.data.reviews)
//           ) {
//             tiffinReviews = tiffinResponse.data.reviews;
//           }
//         } catch (err) {
//           if (
//             axios.isAxiosError(err) &&
//             err.response &&
//             err.response.status === 404
//           ) {
//             console.log("No tiffin reviews found");
//           } else {
//             console.error("Error fetching tiffin reviews:", err);
//           }
//         }

//         const allReviews = [...restaurantReviews, ...tiffinReviews];

//         if (allReviews.length > 0) {
//           const transformedData = allReviews.map((review) => ({
//             _id: review._id,
//             user: {
//               username:
//                 review.author_name ||
//                 review.authorName?.username ||
//                 (review.email ? review.email.split("@")[0] : "Anonymous"),
//               followers:
//                 review.followers ||
//                 (review.followBy ? review.followBy.length : 0),
//               userId: review.authorId || review.userId || review.authorName?._id,
//             },
//             comment: review.comments || [],
//             reviewType: review.reviewType,
//             rating: review.rating,
//             createdAt: review.date || review.createdAt,
//             verified: review.verified || true,
//             images: review.images || [],
//             detailedReview: (review.reviewText || review.comment)?.length > 100,
//             likes: review.likes || (review.likedBy ? review.likedBy.length : 0),
//             commentsCount:
//               review.comments?.length || review.usercomments?.length || 0,
//             likedBy: review.likedBy || [],
//             usercomments: review.usercomments || [],
//             isLiked:
//               review.likedBy?.includes(
//                 profileData?.email || user?.username
//               ) || false,
//             isFollowing: review.isFollowing || false,
//           }));

//           if (pageNum === 1 || isRefreshing) {
//             setData(transformedData);
//             setHasMore(false);
//           } else {
//             setData((prev) => [...prev, ...transformedData]);
//           }
//         } else {
//           if (pageNum === 1 || isRefreshing) {
//             setData([]);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err);
//         setError(err.response?.data?.error || err.message);
//         Alert.alert("Error", "Failed to load reviews");
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     };

//     if (firmId) {
//       fetchReviews();
//     }
//   }, [firmId]);

//   useEffect(() => {
//     applyFilters();
//   }, [filtersActive, data]);

//   useEffect(() => {
//     handleSorting();
//   }, [sortActive, filteredData]);

//   useEffect(() => {
//     if (selectedComment) {
//       fetchReviewStatus(selectedComment._id, selectedComment.reviewType);
//       setComments(selectedComment.comment);
//       setCommentList(selectedComment.usercomments || []);
//     }
//   }, [selectedComment]);

//   const fetchReviewStatus = async (reviewId, reviewType) => {
//     try {
//       if (!reviewId) return;

//       const response = await api.get(`/api/reviews/${reviewId}/status`, {
//         withCredentials: true,
//       });
//       const { isFollow, isLike, followers, likes } = response.data.data;
//       setReviewStatus({
//         isFollowing: isFollow,
//         isLiked: isLike,
//         followers: followers,
//         likes: likes,
//       });
//     } catch (err) {
//       console.error("Error fetching review status:", err);
//       setReviewStatus({
//         isFollowing: false,
//         isLiked: false,
//         followers: 0,
//         likes: 0,
//       });
//     }
//   };

//   const applyFilters = () => {
//     const filtered = data.filter((item) => {
//       if (filtersActive.verified && !item.verified) return false;
//       if (filtersActive.withPhotos && item.images.length === 0) return false;
//       if (filtersActive.detailedReview && !item.detailedReview) return false;
//       return true;
//     });
//     setFilteredData(filtered);
//   };

//   const handleSorting = () => {
//     let sortedArray = [...filteredData];
//     if (sortActive.rating) {
//       sortedArray.sort((a, b) => b.rating - a.rating);
//     } else if (sortActive.date) {
//       sortedArray.sort(
//         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//     }
//     setSortedData(sortedArray);
//   };

//   const handleActive = (filterKey) => {
//     setFiltersActive((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
//   };

//   const handlechildpref = (childdata) => {
//     setpref(childdata);
//     if (childdata === "High Rating") {
//       setSortActive({ rating: true, date: false });
//     } else if (childdata === "Latest") {
//       setSortActive({ rating: false, date: true });
//     } else {
//       setSortActive({ rating: false, date: false });
//     }
//   };

//   const handleLike = async (reviewId, reviewType) => {
//     try {
//       const endpoint =
//         reviewType === "tiffin"
//           ? `/api/reviews/tiffin/${reviewId}/like`
//           : `/api/reviews/${reviewId}/like`;
//       const response = await api.post(
//         endpoint,
//         {},
//         { withCredentials: true }
//       );

//       setData((prevData) =>
//         prevData.map((item) =>
//           item._id === reviewId
//             ? {
//                 ...item,
//                 isLiked: !item.isLiked,
//                 likes: response.data.likes,
//               }
//             : item
//         )
//       );

//       if (selectedComment && selectedComment._id === reviewId) {
//         setReviewStatus((prev) => ({
//           ...prev,
//           isLiked: !prev.isLiked,
//           likes: response.data.likes,
//         }));
//       }
//     } catch (err) {
//       console.error("Error liking review:", err);
//       Alert.alert("Error", "Failed to like review");
//     }
//   };

//   const handleFollow = async (reviewId, reviewType) => {
//     try {
//       const endpoint =
//         reviewType === "tiffin"
//           ? `/api/reviews/tiffin/${reviewId}/follow`
//           : `/api/reviews/${reviewId}/follow`;

//       const response = await api.post(
//         endpoint,
//         {},
//         { withCredentials: true }
//       );

//       setData((prevData) =>
//         prevData.map((item) =>
//           item._id === reviewId
//             ? {
//                 ...item,
//                 isFollowing: !item.isFollowing,
//                 user: {
//                   ...item.user,
//                   followers: response.data.followers,
//                 },
//               }
//             : item
//         )
//       );

//       if (selectedComment && selectedComment._id === reviewId) {
//         setReviewStatus((prev) => ({
//           ...prev,
//           isFollowing: !prev.isFollowing,
//           followers: response.data.followers,
//         }));
//       }
//     } catch (err) {
//       console.error("Error following user:", err);
//       Alert.alert("Error", "Failed to follow user");
//     }
//   };

//   const getDaysAgo = (dateString) => {
//     if (!dateString) return "Recently";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Recently";

//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) {
//       const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//       if (diffHours === 0) {
//         const diffMinutes = Math.floor(diffTime / (1000 * 60));
//         return `${diffMinutes} min ago`;
//       }
//       return `${diffHours} hours ago`;
//     }

//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;

//     const diffWeeks = Math.floor(diffDays / 7);
//     if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

//     const diffMonths = Math.floor(diffDays / 30);
//     return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
//   };

//   const handleLoadMore = () => {
//     if (hasMore && !loading) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//   };

//   const togglevisible = () => setcalculatedboxvisible(!calculatedboxvisible);
//   const togglepref = () => setprefervisible(!perfervisible);
//   const togglecomment = (comment = null) => {
//     setSelectedComment(comment);
//     setcommentvisible(!commentvisible);
//     if (!commentvisible) {
//       setComment("");
//       setReplyMap({});
//     }
//   };

//   const filters = ["verified", "withPhotos"];

//   if (loading && page === 1) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white">
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white px-4">
//         <Text className="text-base text-red-500 text-center mb-4">
//           {error}
//         </Text>
//         <TouchableOpacity
//           onPress={() => {
//             if (typeof window !== "undefined") {
//               window.location?.reload?.();
//             }
//           }}
//           className="px-4 py-2 rounded-full bg-pink-500"
//         >
//           <Text className="text-white font-semibold text-sm">Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const listData =
//     sortActive.rating || sortActive.date ? sortedData : filteredData;

//   return (
//     <View className="flex-1 bg-white">
//       {/* Header */}
//       <View className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white flex-row items-center">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="chevron-back" size={32} color="black" />
//         </TouchableOpacity>
//         <Text className="flex-1 text-center text-lg font-semibold text-black">
//           {params.restaurantName || "Reviews"}
//         </Text>
//         <MaterialCommunityIcons
//           name="share-outline"
//           size={28}
//           color="black"
//         />
//       </View>

//       {/* Search */}
//       <View className="mx-4 mt-3 flex-row items-center px-3 py-2 rounded-full bg-gray-100">
//         <AntDesign name="search" size={20} color="#E91E63" />
//         <TextInput
//           className="flex-1 ml-2 text-sm text-gray-800"
//           placeholder="Search in reviews"
//           placeholderTextColor="#6b7280ef"
//         />
//       </View>

//       {/* Filters & Sort */}
//       <View className="mt-3 px-4 flex-row items-center justify-between">
//         <FlatList
//           data={filters}
//           keyExtractor={(item, index) => index.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => {
//             const isActive = filtersActive[item];
//             return (
//               <View className="mr-2">
//                 <TouchableOpacity onPress={() => handleActive(item)}>
//                   <View
//                     className={`flex-row items-center px-3 py-1 rounded-full border ${
//                       isActive
//                         ? "border-pink-500 bg-pink-50"
//                         : "border-gray-300 bg-white"
//                     }`}
//                   >
//                     <MaterialIcons
//                       name={item === "verified" ? "verified" : "photo"}
//                       size={16}
//                       color="black"
//                     />
//                     <Text className="ml-1 text-xs text-gray-800">
//                       {item === "verified" ? "Verified" : "With Photos"}
//                     </Text>
//                     {isActive && (
//                       <View className="ml-1">
//                         <Entypo name="cross" size={16} color="black" />
//                       </View>
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             );
//           }}
//         />

//         <TouchableOpacity
//           className="flex-row items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-100 ml-2"
//           onPress={togglepref}
//         >
//           <Text className="text-xs text-gray-800">
//             {pref || "Relevance"}
//           </Text>
//           <MaterialIcons name="arrow-drop-down" size={20} color="black" />
//         </TouchableOpacity>

//         <Modal
//           animationType="slide"
//           transparent
//           visible={perfervisible}
//           onRequestClose={togglepref}
//         >
//           <Preference
//             togglepref={togglepref}
//             senddatatoparent={handlechildpref}
//             message={pref}
//           />
//         </Modal>
//       </View>

//       {/* Main List */}
//       <View className="flex-1">
//         <FlatList
//           data={listData}
//           keyExtractor={(item) => item._id}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <View className="flex-1 items-center justify-center py-10">
//               <Text className="text-sm text-gray-500">No reviews found</Text>
//             </View>
//           }
//           renderItem={({ item }) => (
//             <View className="px-4 pt-3 pb-2 border-b border-gray-100 bg-white">
//               <View>
//                 {/* Header row inside item */}
//                 <View className="flex-row justify-between">
//                   <View className="flex-row items-center flex-1">
//                     <FontAwesome
//                       name="user-circle-o"
//                       size={33}
//                       color="#b5b9dc"
//                     />
//                     <View className="ml-2 flex-1">
//                       <Text className="text-sm font-semibold text-gray-900">
//                         {item.user?.username || "Anonymous"}
//                       </Text>
//                       <Text className="text-[11px] text-gray-500 mt-0.5">
//                         {item.user.followers} Followers •{" "}
//                         {getDaysAgo(item.createdAt)}
//                       </Text>
//                     </View>
//                     <TouchableOpacity
//                       onPress={() => handleFollow(item._id, item.reviewType)}
//                       className={`px-3 py-1 rounded-full border border-pink-500 ${
//                         item.isFollowing ? "bg-pink-500" : "bg-white"
//                       }`}
//                     >
//                       <Text
//                         className={`text-xs font-medium ${
//                           item.isFollowing
//                             ? "text-white"
//                             : "text-pink-500"
//                         }`}
//                       >
//                         {item.isFollowing ? "Following" : "Follow"}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View className="items-end ml-2">
//                     <View className="flex-row items-center px-2 py-1 rounded bg-green-600">
//                       <Text className="text-xs font-semibold text-white">
//                         {item.rating}
//                       </Text>
//                       <View className="ml-1">
//                         <AntDesign name="star" size={11} color="white" />
//                       </View>
//                     </View>
//                     <View className="flex-row items-center mt-1">
//                       {item.verified && (
//                         <>
//                           <MaterialIcons
//                             name="verified"
//                             size={10}
//                             color="#6b7280ef"
//                           />
//                           <Text className="text-[10px] text-gray-500 ml-1">
//                             Verified order
//                           </Text>
//                         </>
//                       )}
//                     </View>
//                   </View>
//                 </View>

//                 {/* Comment text */}
//                 <Text className="mt-2 text-sm text-gray-800">
//                   {item.comment}
//                 </Text>

//                 {/* Images (if you re-enable) */}
//                 {/* {item.images && item.images.length > 0 && (
//                   <View className="mt-2">
//                     <Image
//                       source={{ uri: item.images[0] }}
//                       className="w-32 h-32 rounded-lg"
//                     />
//                   </View>
//                 )} */}
//               </View>

//               {/* Actions row */}
//               <View className="flex-row mt-2">
//                 <TouchableOpacity
//                   onPress={() => handleLike(item._id, item.reviewType)}
//                   className="flex-row items-center mr-4"
//                 >
//                   <AntDesign
//                     name={item.isLiked ? "like1" : "like2"}
//                     size={20}
//                     color={item.isLiked ? "#E91E63" : "black"}
//                   />
//                   <Text
//                     className={`ml-1 text-xs ${
//                       item.isLiked ? "text-pink-500" : "text-gray-800"
//                     }`}
//                   >
//                     {item.likes || 0}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedComment(item);
//                     safeNavigation({
//                       pathname: "/screens/commentscreen",
//                       params: {
//                         commentData: JSON.stringify(item),
//                         review: item._id,
//                         firmId: firmId,
//                         restaurantName: params.restaurantName,
//                         reviewType: reviewType,
//                       },
//                     });
//                   }}
//                   className="flex-row items-center"
//                 >
//                   <MaterialCommunityIcons
//                     name="comment-outline"
//                     size={20}
//                     color="black"
//                   />
//                   <Text className="ml-1 text-xs text-gray-800">
//                     Comment
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.1}
//           ListFooterComponent={
//             loading && page > 1 ? (
//               <View className="py-4 items-center justify-center">
//                 <ActivityIndicator size="small" color="#0000ff" />
//               </View>
//             ) : (
//               <View className="h-24" />
//             )
//           }
//         />
//       </View>

//       <TouchableOpacity
//         className="absolute bottom-6 left-4 right-4 rounded-full bg-primary shadow-lg"
//         onPress={() =>
//           safeNavigation({
//             pathname: "/screens/Userrating",
//             params: {
//               firmId: firmId,
//               restaurantName: params.restaurantName,
//               currentUser: currentUserData,
//               reviewType: reviewType,
//             },
//           })
//         }
//         activeOpacity={0.9}
//       >
//         <View className="flex-row items-center justify-center py-3">
//           <MaterialIcons name="rate-review" size={20} color="#FFF" />
//           <Text className="ml-2 text-sm font-semibold text-white">
//             Write a Review
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default Reviewsall;


import { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Preference from "../../components/preference";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from "../../config/apiConfig";
import { useSafeNavigation } from "@/hooks/navigationPage";

// --- OPTIMIZATION 1: Extract and Memoize the List Item ---
// This prevents every single row from re-rendering when you type in search or change a filter
const ReviewItem = memo(({ item, onFollow, onLike, onCommentClick, getDaysAgo }) => {
  return (
    <View className="px-4 pt-3 pb-2 border-b border-gray-100 bg-white">
      <View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center flex-1">
            <FontAwesome name="user-circle" size={33} color="#b5b9dc" />
            <View className="ml-2 flex-1">
              <Text className="text-sm font-semibold text-gray-900">
                {item.user?.username || "Anonymous"}
              </Text>
              <Text className="text-[11px] text-gray-500 mt-0.5">
                {item.user.followers} Followers • {getDaysAgo(item.createdAt)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onFollow(item._id, item.reviewType)}
              className={`px-3 py-1 rounded-full border border-pink-500 ${
                item.isFollowing ? "bg-pink-500" : "bg-white"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  item.isFollowing ? "text-white" : "text-pink-500"
                }`}
              >
                {item.isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-end ml-2">
            <View className="flex-row items-center px-2 py-1 rounded bg-green-600">
              <Text className="text-xs font-semibold text-white">
                {item.rating}
              </Text>
              <View className="ml-1">
                <MaterialIcons name="star" size={11} color="white" />
              </View>
            </View>
            <View className="flex-row items-center mt-1">
              {item.verified && (
                <>
                  <MaterialIcons name="verified" size={10} color="#6b7280ef" />
                  <Text className="text-[10px] text-gray-500 ml-1">
                    Verified order
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <Text className="mt-2 text-sm text-gray-800">{item.comment}</Text>
      </View>

      <View className="flex-row mt-2">
        <TouchableOpacity
          onPress={() => onLike(item._id, item.reviewType)}
          className="flex-row items-center mr-4"
        >
          <MaterialIcons
            name={item.isLiked ? "thumb-up" : "thumb-up-off-alt"}
            size={20}
            color={item.isLiked ? "#E91E63" : "black"}
          />
          <Text
            className={`ml-1 text-xs ${
              item.isLiked ? "text-pink-500" : "text-gray-800"
            }`}
          >
            {item.likes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onCommentClick(item)}
          className="flex-row items-center"
        >
          <Ionicons name="chatbubble-outline" size={20} color="black" />
          <Text className="ml-1 text-xs text-gray-800">Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

function Reviewsall() {
  const [perfervisible, setprefervisible] = useState(false);
  const [pref, setpref] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Only keep the raw data in state
  const [data, setData] = useState([]);
  const { safeNavigation } = useSafeNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);

  const [filtersActive, setFiltersActive] = useState({
    verified: false,
    withPhotos: false,
    detailedReview: false,
  });

  const [sortActive, setSortActive] = useState({
    rating: false,
    date: false,
  });

  const params = useLocalSearchParams();
  const firmId = params.firmId || params.firm || params.id;
  const reviewType = params.reviewType;

  const { user, profileData, api } = useAuth();
  const currentUserData = profileData?.email
    ? profileData
    : user
    ? { username: user }
    : null;

  useEffect(() => {
    fetchReviews(1);
  }, [firmId]); // Removed `page` from dependency to prevent double fetch on mount

  const fetchReviews = async (pageNum = 1, isRefreshing = false) => {
    try {
      if (pageNum === 1) setLoading(true);

      let restaurantReviews = [];
      let tiffinReviews = [];

      try {
        const restaurantResponse = await axios.get(
          `${API_CONFIG.BACKEND_URL}/firm/restaurants/get-reviews/${firmId}`,
          { params: { page: pageNum }, withCredentials: true }
        );
        if (restaurantResponse.data?.reviews) {
          restaurantReviews = restaurantResponse.data.reviews;
        }
      } catch (err) {}

      try {
        const tiffinResponse = await axios.get(
          `${API_CONFIG.BACKEND_URL}/api/tiffin-Reviews/${firmId}`,
          { params: { page: pageNum }, withCredentials: true }
        );
        if (tiffinResponse.data?.reviews) {
          tiffinReviews = tiffinResponse.data.reviews;
        }
      } catch (err) {}

      const allReviews = [...restaurantReviews, ...tiffinReviews];

      if (allReviews.length > 0) {
        const transformedData = allReviews.map((review) => ({
          _id: review._id,
          user: {
            username:
              review.author_name ||
              review.authorName?.username ||
              (review.email ? review.email.split("@")[0] : "Anonymous"),
            followers:
              review.followers || (review.followBy ? review.followBy.length : 0),
            userId: review.authorId || review.userId || review.authorName?._id,
          },
          comment: review.comments || [],
          reviewType: review.reviewType,
          rating: review.rating,
          createdAt: review.date || review.createdAt,
          verified: review.verified || true,
          images: review.images || [],
          detailedReview: (review.reviewText || review.comment)?.length > 100,
          likes: review.likes || (review.likedBy ? review.likedBy.length : 0),
          likedBy: review.likedBy || [],
          isLiked:
            review.likedBy?.includes(profileData?.email || user?.username) ||
            false,
          isFollowing: review.isFollowing || false,
        }));

        if (pageNum === 1 || isRefreshing) {
          setData(transformedData);
          setHasMore(false); // Reset hasMore logic based on your backend pagination
        } else {
          setData((prev) => [...prev, ...transformedData]);
        }
      } else {
        if (pageNum === 1 || isRefreshing) setData([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- OPTIMIZATION 2: useMemo for Filtering & Sorting ---
  // This calculates the list ONLY when dependencies change, avoiding cascading renders.
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter
    if (
      filtersActive.verified ||
      filtersActive.withPhotos ||
      filtersActive.detailedReview ||
      searchQuery.trim().length > 0
    ) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        if (filtersActive.verified && !item.verified) return false;
        if (filtersActive.withPhotos && item.images.length === 0) return false;
        if (filtersActive.detailedReview && !item.detailedReview) return false;

        if (query.length > 0) {
          const usernameMatch = item.user?.username?.toLowerCase().includes(query);
          const commentString =
            typeof item.comment === "string"
              ? item.comment
              : String(item.comment);
          const commentMatch = commentString.toLowerCase().includes(query);
          if (!usernameMatch && !commentMatch) return false;
        }
        return true;
      });
    }

    // 2. Sort
    if (sortActive.rating) {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortActive.date) {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [data, filtersActive, sortActive, searchQuery]);

  // Use callbacks to prevent function recreation on every render
  const handleActive = useCallback((filterKey) => {
    setFiltersActive((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
  }, []);

  const handlechildpref = useCallback((childdata) => {
    setpref(childdata);
    if (childdata === "High Rating") {
      setSortActive({ rating: true, date: false });
    } else if (childdata === "Latest") {
      setSortActive({ rating: false, date: true });
    } else {
      setSortActive({ rating: false, date: false });
    }
  }, []);

  const getDaysAgo = useCallback((dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }, []);

  const handleLike = useCallback(async (reviewId, reviewType) => {
      // Optimistic Update could go here for even faster UI
      try {
        const endpoint =
          reviewType === "tiffin"
            ? `/api/reviews/tiffin/${reviewId}/like`
            : `/api/reviews/${reviewId}/like`;
        const response = await api.post(endpoint, {}, { withCredentials: true });

        setData((prevData) =>
          prevData.map((item) =>
            item._id === reviewId
              ? { ...item, isLiked: !item.isLiked, likes: response.data.likes }
              : item
          )
        );
      } catch (err) {
        console.error(err);
      }
    }, [api]);

  const handleFollow = useCallback(async (reviewId, reviewType) => {
      try {
        const endpoint =
          reviewType === "tiffin"
            ? `/api/reviews/tiffin/${reviewId}/follow`
            : `/api/reviews/${reviewId}/follow`;
        const response = await api.post(endpoint, {}, { withCredentials: true });

        setData((prevData) =>
          prevData.map((item) =>
            item._id === reviewId
              ? {
                  ...item,
                  isFollowing: !item.isFollowing,
                  user: { ...item.user, followers: response.data.followers },
                }
              : item
          )
        );
      } catch (err) {
        console.error(err);
      }
    }, [api]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchReviews(page + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setSearchQuery("");
    fetchReviews(1, true);
  };

  const togglepref = () => setprefervisible(!perfervisible);
  const filters = ["verified", "withPhotos"];

  if (loading && page === 1) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-black">
          {params.restaurantName || "Reviews"}
        </Text>
        <Ionicons name="share-social-outline" size={28} color="black" />
      </View>

      <View className="mx-4 mt-3 flex-row items-center px-3 py-2 rounded-full bg-gray-100">
        <Ionicons name="search" size={20} color="#E91E63" />
        <TextInput
          className="flex-1 ml-2 text-sm text-gray-800"
          placeholder="Search by username or comment"
          placeholderTextColor="#6b7280ef"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      <View className="mt-3 px-4 flex-row items-center justify-between">
        <FlatList
          data={filters}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive = filtersActive[item];
            return (
              <View className="mr-2">
                <TouchableOpacity onPress={() => handleActive(item)}>
                  <View
                    className={`flex-row items-center px-3 py-1 rounded-full border ${
                      isActive
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <MaterialIcons
                      name={item === "verified" ? "verified" : "photo-camera"}
                      size={16}
                      color="black"
                    />
                    <Text className="ml-1 text-xs text-gray-800">
                      {item === "verified" ? "Verified" : "With Photos"}
                    </Text>
                    {isActive && (
                      <View className="ml-1">
                        <Entypo name="cross" size={16} color="black" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <TouchableOpacity
          className="flex-row items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-100 ml-2"
          onPress={togglepref}
        >
          <Text className="text-xs text-gray-800">{pref || "Relevance"}</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="black" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent
          visible={perfervisible}
          onRequestClose={togglepref}
        >
          <Preference
            togglepref={togglepref}
            senddatatoparent={handlechildpref}
            message={pref}
          />
        </Modal>
      </View>

      <View className="flex-1">
        {/* --- OPTIMIZATION 3: FlatList Performance Props --- */}
        <FlatList
          data={processedData}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // These props make the list smooth:
          initialNumToRender={10} 
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true} // Unmounts items off-screen
          renderItem={({ item }) => (
            <ReviewItem
              item={item}
              onFollow={handleFollow}
              onLike={handleLike}
              getDaysAgo={getDaysAgo}
              onCommentClick={(itm) => {
                setSelectedComment(itm);
                safeNavigation({
                  pathname: "/screens/commentscreen",
                  params: {
                    commentData: JSON.stringify(itm),
                    review: itm._id,
                    firmId: firmId,
                    restaurantName: params.restaurantName,
                    reviewType: reviewType,
                  },
                });
              }}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <View className="h-24" />
            )
          }
        />
      </View>

      <TouchableOpacity
        className="absolute bottom-6 left-4 right-4 rounded-full bg-primary shadow-lg"
        onPress={() =>
          safeNavigation({
            pathname: "/screens/Userrating",
            params: {
              firmId: firmId,
              restaurantName: params.restaurantName,
              currentUser: currentUserData,
              reviewType: reviewType,
            },
          })
        }
        activeOpacity={0.9}
      >
        <View className="flex-row items-center justify-center py-3">
          <MaterialIcons name="rate-review" size={20} color="#FFF" />
          <Text className="ml-2 text-sm font-semibold text-white">
            Write a Review
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Reviewsall;