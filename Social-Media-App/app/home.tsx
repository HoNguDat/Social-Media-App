import BottomTab from "@/components/BottomTab";
import HomeHeader from "@/components/HomeHeader";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { useScrollTabAnimation } from "@/hooks/useScrollTabAnimation";
import { supabase } from "@/lib/supabase";
import { Post } from "@/models/postModel";
import { fetchPostDetails, fetchPosts } from "@/services/postService";
import { getUserData } from "@/services/userService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
const Home = () => {
  const { translateY, scrollHandler } = useScrollTabAnimation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(4);

  const getPosts = async () => {
    if (!hasMore) return;

    let res = await fetchPosts(limit);
    if (res.success && res.data) {
      if (res.data.length === posts.length) {
        setHasMore(false);
      }
      setPosts(res.data);
      setLimit((prev) => prev + 4);
    }
  };
  const handlePostEvent = async (payload: any) => {
    console.log("Realtime Payload nhận được:", payload);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
    if (payload.eventType === "DELETE" && payload?.old?.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id),
      );
    }

    if (payload.eventType === "UPDATE") {
      // 1. Lấy dữ liệu đầy đủ nhất (bao gồm Likes, Comments, User) của bài viết này
      // Bạn nên dùng hàm fetchPostDetails (hoặc fetchPosts với filter ID)
      let res = await fetchPostDetails(payload.new.id);

      if (res.success && res.data) {
        const fullUpdatedPost = res.data;

        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            // So sánh ID và thay thế toàn bộ bằng dữ liệu mới nhất từ DB
            if (String(post.id) === String(fullUpdatedPost.id)) {
              return fullUpdatedPost;
            }
            return post;
          });
        });
        console.log("Đã cập nhật bài viết với đầy đủ Like/Comment mới!");
      }
    }
  };

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
  }, []);

  const handlePostDelete = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <HomeHeader user={user} />
        {user && (
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
            onEndReachedThreshold={0}
            keyExtractor={(item) => item.id?.toString() || ""}
            renderItem={({ item }: { item: Post }) => (
              <PostCard
                item={item}
                currentUser={user}
                router={router}
                onDelete={handlePostDelete}
              />
            )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold as any,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
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
