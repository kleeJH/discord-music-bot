const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType, useMainPlayer, useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playnext")
    .setDescription("Play the song you added next!")
    .addStringOption((option) =>
      option.setName("song").setDescription("a text or a url").setRequired(true)
    ),

  async execute(interaction, client) {
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild);

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.\nUse /play first.`)],
      });

    const userInput = interaction.options.getString("song");

    // Search song
    const res = await player.search(userInput, {
      requestedBy: interaction.member,
      searchEngine: QueryType.AUTO,
    });

    // Check if results found
    if (!res || !res.tracks.length)
      return interaction.editReply({
        embeds: [embedError(`No results found.`)],
      });

    const song = res.tracks[0];

    // Playlist is not allowed
    if (res.playlist)
      return interaction.editReply({
        embeds: [
          embedError(
            `This command does not support adding songs from a playlist.\nUse /play playlist instead!`
          ),
        ],
      });

    // Insert track at first position of queue
    queue.insertTrack(song, 0);

    // Respond with embed
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.vars.music.play.color)
          .setAuthor({ name: "This song will be playing next!" })
          .setTitle(`${song.title}`)
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
          .addFields(
            { name: "Duration", value: song.duration, inline: true },
            { name: "Request by", value: `${interaction.member}`, inline: true }
          ),
      ],
    });
  },
};
