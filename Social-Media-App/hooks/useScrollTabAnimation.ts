import {
    useAnimatedScrollHandler,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export const useScrollTabAnimation = (threshold = 100) => {
  const translateY = useSharedValue(0);
  const lastOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;
      const diff = currentOffset - lastOffset.value;

      // Vuốt xuống (diff > 5) và đã scroll qua một khoảng threshold -> Ẩn Tab
      if (diff > 5 && currentOffset > threshold) {
        translateY.value = withTiming(100, { duration: 300 });
      }
      // Vuốt lên (diff < -5) -> Hiện Tab
      else if (diff < -5) {
        translateY.value = withTiming(0, { duration: 300 });
      }

      lastOffset.value = currentOffset;
    },
  });

  return { translateY, scrollHandler };
};
