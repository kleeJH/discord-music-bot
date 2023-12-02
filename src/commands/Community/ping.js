const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's response time"),
  async execute(interaction, client) {
    const reply = await interaction.fetchReply();
    const REPLY_PING = reply.createdTimestamp - interaction.createdTimestamp;
    const WS_PING = client.ws.ping;

    await interaction.editReply({
      content: `Pong! Client ${REPLY_PING}ms, Websocket ${WS_PING}ms :ping_pong:`,
    });
  },
};
