import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUserData } from "../services/userService";
const queryClient = new QueryClient();
const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const AppContent = () => {
  return (
    <>
      <MainLayout />
    </>
  );
};
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      // Chạy sau 1 khoảng thời gian cực ngắn để tránh lỗi "before mounting"
      setTimeout(() => {
        if (session) {
          setAuth(session?.user);
          updateUserData(session?.user, session?.user.email);
          router.replace("/drawer/home");
        } else {
          setAuth(null);
          router.replace("/welcome");
        }
      }, 5);
    });
  }, []);

  const updateUserData = async (user: User, email: string | undefined) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  // CHỈ TRẢ VỀ DUY NHẤT 1 NAVIGATOR Ở CẤP CAO NHẤT
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
        gestureEnabled: true, // Cho phép vuốt back cho iOS
      }}
    >
      {/* Màn hình chính là Drawer - Nơi có nút 3 gạch */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

      {/* Các màn hình con - Nằm ngoài Drawer để vuốt Back mượt mà */}
      <Stack.Screen name="postDetails" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="editProfile" />

      {/* Các màn hình Auth */}
      <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signUp" />
    </Stack>
  );
};

export default _layout;
