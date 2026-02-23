import { Router } from "expo-router"; // Hoặc kiểu dữ liệu từ thư viện navigation bạn dùng
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon from "../assets/icons"; // Đường dẫn đến file Icon trung tâm
import { theme } from "../constants/theme";

// 1. Định nghĩa kiểu dữ liệu cho Props
interface BackButtonProps {
  size?: number;
  router: Router; // Đối tượng router để thực hiện lệnh back()
}

const BackButton: React.FC<BackButtonProps> = ({ size = 26, router }) => {
  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.7 }, // Hiệu ứng khi nhấn
      ]}
    >
      <Icon
        name="arrowLeft"
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
