import { Dimensions } from "react-native";

// Lấy chiều rộng và chiều cao của màn hình thiết bị
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

/**
 * Tính toán chiều cao dựa trên phần trăm màn hình
 * @param percentage - Giá trị phần trăm (0 - 100)
 */
export const hp = (percentage: number): number => {
  return (percentage * deviceHeight) / 100;
};

/**
 * Tính toán chiều rộng dựa trên phần trăm màn hình
 * @param percentage - Giá trị phần trăm (0 - 100)
 */
export const wp = (percentage: number): number => {
  return (percentage * deviceWidth) / 100;
};
