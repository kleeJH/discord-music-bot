const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription(
      "Stop the music player and yeets the bot out of the voice call."
    ),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guildId);
    const repeatMode = client.config.opt.queueRepeatMode; // REMOVE THIS IF REPEAT MODE FIX
    // const repeatMode = queue.repeatMode; // UNCOMMENT IF REPEAT MODE FIX

    // Check if there is no queue or not playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No queue found.`)],
      });

    // Turn off any replay mode before stopping bot
    if (repeatMode != QueueRepeatMode.OFF) {
      client.config.opt.queueRepeatMode = QueueRepeatMode.OFF; // REMOVE THIS IF REPEAT MODE FIX
      queue.setRepeatMode(QueueRepeatMode.OFF);
    }

    // Deletes all the songs from the queue and exits the channel
    queue.delete();

    // Send an embed response back to the user
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.vars.music.stop.color)
          .setDescription(
            `Why did you stop the music? ${interaction.member}, why? WHY?! `
          )
          .setFooter({
            text: "I will remember this...",
            iconURL: client.user.displayAvatarURL({
              size: 1024,
              dynamic: true,
            }),
          }),
      ],
    });
  },
};
