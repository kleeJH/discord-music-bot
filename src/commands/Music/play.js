const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a song from YouTube!")
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("the search text")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Plays a playlist from YouTube!")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Plays a single song from YouTube!")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    // Make sure the user is inside a voice channel
    if (!interaction.member.voice.channel)
      return interaction.editReply({
        embeds: [
          embedError(`You need to be in a Voice Channel to play a song.`),
        ],
      });

    // Create a play queue for the server and set config volume
    const queue = await client.player.nodes.create(interaction.guild, {
      volume: client.config.opt.volume,
    });

    // Wait until you are connected to the channel
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    // PLAY VIA URL
    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      // Search for the song using the discord-player
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      // Finish if no tracks were found
      if (result.tracks.length === 0)
        return interaction.editReply({
          embeds: [embedError(`No results found from the given url.`)],
        });

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setColor(client.config.vars.music.play.color)
        .setAuthor({ name: "Song Added!" })
        .setTitle(`${song.title}`)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields(
          { name: "Duration", value: song.duration, inline: true },
          { name: "Requested by", value: `${interaction.member}`, inline: true }
        );
    }
    // PLAY VIA A PLAYLIST
    else if (interaction.options.getSubcommand() === "playlist") {
      // Search for the playlist using the discord-player
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.editReply({
          embeds: [embedError(`No playlist found with the given url.`)],
        });

      // Add the tracks to the queue
      const playlist = result.playlist;
      await queue.addTrack(result.tracks);

      embed
        .setColor(client.config.vars.music.play.color)
        .setAuthor({ name: "Playlist Added!" })
        .setTitle(`${playlist.title}`)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail)
        .addFields(
          {
            name: "Quantity",
            value: `${result.tracks.length}`,
            inline: true,
          },
          { name: "Requested by", value: `${interaction.member}`, inline: true }
        );
    }
    // PLAY VIA SEARCH
    else if (interaction.options.getSubcommand() === "search") {
      // Search for the song using the discord-player
      let searchText = interaction.options.getString("text");
      const result = await client.player.search(searchText, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      // Finish if no tracks were found
      if (result.tracks.length === 0)
        return interaction.editReply({
          embeds: [embedError(`No results from the search.`)],
        });

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setColor(client.config.vars.music.play.color)
        .setAuthor({ name: "Song Found and Added!" })
        .setTitle(`${song.title}`)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields(
          { name: "Duration", value: song.duration, inline: true },
          { name: "Requested by", value: `${interaction.member}`, inline: true }
        );
    }

    // Respond with the embed containing information about the player
    await interaction.editReply({
      embeds: [embed],
    });

    // Auto-shuffle (from config.js)
    if (client.config.opt.autoShuffle && queue.tracks.size > 2) {
      queue.tracks.shuffle();
    }

    // Play the song
    if (!queue.isPlaying()) await queue.node.play();
  },
};
