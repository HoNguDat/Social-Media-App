import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import BottomTab from "@/components/BottomTab";
import PostCard from "@/components/PostCard";
import ScreenWrapper from "@/components/ScreenWrapper";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { useScrollTabAnimation } from "@/hooks/useScrollTabAnimation";
import { fetchPostsByUserId } from "@/services/postService";
import { getUserData } from "@/services/userService";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, isDarkMode } = useTheme();
  const { translateY, scrollHandler } = useScrollTabAnimation();

  const targetUserId = (userId as string) || currentUser?.id;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", targetUserId],
    queryFn: () => getUserData(targetUserId!),
    enabled: !!targetUserId,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", targetUserId],
    queryFn: () => fetchPostsByUserId(targetUserId!),
    enabled: !!targetUserId,
  });

  const user = userData?.success ? userData.data : null;
  const posts = postsData?.success ? postsData.data : [];
  const isMyProfile = user?.id === currentUser?.id;

  const onPostDelete = useCallback(
    (postId: number) => {
      queryClient.setQueryData(["userPosts", targetUserId], (old: any) => {
        if (!old || !old.success) return old;
        return {
          ...old,
          data: old.data.filter((p: any) => p.id !== postId),
        };
      });
    },
    [targetUserId, queryClient],
  );

  const postsList = useMemo(() => {
    if (!posts || posts.length === 0) {
      return (
        <View style={styles.noPostsContainer}>
          <Text style={[styles.infoText, { color: theme.colors.textLight }]}>
            Chưa có bài viết nào
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.postsListContainer}>
        {posts.map((item: any) => (
          <PostCard
            key={item.id}
            item={item}
            currentUser={currentUser!}
            router={router}
            onDelete={onPostDelete}
          />
        ))}
      </View>
    );
  }, [posts, currentUser, theme, onPostDelete, router]);

  const dynamicColors = {
    buttonBg: isDarkMode ? "rgba(255,255,255,0.1)" : theme.colors.gray,
    divider: isDarkMode ? "rgba(255,255,255,0.1)" : "#E4E6EB",
    cameraBtn: isDarkMode ? "#3A3B3C" : "#E4E6EB",
  };

  if (userLoading) {
    return (
      <ScreenWrapper bg={theme.colors.background}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!user) return null;

  return (
    <ScreenWrapper bg={theme.colors.background}>
      <View style={{ flex: 1 }}>
        <View style={styles.backButtonOverlay}>
          <BackButton router={router} />
        </View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.coverContainer}>
            <View
              style={[
                styles.coverPhoto,
                { backgroundColor: isDarkMode ? "#242526" : theme.colors.gray },
              ]}
            />
            <View
              style={[
                styles.avatarWrapper,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <Avatar
                uri={
                  typeof user?.image === "string"
                    ? user.image
                    : user?.image?.uri || ""
                }
                size={hp(15)}
                rounded={hp(7.5)}
                style={{ borderWidth: 4, borderColor: theme.colors.background }}
              />
              {isMyProfile && (
                <Pressable
                  style={[
                    styles.cameraIcon,
                    { backgroundColor: dynamicColors.cameraBtn },
                  ]}
                >
                  <Icon name="camera" size={18} color={theme.colors.text} />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.userInfoSection}>
            <Text style={[styles.userName, { color: theme.colors.textDark }]}>
              {user?.name}
            </Text>
            {user?.bio && (
              <Text style={[styles.bioText, { color: theme.colors.text }]}>
                {user.bio}
              </Text>
            )}

            <View style={styles.actionRow}>
              {isMyProfile ? (
                <>
                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Icon name="plus" size={20} color="white" strokeWidth={3} />
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      Thêm vào tin
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: dynamicColors.buttonBg },
                    ]}
                    onPress={() => router.push("/editProfile")}
                  >
                    <Icon name="edit" size={20} color={theme.colors.text} />
                    <Text
                      style={[styles.buttonText, { color: theme.colors.text }]}
                    >
                      Chỉnh sửa
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Icon
                      name="addFriend"
                      size={20}
                      color="white"
                      strokeWidth={2.5}
                    />
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      Thêm bạn bè
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: dynamicColors.buttonBg },
                    ]}
                  >
                    <Icon
                      name="messenger"
                      size={20}
                      color={theme.colors.text}
                    />
                    <Text
                      style={[styles.buttonText, { color: theme.colors.text }]}
                    >
                      Nhắn tin
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: dynamicColors.divider }]}
          />
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Icon name="location" size={20} color={theme.colors.textLight} />
              <Text style={[styles.detailText, { color: theme.colors.text }]}>
                Sống tại{" "}
                <Text
                  style={[styles.boldText, { color: theme.colors.textDark }]}
                >
                  {user?.address || "Chưa cập nhật"}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={[styles.detailText, { color: theme.colors.text }]}>
                Email:{" "}
                <Text
                  style={[styles.boldText, { color: theme.colors.textDark }]}
                >
                  {user?.email}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                height: 6,
                backgroundColor: dynamicColors.divider,
                marginTop: 20,
              },
            ]}
          />
          <View style={styles.postsHeader}>
            <View style={styles.postsHeaderLeft}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.textDark }]}
              >
                Tất cả bài viết
              </Text>
            </View>
            <Pressable>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                Bộ lọc
              </Text>
            </Pressable>
          </View>

          {postsLoading ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              color={theme.colors.primary}
            />
          ) : (
            postsList
          )}
        </Animated.ScrollView>

        <BottomTab translateY={translateY} user={currentUser} />
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: { paddingBottom: hp(15) },
  backButtonOverlay: {
    position: "absolute",
    left: wp(4),
    top: hp(1.5),
    zIndex: 10,
  },
  coverContainer: { height: hp(25), width: "100%", position: "relative" },
  coverPhoto: { height: hp(20), width: "100%" },
  avatarWrapper: {
    position: "absolute",
    bottom: 0,
    left: wp(4),
    padding: 4,
    borderRadius: hp(10),
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 5,
    padding: 8,
    borderRadius: 20,
  },
  userInfoSection: { paddingHorizontal: wp(4), marginTop: hp(1) },
  userName: { fontSize: hp(3), fontWeight: "800" },
  bioText: { fontSize: hp(1.8), marginTop: 5 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  button: {
    flex: 1,
    height: hp(5),
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: { fontWeight: "700", fontSize: hp(1.7) },
  divider: { height: 1, marginVertical: 20 },
  detailsSection: { paddingHorizontal: wp(4), gap: 15 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailText: { fontSize: hp(1.8) },
  boldText: { fontWeight: "700" },
  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: 15,
  },
  sectionTitle: { fontSize: hp(2.2), fontWeight: "700" },
  postsListContainer: { paddingHorizontal: wp(4), gap: 15 },
  noPostsContainer: {
    height: hp(15),
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: { fontSize: hp(1.7) },
  postsHeaderLeft: { flexDirection: "row", alignItems: "center" },
});
