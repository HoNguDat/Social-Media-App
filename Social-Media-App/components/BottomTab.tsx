import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hp } from "@/helpers/common";
import { User } from "@/models/userModel";
import { router, usePathname } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface BottomTabProps {
  translateY: SharedValue<number>;
  user: User | null;
}

const BottomTab = ({ translateY, user }: BottomTabProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isnewPost = pathname === "/newPost";
  const isprofile = pathname === "/profile";
  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bottomTab,
        animatedBarStyle,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.gray,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      <Pressable onPress={() => router.push("/home")} style={styles.tabItem}>
        <Icon
          name="home"
          size={hp(3)}
          color={isHome ? theme.colors.primary : theme.colors.text}
        />
      </Pressable>
      <Pressable onPress={() => console.log("video")} style={styles.tabItem}>
        <Icon name="video" size={hp(3)} color={theme.colors.text} />
      </Pressable>

      <Pressable onPress={() => router.push("/newPost")} style={styles.tabItem}>
        <Icon
          name="plus"
          size={hp(3)}
          color={isnewPost ? theme.colors.primary : theme.colors.text}
        />
      </Pressable>

      <Pressable
        onPress={() => console.log("notifications")}
        style={styles.tabItem}
      >
        <Icon name="heart" size={hp(3)} color={theme.colors.text} />
      </Pressable>

      <Pressable onPress={() => router.push("/profile")} style={styles.tabItem}>
        <View
          style={[
            styles.avatarWrapper,
            isprofile && { borderColor: theme.colors.primary, borderWidth: 2 },
          ]}
        >
          <Avatar
            size={hp(3.2)}
            uri={
              typeof user?.image === "string"
                ? user.image
                : user?.image?.uri || ""
            }
            rounded={theme.radius.sm}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  bottomTab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 0.5,
    // Đổ bóng (Shadow) trong Dark Mode nên mờ hơn hoặc tắt đi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: theme.radius.sm + 4,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
