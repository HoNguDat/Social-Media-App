import DrawerContent from "@/components/DrawerContent";
import { useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Platform } from "react-native";

export default function DrawerLayout() {
  const segments = useSegments() as string[];

  const isHome = segments[1] === "(tabs)" && segments[2] === "home";
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: isHome,
        swipeEdgeWidth: Platform.OS === "ios" ? 30 : 50,
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
}
