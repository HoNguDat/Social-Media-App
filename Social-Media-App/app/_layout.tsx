import { showNotificationBanner } from "@/components/NotificationBanner";
import { toastConfig } from "@/components/ToastConfig";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TabProvider } from "@/contexts/TabContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { registerForPushNotificationsAsync } from "../services/notificationService";
import { getUserData } from "../services/userService";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const _layout = () => {
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TabProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <MainLayout />
                <Toast config={toastConfig} />
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </TabProvider>
      </SafeAreaProvider>
      <FlashMessage
        position="top"
        floating
        animationDuration={300}
        statusBarHeight={0}
        style={{
          backgroundColor: "transparent",
          marginTop: insets.top,
        }}
      />
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [isAppReady, setIsAppReady] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      registerForPushNotificationsAsync(session.user.id);
      const responseSubscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data as {
            type?: string;
            postId?: string | number;
          };
          if (data?.postId) {
            router.push({
              pathname: "/postDetails",
              params: { postId: data.postId },
            });
          }
        });
      const channel = supabase
        .channel("realtime_notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `receiverId=eq.${session.user.id}`,
          },
          async (payload) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            const { data: senderData } = await supabase
              .from("users")
              .select("name, image")
              .eq("id", payload.new.senderId)
              .single();

            showNotificationBanner({
              title: payload.new.title,
              userName: senderData?.name || "Người dùng PureHub",
              userAvatar: payload.new.senderAvatar,
              postId: payload.new.data?.postId,

              onPress: () => {
                if (payload.new.data?.postId) {
                  router.push({
                    pathname: "/postDetails",
                    params: {
                      postId: payload.new.data.postId.toString(),
                    },
                  });
                }
              },
            });
          },
        )
        .subscribe();

      return () => {
        responseSubscription.remove();
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsAppReady(true);
    };

    prepare();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAppReady) return;

    const isGuestPage =
      segments[0] === "welcome" ||
      segments[0] === "login" ||
      segments[0] === "signUp";
    const isUserPage =
      segments[0] === "(drawer)" ||
      segments[0] === "postDetails" ||
      segments[0] === "editProfile" ||
      segments[0] === "searchFriend" ||
      segments[0] === "newPost";

    if (session) {
      setAuth(session.user);
      updateUserData(session.user, session.user.email);
      if (isGuestPage || !isUserPage) {
        router.replace("/(drawer)/(tabs)/home");
      }
    } else {
      setAuth(null);
      if (!isGuestPage) {
        router.replace("/welcome");
      }
    }

    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, [isAppReady, session, segments]);

  const updateUserData = async (user: User, email: string | undefined) => {
    if (!user) return;
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  if (!isAppReady) return null;
  const isDarkMode = theme.colors.background.toLowerCase() === "#121212";
  const statusBarStyle = isDarkMode ? "light" : "dark";
  return (
    <>
      <StatusBar style={statusBarStyle} key={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="signUp" />

        <Stack.Screen name="postDetails" options={{ gestureEnabled: true }} />
        <Stack.Screen name="editProfile" options={{ gestureEnabled: true }} />
        <Stack.Screen name="newPost" />
        <Stack.Screen name="searchFriend" />
      </Stack>
    </>
  );
};

export default _layout;
