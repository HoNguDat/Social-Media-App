import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("PostID", postId);
  return (
    <View>
      <Text>Post details</Text>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});
