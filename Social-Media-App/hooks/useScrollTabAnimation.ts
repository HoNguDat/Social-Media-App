import { TabAnimationContext } from "@/contexts/TabContext";
import { useContext } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
export const useScrollTabAnimation = () => {
  const TAB_HEIGHT = 80;
  const context = useContext(TabAnimationContext);
  if (!context) throw new Error("must be used in provider");

  const { translateY } = context;
  const lastOffsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const current = event.contentOffset.y;
      const diff = current - lastOffsetY.value;
      if (diff > 5 && current > 100) {
        translateY.value = withTiming(TAB_HEIGHT, {
          duration: 300,
        });
      }
      if (diff < -5) {
        translateY.value = withTiming(0, {
          duration: 350,
        });
      }

      lastOffsetY.value = current;
    },
  });

  return { translateY, scrollHandler };
};
