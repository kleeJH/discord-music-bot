const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError, embedInfo } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song."),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guildId);

    /// Check if the queue is empty
    if (!queue || !queue.currentTrack)
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Check if current song is paused
    if (!queue.node.isPlaying())
      return interaction.editReply({
        embeds: [embedInfo(`The song is already paused...`)],
      });

    // Pause the current song
    const success = queue.node.setPaused(true);

    // Return an embed to the user saying the song has been paused
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.pause.color)
      .setTitle(queue.currentTrack.title)
      .setURL(queue.currentTrack.url)
      .setAuthor({
        name: success ? `Song Paused!` : `Unable to pause song...`,
      })
      .setThumbnail(queue.currentTrack.thumbnail)
      .addFields(
        {
          name: "Author",
          value: queue.currentTrack.author,
          inline: true,
        },
        { name: "Paused by", value: `${interaction.member}`, inline: true }
      );

    return interaction.editReply({ embeds: [embed] });
  },
};
