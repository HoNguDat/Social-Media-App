import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
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
  const isHome = pathname === "/drawer/home";
  const isnewPost = pathname === "/newPost";
  const isprofile = pathname === "/profile";
  const isnotification = pathname === "/notification";
  const isFriendRequest = pathname === "/friendRequest";
  const activeColor = "rgb(21, 156, 255)";
  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bottomTab,
        animatedBarStyle,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      {/* Tab Home */}
      <Pressable
        onPress={() => router.push("/drawer/home")}
        style={styles.tabItem}
      >
        <Icon
          name="home"
          size={hp(3.2)}
          color={isHome ? activeColor : theme.colors.text}
          fill={isHome ? activeColor : "none"}
        />
      </Pressable>
      <Pressable
        onPress={() => router.push("/friendRequest")}
        style={styles.tabItem}
      >
        <Icon
          name="friendRequest"
          size={hp(3.2)}
          color={isFriendRequest ? activeColor : theme.colors.text}
          fill={isFriendRequest ? activeColor : "none"}
        />
      </Pressable>

      {/* Tab Notification */}
      <Pressable
        onPress={() => router.push("/notification")}
        style={styles.tabItem}
      >
        <Icon
          name="notification"
          size={hp(3.2)}
          color={isnotification ? activeColor : theme.colors.text}
          fill={isnotification ? activeColor : "none"}
        />
      </Pressable>
      <Pressable onPress={() => router.push("/profile")} style={styles.tabItem}>
        <View
          style={[
            styles.avatarWrapper,
            isprofile && { borderColor: activeColor },
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: hp(8),
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
});
