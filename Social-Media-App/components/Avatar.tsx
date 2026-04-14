import { Image } from "expo-image";
import React from "react";
import { ImageStyle, StyleProp, StyleSheet } from "react-native";

import { getUserImageSrc } from "@/services/fileService";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

interface AvatarProps {
  uri: string;
  size?: number;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
}

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style,
}: AvatarProps) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded,
        },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
