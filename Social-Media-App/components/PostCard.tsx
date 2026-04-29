import Icon from "@/assets/icons";
import { NOTIFICATION_TYPES } from "@/constants/notification";
import { theme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, stripHtmlTags } from "@/helpers/common";
import { getFormattedDate } from "@/helpers/dateFormat";
import { PostLike } from "@/models/postLikes";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { downloadFile, getSupabaseFileUrl } from "@/services/fileService";
import { createNotification } from "@/services/notificationService";
import {
  createPostLike,
  removePost,
  removePostLike,
} from "@/services/postService";
import { Image } from "expo-image";
import { Router, usePathname } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Avatar from "./Avatar";
import { VideoRender } from "./VideoRender";
interface PostCardProps {
  item: Post;
  currentUser: User;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  onDelete?: (postId: number) => void;
}
const VideoElement = ({ source }: { source: { uri: string } }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <VideoView
      player={player}
      style={[styles.postMedia, { height: hp(30) }]}
      nativeControls
      contentFit="cover"
    />
  );
};

const textStyle = {
  color: theme.colors.textLight,
  fontSize: hp(1.75),
};

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const tagsStyles = useMemo(
    () => ({
      div: { color: theme.colors.text, fontSize: hp(1.75) },
      p: { color: theme.colors.text, fontSize: hp(1.75) },
      ol: { color: theme.colors.text, fontSize: hp(1.75) },
      h1: { color: theme.colors.textDark },
      h4: { color: theme.colors.textDark },
    }),
    [theme],
  );
  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0 : 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, [item?.postLikes]);

  const liked = useMemo(
    () => likes.some((like) => like.userId == currentUser?.id),
    [likes, currentUser?.id],
  );

  const createdAt = useMemo(() => {
    return getFormattedDate(item?.created_at);
  }, [item?.created_at]);
  const pathName = usePathname();
  const openPostDetails = useCallback(() => {
    if (!showMoreIcon) return;
    if (pathName === "/postDetails") return;
    router.push({ pathname: "/postDetails", params: { postId: item?.id } });
  }, [showMoreIcon, item?.id]);

  const onLike = useCallback(async () => {
    if (loadingLike) return;

    setLoadingLike(true);
    const oldLikes = [...likes];

    if (liked) {
      setLikes((prev) =>
        prev.filter((l) => String(l.userId) !== String(currentUser.id)),
      );

      let res = await removePostLike(item.id as number, currentUser?.id);
      if (!res.success) {
        setLikes(oldLikes);
        Alert.alert("Lỗi", "Không thể bỏ thích bài viết");
      }
    } else {
      const newLike = { userId: currentUser.id, postId: item.id };
      setLikes((prev) => [...prev, newLike as any]);

      let res = await createPostLike({
        userId: currentUser.id,
        postId: item.id as any,
      });
      if (res.success) {
        if (currentUser.id !== item.userId) {
          await createNotification({
            receiverId: item.userId as string,
            senderId: currentUser.id as string,
            title: NOTIFICATION_TYPES.LIKE_POST,
            data: { postId: item.id },
          });
        }
      } else {
        setLikes(oldLikes);
        Alert.alert("Lỗi", "Không thể thích bài viết");
      }
    }
    setLoadingLike(false);
  }, [liked, likes, currentUser.id, item.id, loadingLike]);
  const onShare = useCallback(async () => {
    const content: { message: string; url?: string } = {
      message: stripHtmlTags(item?.body || "Check out this post!"),
    };
    if (item?.file && typeof item.file === "string") {
      const fileUrl = getSupabaseFileUrl(item.file);
      if (fileUrl?.uri) {
        const url = await downloadFile(fileUrl.uri);
        if (url) content.url = url;
      }
    }
    Share.share(content);
  }, [item?.body, item?.file]);
  const handleDeletePost = useCallback(async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa bài viết này không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const res = await removePost(item.id as number);
          if (res.success) {
            Alert.alert("Thành công", "Bài viết đã được xóa.");
            if (onDelete) {
              onDelete(item.id as number);
            }
            if (!onDelete && showMoreIcon) {
              router.back();
            }
          } else {
            Alert.alert("Lỗi", res.msg || "Không thể xóa bài viết.");
          }
        },
      },
    ]);
  }, [item.id, onDelete, showMoreIcon, router]);
  return (
    <View
      style={[
        styles.container,
        hasShadow && shadowStyles,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.gray,
        },
      ]}
    >
      <Pressable onPress={openPostDetails}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={hp(4.8)}
              uri={
                typeof item?.user?.image === "string"
                  ? item?.user?.image
                  : item?.user?.image?.uri || ""
              }
              rounded={theme.radius.md}
            />

            <View>
              <Text style={[styles.userName, { color: theme.colors.textDark }]}>
                {item.user?.name}
              </Text>

              <View style={{ flexDirection: "row", gap: 6 }}>
                <Text
                  style={[styles.postTime, { color: theme.colors.textLight }]}
                >
                  {createdAt}
                </Text>
                <Text style={{ color: theme.colors.textLight }}>•</Text>
              </View>
            </View>
          </View>

          {showMoreIcon && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setShowOptions(true);
              }}
            >
              <Icon
                name="threeDotsHorizontal"
                size={20}
                color={theme.colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {item?.body && (
          <Text style={[styles.contentText, { color: theme.colors.text }]}>
            {item.body}
          </Text>
        )}

        {typeof item?.file === "string" && (
          <View style={styles.mediaWrapper}>
            {item.file.includes("postVideos") ? (
              <VideoRender file={item.file} style={styles.postMedia} />
            ) : item.file.includes("postImages") ? (
              <Image
                source={{ uri: item.file }}
                transition={100}
                style={styles.postMedia}
                contentFit="cover"
              />
            ) : null}
          </View>
        )}
      </Pressable>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Icon
            name="heart"
            size={20}
            color={liked ? theme.colors.rose : theme.colors.textDark}
            fill={liked ? theme.colors.rose : "transparent"}
          />
          <Text style={{ color: theme.colors.textDark }}>{likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={openPostDetails}>
          <Icon name="comment" size={20} color={theme.colors.textDark} />
          <Text style={{ color: theme.colors.textDark }}>
            {(item?.comments?.[0] as any)?.count ?? item?.comments?.length ?? 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
          <Icon name="share" size={20} color={theme.colors.textDark} />
          <Text style={{ color: theme.colors.textDark }}>36</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: theme.colors.gray },
              ]}
            />
            {currentUser.id === item.userId ? (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setShowOptions(false);
                    router.push({
                      pathname: "/newPost",
                      params: {
                        id: item.id,
                        body: item.body,
                        file:
                          typeof item.file === "object"
                            ? JSON.stringify(item.file)
                            : item.file,
                      },
                    });
                  }}
                >
                  <Icon name="edit" size={20} color={theme.colors.text} />
                  <Text style={{ color: theme.colors.textDark }}>
                    Chỉnh sửa bài viết
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setShowOptions(false);
                    handleDeletePost();
                  }}
                >
                  <Icon name="delete" size={20} color={theme.colors.rose} />
                  <Text style={{ color: theme.colors.textDark }}>
                    Xóa bài viết
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.modalOption}>
                  <Icon name="circlePlus" size={20} color={theme.colors.text} />
                  <Text style={{ color: theme.colors.textDark }}>Quan tâm</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
const MemoizedPostCard = React.memo(PostCard);

if (process.env.NODE_ENV === "development") {
  (MemoizedPostCard as any).whyDidYouRender = true;
}

export default MemoizedPostCard;
const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    borderRadius: theme.radius.lg,
    padding: 12,
    borderWidth: 0.5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userName: {
    fontSize: hp(1.9),
    fontWeight: "600",
  },

  postTime: {
    fontSize: hp(1.5),
  },

  contentText: {
    marginTop: 8,
    fontSize: hp(1.85),
    lineHeight: hp(2.5),
  },

  mediaWrapper: {
    marginTop: 10,
  },

  postMedia: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.md,
  },

  reactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 7,
    paddingTop: 5,
    marginBottom: 5,
    paddingBottom: 5,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: "55%",
  },

  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
});
