export const NOTIFICATION_TYPES = {
  LIKE_POST: "like_post",
  COMMENT_POST: "comment_post",

  FOLLOW_USER: "follow_user",
  FRIEND_REQUEST: "friend_request",
  FRIEND_ACCEPT: "friend_accept",

  ADMIN_ANNOUNCEMENT: "admin_announcement",
  SYSTEM_MAINTENANCE: "system_maintenance",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

interface NotificationUIConfig {
  label: string;
  icon: string;
  color: string;
  route: string;
}

export const notificationUIConfigs: Record<
  NotificationType,
  NotificationUIConfig
> = {
  [NOTIFICATION_TYPES.LIKE_POST]: {
    label: "đã thích bài viết của bạn.",
    icon: "heart",
    color: "#FF4D4D",
    route: "/postDetails",
  },
  [NOTIFICATION_TYPES.COMMENT_POST]: {
    label: "đã bình luận về bài viết của bạn.",
    icon: "comment",
    color: "#4A7BFF",
    route: "/postDetails",
  },
  [NOTIFICATION_TYPES.FOLLOW_USER]: {
    label: "đã bắt đầu theo dõi bạn.",
    icon: "userPlus",
    color: "#22C55E",
    route: "/profile",
  },
  [NOTIFICATION_TYPES.FRIEND_REQUEST]: {
    label: "đã gửi lời mời kết bạn.",
    icon: "users",
    color: "#A855F7",
    route: "/friendRequest",
  },
  [NOTIFICATION_TYPES.FRIEND_ACCEPT]: {
    label: "đã chấp nhận lời mời kết bạn.",
    icon: "userCheck",
    color: "#0EA5E9",
    route: "/profile",
  },
  [NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT]: {
    label: "vừa đăng một thông báo hệ thống.",
    icon: "megaphone",
    color: "#F59E0B",
    route: "/postDetails",
  },
  [NOTIFICATION_TYPES.SYSTEM_MAINTENANCE]: {
    label: "hệ thống sẽ bảo trì trong ít phút.",
    icon: "alertTriangle",
    color: "#64748B",
    route: "/",
  },
};
