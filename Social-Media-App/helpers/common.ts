import { Dimensions } from "react-native";
const getDimensions = () => {
  return Dimensions.get("window");
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
