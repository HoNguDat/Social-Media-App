import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { MediaFile } from "@/models/mediaFile";
import { getSupabaseFileUrl } from "@/services/fileService";
import { createOrUpdatePost } from "@/services/postService";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NewPost = () => {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [file, setFile] = useState<MediaFile>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.id) {
      setBody(String(params.body || ""));
      if (params.file) {
        let fileData = params.file as string;
        if (fileData.startsWith("{") || fileData.startsWith("[")) {
          try {
            setFile(JSON.parse(fileData));
          } catch (e) {
            setFile(fileData);
          }
        } else {
          setFile(fileData);
        }
      }
    } else {
      setBody("");
      setFile(null);
    }
  }, [params.id, params.body, params.file]);

  const isEdit = !!params.id;
  const onPick = useCallback(async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };
    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    if (!result.canceled) setFile(result.assets[0]);
  }, []);

  const isLocalFile = useCallback(
    (file: MediaFile): file is ImagePicker.ImagePickerAsset => {
      return typeof file === "object" && file !== null;
    },
    [],
  );

  const getFileType = useCallback(
    (file: MediaFile) => {
      if (!file) return null;
      if (isLocalFile(file)) return file.type === "video" ? "video" : "image";
      if (typeof file === "string") {
        const isVideo =
          file.includes("postVideos") ||
          file.toLowerCase().includes(".mp4") ||
          file.toLowerCase().includes(".mov");
        return isVideo ? "video" : "image";
      }
      return null;
    },
    [isLocalFile],
  );

  const getFileUri = useCallback(
    (file: MediaFile) => {
      if (!file) return null;

      if (isLocalFile(file)) return { uri: file.uri };

      if (typeof file === "string") {
        if (file.startsWith("http")) return { uri: file };
        return getSupabaseFileUrl(file);
      }
      return null;
    },
    [isLocalFile],
  );

  const uriObj = useMemo(() => getFileUri(file), [file, getFileUri]);
  const videoUri = useMemo(() => {
    if (!file) return null;
    if (isLocalFile(file)) return file.uri;
    if (typeof file === "string") {
      if (file.startsWith("http")) return file;
      const res = getSupabaseFileUrl(file);
      return res?.uri;
    }
    return null;
  }, [file, isLocalFile]);
  const handleVideoSetup = useCallback((player: any) => {
    player.loop = true;
  }, []);
  const player = useVideoPlayer(videoUri ?? "", handleVideoSetup);

  const onSubmit = useCallback(async () => {
    if (!body.trim() && !file) {
      Alert.alert("Bài viết", "Vui lòng thêm nội dung hoặc hình ảnh/video");
      return;
    }
    setLoading(true);
    const postData: any = {
      body,
      file,
      userId: user?.id,
      comments: [],
    };

    if (isEdit) postData.id = params.id;

    const res = await createOrUpdatePost(postData);
    setLoading(false);

    if (res.success) {
      setBody("");
      setFile(null);
      router.back();
    } else {
      Alert.alert("Lỗi", "Không thể lưu bài viết");
    }
  }, [body, file, user?.id, router, isEdit, params.id]);

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.container}>
        <Header title={isEdit ? "Chỉnh sửa bài viết" : "Bài viết mới"} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 15 }}
        >
          <View style={styles.header}>
            <Avatar
              uri={
                typeof user?.image === "string"
                  ? user.image
                  : user?.image?.uri || ""
              }
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={[styles.username, { color: theme.colors.textDark }]}>
                {user?.name}
              </Text>
              <Text
                style={[styles.publicText, { color: theme.colors.textLight }]}
              >
                Công khai
              </Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              multiline
              value={body}
              onChangeText={setBody}
              placeholder="Bạn đang nghĩ gì?"
              placeholderTextColor={theme.colors.textLight}
              style={[styles.input, { color: theme.colors.text }]}
              textAlignVertical="top"
            />
          </View>

          {file && (
            <View
              style={[
                styles.filePreview,
                { borderColor: theme.colors.gray, borderWidth: 1 },
              ]}
            >
              {getFileType(file) === "video" ? (
                <VideoView
                  player={player}
                  style={{ flex: 1 }}
                  nativeControls
                  contentFit="cover"
                />
              ) : (
                <Image source={uriObj} contentFit="cover" style={{ flex: 1 }} />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          )}
        </ScrollView>
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.gray,
            },
          ]}
        >
          <View style={styles.mediaIcons}>
            <TouchableOpacity
              onPress={() => onPick(true)}
              style={styles.iconButton}
            >
              <Icon name="image" size={28} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPick(false)}
              style={styles.iconButton}
            >
              <Icon name="video" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Button
            title={isEdit ? "Cập nhật" : "Đăng"}
            loading={loading}
            onPress={onSubmit}
            disabled={!body.trim() && !file}
            buttonStyle={styles.postBtn}
            hasShadow={false}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

(NewPost as any).whyDidYouRender = true;
export default React.memo(NewPost);

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(1.5) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold as any,
  },
  publicText: {
    fontSize: hp(1.7),
  },
  inputWrapper: { minHeight: hp(20) },
  input: { fontSize: hp(2.2), color: theme.colors.text, paddingTop: 10 },
  filePreview: {
    height: hp(35),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: 12,
    paddingBottom: hp(3.5),
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.gray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
  mediaIcons: { flexDirection: "row", gap: 15 },
  iconButton: { padding: 5 },
  postBtn: { width: wp(25), height: hp(5.2) },
});
