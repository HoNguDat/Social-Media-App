import * as Audio from "expo-audio";

const notificationSource = require("../assets/sounds/notification.mp3");
const player = Audio.createAudioPlayer(notificationSource);

export const playNotificationSound = () => {
  try {
    if (player.playing) {
      player.seekTo(0);
    }
    player.play();
  } catch (error) {
    console.log("Lỗi phát âm thanh:", error);
  }
};
