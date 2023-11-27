const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { embedError } = require("../../constants/embedResponse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boost")
    .setDescription("Boost bass, vocals or default.")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("the boost mode")
        .setRequired(true)
        .addChoices(
          { name: "default", value: "default" },
          { name: "bass", value: "boost_bass" },
          { name: "vocals", value: "boost_vocals" }
        )
    ),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild);
    const choice = interaction.options._hoistedOptions
      .map((x) => x.value)
      .toString();
    const embed = new EmbedBuilder().setColor(
      client.config.vars.music.play.color
    );

    // Check if there is a song currently playing
    if (!queue || !queue.isPlaying())
      return interaction.editReply({
        embeds: [embedError(`No song is currently playing.`)],
      });

    // Check if equalizer is not enabled for this track
    if (!queue.filters.equalizer)
      return interaction.editReply({
        embeds: [embedError(`Equalizer is not enabled for this track.`)],
      });

    // Map reapeat mode response
    const boostMode = {
      default: {
        title: "Default Equalizer Enabled!",
        description: "Toggled default filter.",
        tips: null,
        equalizer: queue.filters.equalizerPresets.Flat,
      },
      boost_bass: {
        title: "Bass Equalizer Enabled!",
        description: "Toggled bass boost filter.",
        tips: "Disable it using /boost default",
        equalizer: [
          { band: 0, gain: -0.075 },
          { band: 1, gain: -0.125 },
          { band: 2, gain: -0.125 },
          { band: 3, gain: 0.1 },
          { band: 4, gain: 0.1 },
          { band: 5, gain: 0.05 },
          { band: 6, gain: 0.075 },
          { band: 7, gain: 0 },
          { band: 8, gain: 0 },
          { band: 9, gain: 0 },
          { band: 10, gain: 0 },
          { band: 11, gain: 0 },
          { band: 12, gain: 0.125 },
          { band: 13, gain: 0.15 },
          { band: 14, gain: 0.05 },
        ],
      },
      boost_vocals: {
        title: "Vocals Equalizer Enabled!",
        description: "Toggled vocals boost filter.",
        tips: "Disable it using /boost default",
        equalizer: [
          { band: 0, gain: -0.2 },
          { band: 1, gain: -0.2 },
          { band: 2, gain: 0.2 },
          { band: 3, gain: 0.15 },
          { band: 4, gain: 0.1 },
          { band: 5, gain: -0.1 },
        ],
      },
    };

    // Change the boost mode
    switch (choice) {
      case "default": {
        if (queue.filters.equalizer.getEQ() === boostMode.default.equalizer)
          return interaction.editReply({
            embeds: [
              embedInfo(`Boost mode is already currently set to default.`),
            ],
          });

        queue.filters.equalizer.setEQ(boostMode.default.equalizer);
        break;
      }
      case "boost_bass": {
        queue.filters.equalizer.setEQ(boostMode.boost_bass.equalizer);
        break;
      }
      case "boost_vocals": {
        queue.filters.equalizer.setEQ(boostMode.boost_vocals.equalizer);
        break;
      }
    }

    // Return the embed
    embed
      .setTitle(boostMode[choice].title)
      .setDescription(boostMode[choice].description);

    if (boostMode[choice].tips) {
      embed.addFields({
        name: "Tips",
        value: boostMode[choice].tips,
      });
    }

    return interaction.editReply({
      embeds: [embed],
    });
  },
};
