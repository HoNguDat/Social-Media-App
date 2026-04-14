import BottomTab from "@/components/BottomTab";
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
import { getUserData } from "@/services/userService";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
const Home = () => {
  const { theme } = useTheme();
  const { translateY, scrollHandler } = useScrollTabAnimation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(4);

  const getPosts = useCallback(async () => {
    if (!hasMore) return;
    let res = await fetchPosts(limit);
    if (res.success && res.data) {
      if (res.data.length === posts.length) setHasMore(false);
      setPosts(res.data);
      setLimit((prev) => prev + 4);
    }
  }, [hasMore, limit, posts.length]);
  const handlePostEvent = useCallback(async (payload: any) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let res = await fetchPostDetails(payload.new.id);

      if (res.success && res.data) {
        const newFullPost = res.data;
        setPosts((prevPosts) => [newFullPost, ...prevPosts]);
      } else {
        let newPost = { ...payload.new };
        let userRes = await getUserData(newPost.userId);
        newPost.user = userRes.success ? userRes.data : {};
        newPost.postLikes = [];
        newPost.comments = [{ count: 0 }];
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
    }

    if (payload.eventType === "UPDATE") {
      console.log("Realtime Update triggered for ID:", payload.new.id);
      let res = await fetchPostDetails(payload.new.id);

      if (res.success && res.data) {
        const fullUpdatedPost = res.data;

        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            if (String(post.id) === String(fullUpdatedPost.id)) {
              return fullUpdatedPost;
            }
            return post;
          });
        });
      }
    }

    if (payload.eventType === "DELETE" && payload?.old?.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id),
      );
    }
  }, []);

  useEffect(() => {
    const postChannel = supabase
      .channel("posts-room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent,
      )
      .subscribe();
    getPosts();
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [handlePostEvent]);

  const handlePostDelete = useCallback((postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  }, []);
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
    <ScreenWrapper bg={theme.colors.background}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <HomeHeader user={user} />
        {user !== null && (
          <Animated.FlatList<Post>
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            data={posts}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listStyle}
            onEndReached={() => {
              getPosts();
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item) => item.id?.toString() || ""}
            renderItem={renderItem}
            removeClippedSubviews={true}
            ListFooterComponent={
              hasMore ? (
                <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                  <Loading />
                </View>
              ) : (
                <View style={{ marginVertical: 30 }}>
                  <Text style={styles.noPost}>No more posts</Text>
                </View>
              )
            }
          />
        )}
        <BottomTab translateY={translateY} user={user} />
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
    paddingTop: 20,
    paddingHorizontal: wp(4),
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
