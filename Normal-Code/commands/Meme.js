const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { Command } = require("../structures");
const { getImage } = require("random-reddit");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "meme",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Generates random meme"),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const meme = await getImage("dankmemes");

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Random meme from /r/dankmemes` })
      .setColor(Math.floor(Math.random() * 16777215))
      .setImage(meme);

    await interaction.editReply({ embeds: [embed] });
  }
};
