import React, { createContext } from "react";
import { makeMutable, SharedValue } from "react-native-reanimated";

export const TabAnimationContext = createContext<{
  translateY: SharedValue<number>;
} | null>(null);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const translateY = makeMutable(0);
  return (
    <TabAnimationContext.Provider value={{ translateY }}>
      {children}
    </TabAnimationContext.Provider>
  );
};
