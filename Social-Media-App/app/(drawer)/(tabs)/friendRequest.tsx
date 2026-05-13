import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { toast } from "@/constants/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import {
  fetchAcceptedFriends,
  fetchFriendRequests,
  respondToRequest,
} from "@/services/friendService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const FriendRequest = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewType, setViewType] = useState<"requests" | "friends">("requests");

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("friends-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friends",
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ["friendData"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const { data: listData, isLoading } = useQuery({
    queryKey: ["friendData", viewType, user?.id],
    queryFn: () =>
      viewType === "requests"
        ? fetchFriendRequests(user?.id!)
        : fetchAcceptedFriends(user?.id!),
    enabled: !!user?.id,

    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,

    select: (res: any) => res.data || [],
  });
  const mutation = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: "accepted" | "deleted";
    }) => respondToRequest(id, action),
    onSuccess: (res, variables) => {
      if (res.success) {
        toast.success(
          variables.action === "accepted"
            ? "Đã trở thành bạn bè"
            : "Đã gỡ lời mời",
        );
        queryClient.invalidateQueries({ queryKey: ["friendData"] });
      }
    },
  });

  const handleResponse = useCallback(
    (id: string, action: "accepted" | "deleted") => {
      mutation.mutate({ id, action });
    },
    [],
  );
  const renderItem = useCallback(
    ({ item }: any) => {
      const isRequest = viewType === "requests";
      const displayUser = isRequest
        ? item?.sender
        : item?.sender?.id === user?.id
          ? item?.receiver
          : item?.sender;

      if (!displayUser) return null;

      return (
        <View style={styles.requestItem}>
          <Image
            source={
              displayUser?.image
                ? { uri: displayUser.image }
                : require("../../../assets/images/defaultUser.png")
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {displayUser?.name}
              </Text>
              {isRequest && <Text style={styles.timeText}>1 tuần</Text>}
            </View>
            <View style={styles.actions}>
              {isRequest ? (
                <>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => handleResponse(item.id, "accepted")}
                  >
                    <Text style={styles.confirmText}>Xác nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleResponse(item.id, "deleted")}
                  >
                    <Text style={styles.deleteText}>Xóa</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Nhắn tin</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    },
    [viewType, user?.id, handleResponse, theme],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.noData}>
        <Text style={{ color: theme.colors.textLight }}>
          Không có dữ liệu hiển thị.
        </Text>
      </View>
    ),
    [theme],
  );

  return (
    <ScreenWrapper
      bg={theme.colors.surface}
      loading={isLoading || mutation.isPending}
    >
      <View style={styles.container}>
        <Header title="Bạn bè" showBackButton />
        <View style={styles.topTabs}>
          {["requests", "friends"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.tabBtn, viewType === type && styles.activeTab]}
              onPress={() => setViewType(type as any)}
            >
              <Text
                style={
                  viewType === type ? styles.activeTabText : styles.tabText
                }
              >
                {type === "requests" ? "Lời mời" : "Tất cả bạn bè"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {viewType === "requests" ? "Lời mời kết bạn" : "Tất cả bạn bè"}
          </Text>
        </View>

        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5), gap: hp(2) }}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </ScreenWrapper>
  );
};

export default React.memo(FriendRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
  },

  seeAllText: {
    fontSize: wp(4),
    color: "#2D88FF",
    fontWeight: "400",
  },

  requestItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginRight: wp(3),
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: wp(4.2),
    fontWeight: "600",
    flex: 1,
  },

  timeText: {
    fontSize: wp(3.5),
    color: "#8E8E93",
    marginLeft: wp(2),
  },

  mutual: {
    fontSize: wp(3.5),
    marginTop: 2,
    marginBottom: 4,
  },

  emptyMutual: {
    height: wp(4),
  },

  actions: {
    flexDirection: "row",
    marginTop: hp(1),
  },

  confirmBtn: {
    flex: 1,
    backgroundColor: "#1877F2",
    paddingVertical: hp(1),
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },

  confirmText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: wp(3.8),
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#3A3B3C",
    paddingVertical: hp(1),
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    color: "#E4E6EB",
    fontWeight: "600",
    fontSize: wp(3.8),
  },

  separator: {
    height: hp(2.5),
  },
  topTabs: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  tabBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E4E6EB",
  },
  activeTab: {
    backgroundColor: "#E7F3FF",
  },
  tabText: {
    color: "#050505",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#1877F2",
    fontWeight: "600",
  },
  noData: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(10),
  },
});
