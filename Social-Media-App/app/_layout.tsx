import Icon from "@/assets/icons";
import DrawerContent from "@/components/DrawerContent";
import { theme } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { hp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer"; // Lưu ý: dùng từ expo-router/drawer
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    // Bắt buộc bao quanh bằng GestureHandlerRootView để Drawer hoạt động
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData, user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user: User, email: string | undefined) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Ẩn header mặc định của Drawer để dùng HomeHeader tự chế
        drawerActiveTintColor: theme.colors.primary,
        drawerType: "front", // Menu đè lên màn hình giống Facebook
        overlayColor: "rgba(0,0,0,0.5)", // Làm mờ màn hình khi mở menu
      }}
    >
      {/* 1. Trang Home chính */}
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Bảng feed",
          drawerIcon: ({ color }) => (
            <Icon name="home" size={hp(2.5)} color={color} />
          ),
        }}
      />

      {/* 2. Trang Post Details - Giữ nguyên trải nghiệm Modal */}
      <Drawer.Screen
        name="postDetails"
        options={{
          drawerItemStyle: { display: "none" },
          // Cấu hình để nó vẫn giống Modal nhất có thể
          swipeEnabled: false, // Rất quan trọng: Tránh việc đang vuốt xem ảnh lại lỡ tay kéo ra menu Drawer
          headerShown: false, // Chúng ta sẽ tự viết Header cho đẹp
        }}
      />

      {/* 3. Các trang khác (Notification, New Post...) */}
      <Drawer.Screen
        name="notification"
        options={{
          drawerLabel: "Thông báo",
          drawerIcon: ({ color }) => (
            <Icon name="heart" size={hp(2.5)} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default _layout;
