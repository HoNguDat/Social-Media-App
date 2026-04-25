import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, stripHtmlTags } from "@/helpers/common";
import { PostLike } from "@/models/postLikes";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { downloadFile, getSupabaseFileUrl } from "@/services/fileService";
import {
  createPostLike,
  removePost,
  removePostLike,
} from "@/services/postService";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import moment from "moment";
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

  const created_at = useMemo(
    () => moment(item.created_at).format("MMM D"),
    [item.created_at],
  );

  const openPostDetails = useCallback(() => {
    if (!showMoreIcon) return;
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
      // Giả định thêm like thành công
      const newLike = { userId: currentUser.id, postId: item.id };
      setLikes((prev) => [...prev, newLike as any]);

      let res = await createPostLike({
        userId: currentUser.id,
        postId: item.id as any,
      });
      if (!res.success) {
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
      <Pressable onPress={openPostDetails} style={styles.mainClickableArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={
                typeof item?.user?.image === "string"
                  ? item?.user?.image
                  : item?.user?.image?.uri || ""
              }
              rounded={theme.radius.md}
            />
            <View style={{ gap: 2 }}>
              <Text style={[styles.userName, { color: theme.colors.textDark }]}>
                {item.user?.name}
              </Text>
              <Text
                style={[styles.postTime, { color: theme.colors.textLight }]}
              >
                {created_at}
              </Text>
            </View>
          </View>
          {showMoreIcon && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setShowOptions(true);
              }}
              style={styles.moreIcon}
            >
              <Icon
                name="threeDotsHorizontal"
                size={hp(3.4)}
                strokeWidth={3}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View>
            {item?.body && (
              <Text
                style={[styles.contentBodyText, { color: theme.colors.text }]}
              >
                {item.body}
              </Text>
            )}
          </View>
          {typeof item?.file === "string" && (
            <View style={styles.postMedia}>
              {item.file.includes("postVideos") ? (
                /* Render Video */
                <VideoRender file={item.file} style={styles.postMedia} />
              ) : item.file.includes("postImages") ? (
                /* Render Ảnh */
                <Image
                  source={{ uri: item.file }}
                  transition={100}
                  style={styles.postMedia}
                  contentFit="cover"
                />
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              color={liked ? theme.colors.rose : theme.colors.textLight}
              fill={liked ? theme.colors.rose : "transparent"}
            />
          </TouchableOpacity>
          <Text style={[styles.count, { color: theme.colors.text }]}>
            {likes?.length}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={[styles.count, { color: theme.colors.text }]}>
            {(item?.comments?.[0] as any)?.count ?? item?.comments?.length ?? 0}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onShare}>
            <Icon name="share" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
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
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
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
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Chỉnh sửa bài viết
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
                  onPress={() => {
                    setShowOptions(false);
                    handleDeletePost();
                  }}
                >
                  <Icon name="delete" size={20} color={theme.colors.rose} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Xóa bài viết
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="circlePlus" size={20} color={theme.colors.text} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Quan tâm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon
                    name="circleMinus"
                    size={20}
                    color={theme.colors.text}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Không quan tâm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="cancel" size={20} color={theme.colors.text} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Ẩn bài viết
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { borderBottomColor: theme.colors.gray },
                  ]}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="share" size={20} color={theme.colors.text} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.textDark },
                    ]}
                  >
                    Sao chép liên kết
                  </Text>
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
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    borderWidth: 0.5,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: hp(2),
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: hp(1.5),
    paddingVertical: hp(1),
  },
  contentBodyText: {
    fontSize: hp(1.9),
    lineHeight: hp(2.4),
    textAlign: "left",
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    fontSize: hp(1.8),
  },
  mainClickableArea: {},
  moreIcon: {
    padding: 5,
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
    height: "55%", // Bạn có thể chỉnh lên 70% nếu muốn nhiều option hơn
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
  },
  modalOptionText: {
    fontSize: hp(1.8),
    fontWeight: "500",
  },
});
