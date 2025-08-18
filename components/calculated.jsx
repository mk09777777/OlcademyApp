import { Fragment } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CalculatedStyles from "../styles/calculatedstyles";
import Entypo from '@expo/vector-icons/Entypo';

export default function RatingsCalculated({ toggle }) {
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.53)", justifyContent: "flex-end" }}>
      <View style={CalculatedStyles.background}>
        <View style={CalculatedStyles.headingContainer}>
          <TouchableOpacity style={CalculatedStyles.imgcontainer} onPress={toggle}>
            <Entypo name="circle-with-cross" size={34} color="#2f2f37" style={CalculatedStyles.crossimg} />
          </TouchableOpacity>
          <Text style={CalculatedStyles.headingText}>How are ratings calculated?</Text>
        </View>
        <View style={CalculatedStyles.informatoincontainer}>
          <Image source={require("../assets/images/dish.jpg")} style={CalculatedStyles.ratingimg} />
          <Text style={CalculatedStyles.ratingText}>
            The rating on Zomato is calculated based on a proprietary algorithm instead of a simple average of all reviews.
          </Text>
          <Text style={CalculatedStyles.ratingText}>
            This algorithm, aided by machine learning, takes into account recency of experiences and checks for spam or suspicious profiles to ensure genuine ratings.
          </Text>
          <TouchableOpacity onPress={toggle} style={CalculatedStyles.okaybutton}>
            <Text style={CalculatedStyles.okayText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
