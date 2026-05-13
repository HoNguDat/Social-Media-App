import { hp } from "@/helpers/common";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const SAFE_BOTTOM = Platform.OS === "ios" ? hp(12) : hp(10);

export const toast = {
  success: (title: string) => {
    Toast.show({
      type: "fbToast",
      text1: title,
      position: "bottom",
      bottomOffset: SAFE_BOTTOM,
      visibilityTime: 3000,
    });
  },

  error: (title: string) => {
    Toast.show({
      type: "fbToast",
      text1: title || "Đã có lỗi xảy ra!",
      position: "bottom",
      bottomOffset: SAFE_BOTTOM,
    });
  },

  deleteInfo: (text: string, onUndo?: () => void) => {
    Toast.show({
      type: "fbToast",
      text1: text,
      position: "bottom",
      bottomOffset: SAFE_BOTTOM,
      visibilityTime: 5000,
      props: { onUndo },
    });
  },
};
