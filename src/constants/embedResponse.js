const { EmbedBuilder } = require("discord.js");

const embedError = (message) =>
  new EmbedBuilder()
    .setColor("#ff4d4f")
    .setTitle("Error")
    .setDescription(message);
    
const embedWarning = (message) =>
  new EmbedBuilder()
    .setColor("#faad14")
    .setTitle("Warning")
    .setDescription(message);

const embedInfo = (message) =>
  new EmbedBuilder()
    .setColor("#1677ff")
    .setTitle("Info")
    .setDescription(message);

const embedSuccess = (message) =>
  new EmbedBuilder()
    .setColor("#52c41a")
    .setTitle("Success")
    .setDescription(message);

module.exports = {
  embedError: embedError,
  embedWarning: embedWarning,
  embedInfo: embedInfo,
  embedSuccess: embedSuccess,
};
