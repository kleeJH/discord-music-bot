const { QueueRepeatMode } = require("discord-player");
module.exports = {
  app: {
    playing: "to your you ❤️",
  },
  opt: {
    autoShuffle: false, // Upon play, auto shuffle songs.
    volume: 10,
    maxVolume: 100,
    queueRepeatMode: QueueRepeatMode.OFF, // REMOVE THIS IF REPEAT MODE FIX
    discordPlayer: {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    },
  },
  vars: {
    music: {
      play: {
        color: "#52c41a",
      },
      pause: {
        color: "#faad14",
      },
      resume: {
        color: "#1677ff",
      },
      stop: {
        color: "#ff4d4f",
      },
      queue: {
        color: "#722ed1",
        displayLength: 8,
      },
      skip: {
        color: "#fa8c16",
      },
      shuffle: {
        color: "#eb2f96",
      },
      loop: {
        color: "#13c2c2",
      },
    },
  },
};
