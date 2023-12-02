const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError, embedInfo } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription(
      "Loop the song, entire queue, autoplay to queue songs similar to the current song or disable loop."
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("the loop mode")
        .setRequired(true)
        .addChoices(
          { name: "song", value: "enable_loop_song" },
          { name: "queue", value: "enable_loop_queue" },
          { name: "autoplay", value: "enable_autoplay" },
          { name: "disable", value: "disable_loop" }
        )
    ),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild);
    const repeatMode = client.config.opt.queueRepeatMode; // REMOVE THIS IF REPEAT MODE FIX
    // const repeatMode = queue.repeatMode; // UNCOMMENT IF REPEAT MODE FIX
    const choice = interaction.options._hoistedOptions
      .map((x) => x.value)
      .toString();
    const embed = new EmbedBuilder().setColor(
      client.config.vars.music.loop.color
    );

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Map reapeat mode response
    const loopModeResponse = {
      enable_loop_song: {
        title: "Song Loop Mode Enabled!",
        description:
          "The current song will be repeated endlessly!\nThe official API for this loop mode is not working as intended. A bootleg version was created to fix this.\n",
        tips: "You can end the loop with /loop disable",
      },
      enable_loop_queue: {
        title: "Queue Loop Mode Enabled!",
        description:
          "The whole queue will be repeated endlessly!\nThe official API for this loop mode is not working as intended. A bootleg version was created to fix this.\n",
        tips: "You can end the loop with /loop disable",
      },
      enable_autoplay: {
        title: "Autoplay Enabled!",
        description:
          "When last track ends, play similar tracks in the future if queue is empty.",
        tips: "You can end the loop with /loop disable",
      },
      disable_loop: {
        title: "Loop Mode Disabled!",
        description: "The queue will no longer be repeated!",
        tips: null,
      },
    };

    // REMOVE THIS BLOCK OF CODE IF REPEAT MODE FIX
    const repeatSongCleanUp = () => {
      queue.node.remove(0);
    };

    // Change the repeat mode
    switch (choice) {
      case "enable_loop_song": {
        if (repeatMode === QueueRepeatMode.TRACK)
          return interaction.editReply({
            embeds: [embedInfo(`Song loop mode already enabled.`)],
          });
        else if (repeatMode !== QueueRepeatMode.OFF)
          return interaction.editReply({
            embeds: [
              embedError(`Disable current loop mode using /loop disable`),
            ],
          });

        // This repeat mode is not working as intended.
        // It plays through the current song and replays the first song in the queue.
        // queue.setRepeatMode(QueueRepeatMode.TRACK); // UNCOMMENT IF REPEAT MODE FIX

        queue.insertTrack(queue.currentTrack, 0); // REMOVE THIS IF REPEAT MODE FIX
        client.config.opt.queueRepeatMode = QueueRepeatMode.TRACK; // REMOVE THIS IF REPEAT MODE FIX
        break;
      }
      case "enable_loop_queue": {
        if (repeatMode === QueueRepeatMode.QUEUE)
          return interaction.editReply({
            embeds: [embedInfo(`Queue loop mode already enabled.`)],
          });
        else if (repeatMode !== QueueRepeatMode.OFF)
          return interaction.editReply({
            embeds: [
              embedError(`Disable current loop mode using /loop disable`),
            ],
          });

        // This repeat mode is not working as intended.
        // It plays through the playlist and only replays the last song in the queue.
        // queue.setRepeatMode(QueueRepeatMode.QUEUE); // UNCOMMENT IF REPEAT MODE FIX

        queue.addTrack(queue.currentTrack); // REMOVE THIS IF REPEAT MODE FIX
        client.config.opt.queueRepeatMode = QueueRepeatMode.QUEUE; // REMOVE THIS IF REPEAT MODE FIX
        break;
      }
      case "enable_autoplay": {
        if (repeatMode === QueueRepeatMode.AUTOPLAY)
          return interaction.editReply({
            embeds: [embedInfo(`Autoplay already enabled.`)],
          });
        else if (repeatMode !== QueueRepeatMode.OFF)
          return interaction.editReply({
            embeds: [
              embedError(`Disable current loop mode using /loop disable`),
            ],
          });

        client.config.opt.queueRepeatMode = QueueRepeatMode.AUTOPLAY; // REMOVE THIS IF REPEAT MODE FIX
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        break;
      }
      case "disable_loop": {
        if (repeatMode === QueueRepeatMode.OFF)
          return interaction.editReply({
            embeds: [embedInfo(`Loop is already disabled.`)],
          });
        else if (repeatMode === QueueRepeatMode.TRACK) repeatSongCleanUp(); // REMOVE THIS IF REPEAT MODE FIX

        client.config.opt.queueRepeatMode = QueueRepeatMode.OFF; // REMOVE THIS IF REPEAT MODE FIX
        queue.setRepeatMode(QueueRepeatMode.OFF);
        break;
      }
    }

    // Return the embed
    embed
      .setTitle(loopModeResponse[choice].title)
      .setDescription(loopModeResponse[choice].description);

    if (loopModeResponse[choice].tips) {
      embed.addFields({
        name: "Tips",
        value: loopModeResponse[choice].tips,
      });
    }

    return interaction.editReply({
      embeds: [embed],
    });
  },
};
