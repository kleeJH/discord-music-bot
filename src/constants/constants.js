const musicCommands = {
  "/play search": "Search a song and plays it.",
  "/play song": "Plays a single song from YouTube!",
  "/play playlist": "Plays a playlist from YouTube!",
  "/playnext": "Play the song you added next!",
  "/nowplaying": "View currently playing song.",
  "/queue": "Shows first few songs in the queue!",
  "/pause": "Pause current song.",
  "/resume": "Resume current song.",
  "/shuffle": "Shuffle song queue.",
  "/skip": "Skip current song.",
  "/jump": "Jump to a song in the queue.",
  "/remove": "Remove a song from the queue.",
  "/stop": "Stops the music bot entirely!",
  "/loop": "Loop the song, entire queue, autoplay to queue songs similar to the current song or disable loop.",
  "/boost": "Boost bass, vocals or default.",
};

module.exports = {
  musicCommands: musicCommands
};
