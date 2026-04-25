import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { User } from "@/models/userModel";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader = ({ user }: HomeHeaderProps) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <Pressable onPress={handleOpenDrawer} style={styles.hamburgerBtn}>
          <Icon
            name={"listView"}
            size={hp(3)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>

        <Text style={[styles.title, { color: theme.colors.text }]}>LinkUp</Text>
      </View>
      <View style={styles.icon}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/newPost",
              params: { id: null, body: null, file: null },
            })
          }
        >
          <Icon
            name={"plus"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>
        <Pressable onPress={() => router.push("/searchFriend")}>
          <Icon
            name={"search"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>
        <Pressable>
          <Icon
            name={"messenger"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hamburgerBtn: {
    padding: 5,
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold as any,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
});
