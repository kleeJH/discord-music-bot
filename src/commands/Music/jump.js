const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jumps to a particular song in the queue!")
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("the position of the song in the queue")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild);
    const number = interaction.options.getNumber("number");

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Index number from songs in queue
    const index = number - 1;

    // Check if the index is a valid position in the queue
    var track;
    try {
      // Get the track
      track = queue.tracks.toArray()[index];
      if (!track.title)
        return interaction.editReply({
          embeds: [
            embedError(`This song does not seem to exist in the queue.`),
          ],
        });
    } catch (error) {
      return interaction.editReply({
        embeds: [
          embedError(
            `The given number is invalid. There are only ${queue.tracks.size} songs in the queue.\nUse /queue to see the positions of the songs.`
          ),
        ],
      });
    }

    // Jump to index
    queue.node.jump(index);

    // Respond with an embed
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.skip.color)
      .setTitle(track.title)
      .setURL(track.url)
      .setAuthor({
        name: `Jumped ${index} Song(s)! Now Playing.`,
      })
      .setThumbnail(track.thumbnail)
      .addFields(
        { name: "Author", value: track.author, inline: true },
        { name: "Jumped by", value: `${interaction.member}`, inline: true }
      );

    interaction.editReply({ embeds: [embed] });
  },
};
