import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import { NOTIFICATION_TYPES } from "@/constants/notification";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { Comment } from "@/models/comment";
import { Post } from "@/models/postModel";
import { createNotification } from "@/services/notificationService";
import {
  createComment,
  fetchPostDetails,
  removeComment,
} from "@/services/postService";
import { getUserData } from "@/services/userService";
import { User } from "@supabase/supabase-js";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const [post, setPosts] = useState<Post | null>(null);
  const inputRef = useRef<TextInput>(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { theme, isDarkMode } = useTheme();
  useEffect(() => {
    const commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment,
      )
      .subscribe();
    const postDeleteChannel = supabase
      .channel(`post-delete-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
          filter: `id=eq.${postId}`,
        },
        (payload) => {
          Alert.alert(
            "Thông báo",
            "Bài viết này đã bị xóa hoặc không còn tồn tại.",
            [{ text: "OK", onPress: () => router.replace("/drawer/home") }],
          );
        },
      )
      .subscribe();
    getPostDetails();
    return () => {
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(postDeleteChannel);
      setPosts(null);
      setStartLoading(true);
    };
  }, [postId]);
  const handleNewComment = async (payload: any) => {
    console.log("got new comment", payload.new);

    if (payload.new) {
      let newComment = { ...payload.new };
      const res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPosts((prevPost: Post | null) => {
        if (!prevPost) return null;

        return {
          ...prevPost,
          comments: [newComment, ...(prevPost.comments || [])],
        };
      });
    }
  };
  const getPostDetails = async () => {
    const id = Array.isArray(postId) ? postId[0] : postId;
    if (id) {
      let res = await fetchPostDetails(id);
      if (res.success) {
        console.log("Post details: " + res.data);
        setPosts(res.data);
      } else {
        Alert.alert("Lỗi", "Bài viết này không tồn tại.", [
          { text: "OK", onPress: () => router.replace("/drawer/home") },
        ]);
      }
      setStartLoading(false);
    }
  };
  const onNewComment = async () => {
    if (!commentRef.current || commentRef.current.trim() === "") return null;
    let data: Comment = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      if (user?.id && post?.userId && user.id !== post.userId) {
        await createNotification({
          receiverId: post.userId as string,
          senderId: user.id as string,
          title: NOTIFICATION_TYPES.COMMENT_POST,
          data: {
            postId: post.id,
            commentText: commentRef.current,
          },
        });
      }
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };
  const isComment = (item: any): item is Comment => {
    return item && typeof item === "object" && "user" in item;
  };
  const onDeleteComment = async (comment: Comment) => {
    if (!comment?.id) return;

    const res = await removeComment(comment.id);

    if (res.success) {
      setPosts((prevPost) => {
        if (!prevPost) return null;
        const updatedComments = prevPost.comments?.filter((c) => {
          return "id" in c && c.id !== comment.id;
        });
        return {
          ...prevPost,
          comments: updatedComments,
        };
      });
    }
  };
  const onDeletePost = async () => {};
  const onUpdatePost = async () => {};
  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>404 Not found !</Text>
      </View>
    );
  }
  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.container}>
        <Header title="Bài viết" showBackButton={true} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {post && (
            <PostCard
              item={{
                ...(post as Post),
                comments: [{ count: post?.comments?.length ?? 0 }],
              }}
              currentUser={user as User}
              router={router}
              hasShadow={false}
              showMoreIcon={true}
            />
          )}
          <View>
            {post?.comments?.map((comment) => {
              if (isComment(comment)) {
                return (
                  <CommentItem
                    key={comment.id?.toString()}
                    item={comment}
                    canDelete={
                      user?.id === comment.user?.id || user?.id === post.userId
                    }
                    onDelete={onDeleteComment}
                  />
                );
              }
              return null;
            })}

            {post?.comments?.length === 0 && (
              <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                Be first comment
              </Text>
            )}
          </View>
        </ScrollView>
        <View
          style={[
            styles.stickyInputContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.gray,
            },
          ]}
        >
          <Input
            inputRef={inputRef}
            placeholder="Type comment..."
            onChangeText={(value) => (commentRef.current = value)}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
              backgroundColor: isDarkMode ? theme.colors.surface : "white",
              borderWidth: 0.5,
              borderColor: theme.colors.gray,
            }}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name="send" color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(1.5),
  },
  stickyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderTopWidth: 0.5,
    marginBottom: Platform.OS === "ios" ? hp(2) : 0,
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
