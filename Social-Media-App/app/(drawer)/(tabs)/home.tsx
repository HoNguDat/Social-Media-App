import CreatePostBar from "@/components/CreatePostBar";
import HomeHeader from "@/components/HomeHeader";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { useScrollTabAnimation } from "@/hooks/useScrollTabAnimation";
import { supabase } from "@/lib/supabase";
import { Post } from "@/models/postModel";
import { fetchPostDetails, fetchPosts } from "@/services/postService";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
const Home = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { scrollHandler } = useScrollTabAnimation();
  const navigation = useNavigation();
  const flatListRef = useRef<any>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = pageParam === 0 ? 20 : 10;
      const res = await fetchPosts(limit, pageParam as number);
      return Array.isArray(res) ? res : [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentLimit = allPages.length === 1 ? 20 : 10;
      if (!lastPage || lastPage.length < currentLimit) return undefined;
      const totalLoaded = allPages.reduce(
        (total, page) => total + page.length,
        0,
      );
      return totalLoaded;
    },
  });
  const handlePostEvent = useCallback(
    async (payload: any) => {
      if (payload.eventType === "INSERT" && payload?.new?.id) {
        let res: any = await fetchPostDetails(payload.new.id);
        const newPost = res.success ? res.data : payload.new;
        queryClient.setQueryData(["posts"], (oldData: any) => ({
          ...oldData,
          pages: [[newPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        }));
      }

      if (payload.eventType === "UPDATE") {
        let res: any = await fetchPostDetails(payload.new.id);
        if (res.success) {
          queryClient.setQueryData(["posts"], (oldData: any) => ({
            ...oldData,
            pages: oldData.pages.map((page: Post[]) =>
              page.map((p) => (p.id === res.data.id ? res.data : p)),
            ),
          }));
        }
      }

      if (payload.eventType === "DELETE" && payload?.old?.id) {
        queryClient.setQueryData(["posts"], (oldData: any) => ({
          ...oldData,
          pages: oldData.pages.map((page: Post[]) =>
            page.filter((p) => p.id !== payload.old.id),
          ),
        }));
      }
    },
    [queryClient],
  );

  useEffect(() => {
    const postChannel = supabase
      .channel("posts-room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [handlePostEvent]);

  const handlePostDelete = useCallback(
    (postId: number) => {
      queryClient.setQueryData(["posts"], (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: Post[]) =>
          page.filter((p) => p.id !== postId),
        ),
      }));
    },
    [queryClient],
  );

  const posts = data?.pages.flat() || [];
  const handleRefresh = async () => {
    await refetch();
  };
  const scrollToTopAndRefresh = useCallback(() => {
    const listNode = flatListRef.current?.scrollToOffset
      ? flatListRef.current
      : flatListRef.current?._component;

    if (listNode) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      listNode.scrollToOffset({
        offset: 0,
        animated: true,
      });
      setTimeout(() => {
        refetch();
      }, 200);
    }
  }, [refetch]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("scrollToTop" as any, () => {
      scrollToTopAndRefresh();
    });
    return unsubscribe;
  }, [navigation, scrollToTopAndRefresh]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        item={item}
        currentUser={user!}
        router={router}
        onDelete={handlePostDelete}
      />
    ),
    [user, handlePostDelete],
  );

  return (
    <ScreenWrapper bg={theme.colors.surface} canDismissKeyboard={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <HomeHeader user={user} />
        {user && (
          <Animated.FlatList<Post>
            ref={flatListRef}
            onScroll={scrollHandler}
            decelerationRate="fast"
            scrollEventThrottle={16}
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ""}
            ListHeaderComponent={<CreatePostBar user={user} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor={theme.colors.activity}
                colors={[theme.colors.activity]}
              />
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasNextPage ? (
                <View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
                  <Loading color={theme.colors.activity} />
                </View>
              ) : (
                <View style={{ marginVertical: 30 }}>
                  <Text style={styles.noPost}>No more posts</Text>
                </View>
              )
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    paddingHorizontal: wp(1),
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold as any,
  },
});
