const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, DefaultEmbed } = require("../embeds/");
const Command = require("../structures/Command");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "suggestion",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("suggestion")
        .setDescription("Send us your suggestion!")
        .addStringOption((x) =>
          x
            .setName("content")
            .setDescription("Type here your suggestion")
            .setRequired(true)
            .setMinLength(16)
            .setMaxLength(512)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });

    const content = interaction.options.getString("content");

    const suggestion = new DefaultEmbed({
      author: {
        name: `New suggestion from ${interaction.user.tag}`,
        icon_url: interaction.user.pfp,
      },
      description: content,
    });

    try {
      const x = await interaction.guild.channels.cache
        .get(this.client.config.suggestions.channel_id)
        .send({ embeds: [suggestion] });
      await x.react("👍");
      await x.react("👎");
    } catch (error) {
      return interaction.editReply({
        content: "An error occured while sending your suggestion.",
      });
    } finally {
      const success = new SuccessEmbed({
        description: "Successfully sent your suggestion to server staff.",
      });
      await interaction.editReply({
        embeds: [success],
      });
    }
  }
};
