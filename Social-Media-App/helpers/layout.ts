import { Platform } from "react-native";

export const getTopOffset = (insets: any) => {
  if (Platform.OS === "ios") {
    return insets.top;
  }
  return insets.top + 5;
};
