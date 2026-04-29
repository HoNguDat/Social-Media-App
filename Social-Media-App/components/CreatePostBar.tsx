import Icon from "@/assets/icons";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CreatePostBar = ({ user }: any) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Image
        source={{
          uri: user?.image || "https://i.pravatar.cc/150?img=3",
        }}
        style={styles.avatar}
      />

      <TouchableOpacity
        style={[styles.inputBox, { backgroundColor: theme.colors.background }]}
        onPress={() => router.push("/newPost")}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.textLight }}>
            Bạn đang nghĩ gì?
          </Text>
          <Icon
            name={"image"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePostBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
    borderRadius: 16,
    marginBottom: hp(2),
  },
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    marginRight: wp(3),
  },
  inputBox: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: 999,
  },
});
