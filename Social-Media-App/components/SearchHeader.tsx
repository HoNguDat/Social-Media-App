import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import BackButton from "./BackButton";

interface SearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showBackButton?: boolean;
}

const SearchHeader = ({
  value,
  onChangeText,
  onClear,
  placeholder = "Tìm kiếm bạn bè...",
  showBackButton = true,
}: SearchHeaderProps) => {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: isDarkMode
              ? theme.colors.surface
              : theme.colors.gray,
            marginLeft: showBackButton ? wp(12) : 0,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          style={[styles.searchInput, { color: theme.colors.text }]}
          autoFocus={true}
          returnKeyType="search"
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Icon name="delete" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    gap: 10,
  },
  backButton: {
    position: "absolute",
    left: wp(4),
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: hp(5.5),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xl,
    paddingHorizontal: wp(3),
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    height: "100%",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
});
