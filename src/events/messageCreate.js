module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      return;
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
