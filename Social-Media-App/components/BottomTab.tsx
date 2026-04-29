import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { TabAnimationContext } from "@/contexts/TabContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp } from "@/helpers/common";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const BottomTab = ({ state, navigation }: BottomTabBarProps) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const context = useContext(TabAnimationContext);
  if (!context) {
    throw new Error("useScrollTabAnimation must be used within TabProvider");
  }

  const { translateY } = context;

  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(translateY.value, {
          duration: 350,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.bottomTab,
        animatedBarStyle,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.gray,
          paddingBottom: insets.bottom,
          height: hp(6) + insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (isFocused && route.name === "home") {
            navigation.emit({
              type: "scrollToTop",
              target: route.key,
            } as any);
          }
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            {route.name === "home" && (
              <Icon
                name="home"
                size={hp(3.2)}
                color={isFocused ? theme.colors.activity : theme.colors.text}
                fill={isFocused ? theme.colors.activity : "none"}
              />
            )}

            {route.name === "friendRequest" && (
              <Icon
                name="friendRequest"
                size={hp(3.2)}
                color={isFocused ? theme.colors.activity : theme.colors.text}
                fill={isFocused ? theme.colors.activity : "none"}
              />
            )}

            {route.name === "notification" && (
              <Icon
                name="notification"
                size={hp(3.2)}
                color={isFocused ? theme.colors.activity : theme.colors.text}
                fill={isFocused ? theme.colors.activity : "none"}
              />
            )}

            {route.name === "profile" && (
              <View
                style={[
                  styles.avatarWrapper,
                  isFocused && { borderColor: theme.colors.activity },
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
            )}
          </Pressable>
        );
      })}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
