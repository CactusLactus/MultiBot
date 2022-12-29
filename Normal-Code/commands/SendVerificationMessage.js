const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("@discordjs/builders");
const { Command } = require("../structures");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "sendverifymessage",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("sendverifymessage")
        .setDescription("Send verification embed!"),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify")
        .setEmoji({
          name: this.client.config.verification.button.emoji,
        })
        .setLabel(this.client.config.verification.button.label)
        .setStyle(this.client.config.verification.button.style)
    );

    const embed = new EmbedBuilder(this.client.config.verification.embed);
    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
};
