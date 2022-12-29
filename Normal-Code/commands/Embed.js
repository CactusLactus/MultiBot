const { SlashCommandBuilder } = require("@discordjs/builders");
const { DefaultEmbed, SuccessEmbed } = require("../embeds");
const { Command } = require("../structures");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "embed",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Create a custom embed")
        .addStringOption((x) =>
          x
            .setName("description")
            .setDescription("Embed description")
            .setMaxLength(1024)
            .setRequired(true)
        )
        .addStringOption((x) =>
          x
            .setName("title")
            .setDescription("Embed title")
            .setMaxLength(128)
            .setRequired(false)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const description = interaction.options.getString("description", true);
    const title = interaction.options.getString("title", false);

    const embed = new DefaultEmbed().setDescription(description);
    if (title) embed.setTitle(title);
    await interaction.channel.send({ embeds: [embed] });
    await interaction.editReply({
      embeds: [
        new SuccessEmbed({ description: `Successfully made custom embed!` }),
      ],
    });
  }
};
