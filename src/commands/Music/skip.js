const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue, QueueRepeatMode } = require("discord-player");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song!"),

  async execute(interaction, client) {
    const queue = useQueue(interaction.guildId);
    const repeatMode = client.config.opt.queueRepeatMode; // REMOVE THIS IF REPEAT MODE FIX
    // const repeatMode = queue.repeatMode; // UNCOMMENT IF REPEAT MODE FIX

    // Check if there is a queue
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`There are no more songs to skip!`)],
      });

    // Determine footer string from repeat modes
    var footer = "";
    switch (repeatMode) {
      case QueueRepeatMode.OFF:
        footer =
          queue.tracks.size > 0
            ? `Now playing: ${queue.tracks.data.at(0).title}.`
            : "No songs are left in the queue.";
        break;
      case QueueRepeatMode.TRACK:
        footer = "Loop Mode is currently set to Song.";
        break;
      case QueueRepeatMode.QUEUE:
        footer = "Loop Mode is currently set to Queue.";
        break;
      case QueueRepeatMode.AUTOPLAY:
        footer = "Autoplay is currently enabled.";
        break;
    }

    const currentSong = queue.currentTrack;

    // Skip the current song
    const success = queue.node.skip();

    // Return an embed to the user saying the song has been skipped
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.vars.music.skip.color)
          .setTitle(currentSong.title)
          .setURL(currentSong.url)
          .setAuthor({
            name: success ? `Song Skipped!` : `Unable to skip song...`,
          })
          .setThumbnail(currentSong.thumbnail)
          .addFields(
            { name: "Author", value: currentSong.author, inline: true },
            { name: "Skipped by", value: `${interaction.member}`, inline: true }
          )
          .setFooter({
            text: footer,
          }),
      ],
    });
  },
};
