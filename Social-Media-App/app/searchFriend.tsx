import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import ScreenWrapper from "@/components/ScreenWrapper";
import SearchHeader from "@/components/SearchHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { searchUsers } from "@/services/userService";
import { useInfiniteQuery } from "@tanstack/react-query";

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}

const UserItem = memo(({ item, theme, onDetail }: any) => {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.userItem}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => onDetail(item.id)}
      >
        <Avatar uri={item?.image} size={hp(6)} rounded={theme.radius.xxl} />
        <View style={styles.textContainer}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {item?.name}
          </Text>
          {item?.bio && (
            <Text
              style={[styles.userBio, { color: theme.colors.textLight }]}
              numberOfLines={1}
            >
              {item?.bio}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.moreButton}>
        <Icon name="threeDotsHorizontal" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const SearchFriend = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedText = useDebounce(searchText);

  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["searchUsers", debouncedText],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await searchUsers(debouncedText, user!.id, pageParam);

      return {
        data: res.data,
        nextPage: res.nextPage,
      };
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,

    enabled: !!debouncedText.trim(),
  });
  const results = data?.pages.flatMap((page) => page.data) || [];

  const handleDetail = useCallback((id: string) => {
    router.push({ pathname: "/profile", params: { userId: id } });
  }, []);

  const renderItem = useCallback(
    ({ item }: any) => (
      <UserItem item={item} theme={theme} onDetail={handleDetail} />
    ),
    [theme, handleDetail],
  );
  return (
    <ScreenWrapper bg={theme.colors.background}>
      <SearchHeader
        value={searchText}
        onChangeText={setSearchText}
        onClear={useCallback(() => setSearchText(""), [])}
      />

      {isLoading && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={theme.colors.primary}
        />
      )}

      <Animated.FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ListEmptyComponent={
          !isLoading && searchText.length > 0 ? (
            <Text style={[styles.noResults, { color: theme.colors.textLight }]}>
              Không tìm thấy người dùng nào
            </Text>
          ) : null
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    gap: 10,
  },
  backButton: {
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: hp(5.5),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: wp(3),
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    height: "100%",
    paddingVertical: 0,
  },
  clearButton: { padding: 4 },

  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    gap: 15,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  textContainer: { flex: 1, gap: 2 },
  userName: {
    fontSize: hp(1.8),
    fontWeight: "600",
  },
  userBio: {
    fontSize: hp(1.5),
  },
  moreButton: { padding: 8 },
  noResults: {
    textAlign: "center",
    marginTop: 40,
    fontSize: hp(1.8),
  },
});

SearchFriend.whydidYouRender = true;
export default SearchFriend;
