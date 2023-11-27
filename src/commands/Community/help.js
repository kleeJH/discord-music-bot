const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  musicCommands
} = require("../../constants/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See a help menu."),
  async execute(interaction, client) {
    // Stop bots from interacting with the bot
    if (interaction.user.bot) {
      await interaction.editReply({
        content: "You are a bot! You don't get to use me...",
      });
      return;
    }

    // Function to properly format in to strings
    function appendDct(dct, sort = false) {
      res = [];
      keys = Object.keys(dct);

      if (sort) {
        keys.sort();
      }

      for (let i = 0; i < keys.length; i++) {
        item = `• ${keys[i]} - ${dct[keys[i]]}\t`;
        if (i == keys.length - 1) {
          res.push(`${item}\n\n`);
        } else {
          res.push(`${item}\n`);
        }
      }
      return res.join(" ");
    }

    output = [
      ">>>",
      "**Bot's Help Menu**\n\n",,
    ];

    // Music Commands
    output.push("**Music Commands**\n");
    output.push(`${appendDct(musicCommands, true)}`);

    // Return output string
    await interaction.editReply(output.join(" "));
  },
};
