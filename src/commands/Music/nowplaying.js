const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("View currently playing song."),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild);

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Variables
    const repeatMode = client.config.opt.queueRepeatMode; // REMOVE THIS IF REPEAT MODE FIX
    // const repeatMode = queue.repeatMode; // UNCOMMENT IF REPEAT MODE FIX
    const track = queue.currentTrack;
    const timestamp = track.duration;
    const trackDuration =
      timestamp.progress == "Infinity" ? "Live" : track.duration;
    const progress = queue.node.createProgressBar();
    const methods = ["Disabled", "Song", "Queue", "Autoplay"];

    // Lyrics - Might be somewhat inaccurate
    var song;
    try {
      // Search and filter song
      const search = await genius.songs.search(`${queue.currentTrack.title}`);
      song = search.find((song) =>
        [
          queue.currentTrack.author
            .toLowerCase()
            .split(" - ")
            .includes(song.artist.name.toLowerCase()),
          song.artist.name.toLowerCase().split(" ").includes("romanizations"),
        ].some((x) => x)
      );
    } catch (error) {
      return interaction.editReply({
        embeds: [embedError(`Error! Please contact Developers!`)],
      });
    }

    // Build embed
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.queue.color)
      .setAuthor({ name: "Now Playing." })
      .setTitle(`${track.title}`)
      .setURL(track.url)
      .setThumbnail(track.thumbnail)
      .addFields(
        { name: "Progress", value: `${progress}`, inline: false },
        { name: "Duration", value: trackDuration, inline: true },
        {
          name: "Lyrics",
          value: `${!song ? "N/A" : `[Link](${song.url})`}`,
          inline: true,
        },
        { name: "Author", value: track.author, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Loop Mode: ${methods[repeatMode]}` });

    // Respond with embed
    await interaction.editReply({ embeds: [embed] });
  },
};
