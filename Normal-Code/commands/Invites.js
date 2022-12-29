const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../structures/Command");
const { DefaultEmbed } = require("../embeds");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "invites",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription("Check your or other user invites")
        .addUserOption((x) =>
          x
            .setName("member")
            .setDescription("Who's invites do you want to see?")
            .setRequired(false)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply();

    const member =
      interaction.guild.members.cache.get(
        interaction.options.getUser("member", false)?.id
      ) || interaction.member;

    const { inviter, joins, leaves, fakes } = await this.client.invites.get(
      member.id
    );

    const embed = new DefaultEmbed({
      author: {
        name: member.displayName,
        icon_url: member.user.displayAvatarURL({ dynamic: true }),
      },
      description: `✨ ${member} has **${
        joins - leaves - fakes
      }** real invites. (**${joins}** joins, **${leaves}** leaves, **${fakes}** fakes) \n👤 Invited by: ${
        inviter ? "<@" + inviter + ">" : "**Unknown#0000**"
      }`,
      timestamp: Date.now(),
    });

    await interaction.editReply({ embeds: [embed] });
  }
};
