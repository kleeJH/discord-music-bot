const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue, QueueRepeatMode } = require("discord-player");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription(`Shows first few songs in the queue!`),

  async execute(interaction, client) {
    const queue = useQueue(interaction.guildId);
    const queueDisplayLength = client.config.vars.music.queue.displayLength;
    const repeatMode = client.config.opt.queueRepeatMode; // REMOVE THIS IF REPEAT MODE FIX
    // const repeatMode = queue.repeatMode; // UNCOMMENT IF REPEAT MODE FIX

    // Check if there are songs in the queue
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Determine repeat mode
    const methods = ["Disabled", "Song", "Queue", "Autoplay"];

    // Number of songs
    const songs = queue.tracks.size;

    // Text for different loop modes
    const loopModeResponse = () => {
      songsLeft = `${
        songs != 0
          ? `${
              songs > queueDisplayLength
                ? `And **${songs - queueDisplayLength}** other song(s)...`
                : `Only **${songs}** song(s) left.`
            }`
          : ""
      }`;

      switch (repeatMode) {
        case QueueRepeatMode.OFF:
          return songsLeft;
        case QueueRepeatMode.TRACK:
          return `${songsLeft} Current song will **continue to play**.\nDo /loop disable to stop the loop.`;
        case QueueRepeatMode.QUEUE:
          return `${songsLeft} ${
            queueDisplayLength != 0
              ? `Songs from queue will be repeated after the current queue ends.`
              : `Current song will **continue to play**.\nDo /loop disable to stop the loop.`
          }`;
        case QueueRepeatMode.AUTOPLAY:
          return `${songsLeft} ${
            queueDisplayLength === 0
              ? `Autoplay will now be enabled.`
              : `When last song ends, similar songs will be played continuously.\nDo /loop disable to stop autoplay.`
          }`;
      }
    };

    // Queue song string
    const tracks = queue.tracks.map(
      (track, i) =>
        `**${i + 1})**\t【${track.duration}】 ${track.title} **━〈** ${
          track.author
        } **〉**`
    );

    // Return an embed to the user about the queue
    const embed = new EmbedBuilder()
      .setColor(client.config.vars.music.queue.color)
      .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
      .setAuthor({
        name: `${interaction.guild.name}'s Queue ${methods[repeatMode]}`,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setTitle(`**Current Song**`)
      .setDescription(
        `[${queue.currentTrack.title}](${queue.currentTrack.url}) **━〈** ${queue.currentTrack.author} **〉**\n\n`
      )
      .addFields(
        {
          name: "**Loop Mode**",
          value: `${methods[repeatMode]}`,
          inline: false,
        },
        {
          name: "**Queue**",
          value: `${
            songs != 0
              ? tracks.slice(0, queueDisplayLength).join("\n")
              : "*The queue is currently empty*"
          }\n\n${loopModeResponse()}`,
          inline: false,
        }
      )
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  },
};
