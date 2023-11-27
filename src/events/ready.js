const { ActivityType } = require(`discord.js`);
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is now online!`);
    client.user.setActivity({
      name: client.config.app.playing,
      type: ActivityType.Streaming,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  },
};
