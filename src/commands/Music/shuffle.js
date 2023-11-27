const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the queue!"),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild);

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Check if there is more than one song
    if (queue.tracks.size < 1)
      return interaction.editReply({
        embeds: [
          embedError(
            `No song in the queue after the current one. Please add more songs!`
          ),
        ],
      });

    // Shuffle it
    queue.tracks.shuffle();

    // Return an embed to the user saying the queue has been shuffled
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.shuffle.color)
      .setAuthor({ name: `Shuffled ${queue.tracks.size} song(s)!` })
      .setDescription("Use **/queue** to check the new order.");

    return interaction.editReply({ embeds: [embed] });
  },
};
