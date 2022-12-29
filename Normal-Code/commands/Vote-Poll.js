const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, DefaultEmbed } = require("../embeds/");
const Command = require("../structures/Command");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "vote-poll",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("vote-poll")
        .setDescription("Send us your suggestion!")
        .setDefaultMemberPermissions(32)
        .addStringOption((x) =>
          x
            .setName("content")
            .setDescription("Type here your message")
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

    const embed = new DefaultEmbed({
      author: {
        name: `${interaction.guild.name} - Vote Poll`,
        icon_url: interaction.guild.iconURL({ dynamic: true }),
      },
      description: content,
    });

    const msg = await interaction.channel.send({ embeds: [embed] });

    await msg.react("✅");
    await msg.react("❌");

    const success = new SuccessEmbed({
      description: "Successfully made an vote poll!",
    });

    interaction.editReply({ embeds: [success] });
  }
};
