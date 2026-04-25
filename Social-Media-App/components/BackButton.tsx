import { useTheme } from "@/contexts/ThemeContext";
import { Router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon from "../assets/icons";

interface BackButtonProps {
  size?: number;
  router: Router;
}

const BackButton: React.FC<BackButtonProps> = ({ size = 26, router }) => {
  const { theme, isDarkMode } = useTheme();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/drawer/home");
    }
  };
  return (
    <Pressable
      onPress={handleBack}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.07)",
        },
        pressed && { opacity: 0.7 },
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
    borderRadius: 10,
  },
});
