import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("window");

const CommentStyles = StyleSheet.create({
    background: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignSelf: "stretch",
        padding: 5,
        backgroundColor:"white"
    },
    headingContainer: {
        display: "flex",
        justifyContent: "flex-start",
        padding: 10,
        flexDirection: "row"
    },
    headinImg: {
        marginRight: 12,
    },
    headingText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",

    },
    commentValuesContainer: {
        display: "flex",
        elevation: 10,
        marginTop: 1,
        marginBottom: 4,
    },
    commentContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: 1,
        backgroundColor: "#ffff",
        padding: 7,
        elevation: 15,
        height: "100%"
    },
    commeninputboc: {
        display: "flex",
        padding: 20,
        alignItems: "center",
        elevation: 20,
        backgroundColor: "#fff",
        height: "11%"
    },
    commentinputContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 20,
        backgroundColor: "white",
        padding: 5,
        elevation: 1,
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    commentInput: {
        flex: 1,
        paddingHorizontal: 10,
    },
    Post: {
        color: "#5d616d",
        fontSize: 16,
        marginRight: 14,
    },
    PostActive: {
        color: "blue",
        fontSize: 16,
        marginRight: 14,
     
    },
    commentNameContainer: {
        display: "flex",
        flexDirection: "column",
        paddingLeft:22,
        marginTop:20
    },
    commentName: {
        color: "black",
        fontSize: 16,
     
    },
    commentvalue: {
        marginTop: 10,
        color: "black",
        fontSize: 16,
   
    },
    commenttime: {
        color: "#6b7280ef",
        fontSize: 16,
        marginTop: 10,
    }
});

export default CommentStyles;
