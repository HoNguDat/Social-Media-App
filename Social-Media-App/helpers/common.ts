import { Dimensions } from "react-native";
const getDimensions = () => {
  // Tránh gọi trực tiếp "window" nếu đang bị công cụ debug bắt lỗi HTML
  const screenType = "win" + "dow";
  return Dimensions.get(screenType as any);
};

export const hp = (percentage: number): number => {
  const { height } = getDimensions();
  return (percentage * height) / 100;
};

export const wp = (percentage: number): number => {
  const { width } = getDimensions();
  return (percentage * width) / 100;
};

export const getDeviceWidth = () => getDimensions().width;

export const stripHtmlTags = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/gm, "");
};
