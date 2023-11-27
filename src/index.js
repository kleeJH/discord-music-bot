const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require("fs");
require("dotenv").config();
const { Player, QueueRepeatMode } = require("discord-player");
const Genius = require("genius-lyrics");

// Client Configuration
global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  disableMentions: "everyone",
});
client.config = require("../config");
client.commands = new Collection();

// Player
client.player = new Player(client, client.config.opt.discordPlayer);
client.player.extractors.loadDefault();

// Player - Add functionality for /loop because QueueRepeatMode.TRACK and QueueRepeatMode.QUEUE using officla API is broken.
// REMOVE THIS BLOCK OF CODE WHEN REPEAT MODE IS FIXED
// Also, change code from nowplaying.js (line 11-12), queue.js (line 13-14), skip (line 12-13), stop.js (line 13-14) loop.js (where it says delete or uncomment code)
// Finally, remove code in config.js (line 12)
// REMOVE THIS BLOCK OF CODE WHEN REPEAT MODE IS FIXED
client.player.events.on("playerStart", (queue, track) => {
  const queueRepeatMode = client.config.opt.queueRepeatMode;

  switch (queueRepeatMode) {
    case QueueRepeatMode.OFF:
    case QueueRepeatMode.AUTOPLAY:
      break;
    case QueueRepeatMode.TRACK:
      queue.insertTrack(track, 0);
      break;
    case QueueRepeatMode.QUEUE:
      queue.addTrack(track);
      break;
  }
});

client.player.events.on('playerError', async (queue, track) => {
  await queue.node.play();
});

// Genius
global.genius = new Genius.Client();

// Prepare functions and events
const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

// Insert functions and events and login
(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.DISCORD_BOT_TOKEN);
})();
