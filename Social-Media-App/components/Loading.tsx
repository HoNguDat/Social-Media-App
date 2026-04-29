import { theme } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
interface LoadingProps {
  size?: "small" | "large";
  color?: string;
}
const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = theme.colors.activity,
}) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
