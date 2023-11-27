const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError, embedInfo } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song."),
  async execute(interaction, client) {
    // Get the queue for the server
    const queue = useQueue(interaction.guildId);

    // Check if the queue is empty
    if (!queue || !queue.currentTrack)
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Check if the song is playing
    if (queue.node.isPlaying())
      return interaction.editReply({
        embeds: [embedInfo(`The song is already playing...`)],
      });

    // Resume the current song
    const success = queue.node.setPaused(false);

    // Return an embed to the user saying the song has been resume
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.resume.color)
      .setTitle(queue.currentTrack.title)
      .setURL(queue.currentTrack.url)
      .setAuthor({
        name: success ? `Song Resumed!` : `Unable to resume song...`,
      })
      .setThumbnail(queue.currentTrack.thumbnail)
      .addFields(
        { name: "Author", value: queue.currentTrack.author, inline: true },
        { name: "Resumed by", value: `${interaction.member}`, inline: true }
      );

    return interaction.editReply({ embeds: [embed] });
  },
};
