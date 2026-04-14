import { getSupabaseFileUrl } from "@/services/fileService";
import { useVideoPlayer, VideoView } from "expo-video";

export const VideoRender = ({ file, style }: { file: string; style: any }) => {
  const videoUri = file.startsWith("http")
    ? file
    : getSupabaseFileUrl(file)?.uri;
  const player = useVideoPlayer(videoUri || "");

  return (
    <VideoView
      player={player}
      style={style}
      contentFit="cover"
      nativeControls
      allowsFullscreen
    />
  );
};
