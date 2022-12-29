const {
  SlashCommandBuilder,
  SelectMenuBuilder,
} = require("@discordjs/builders");
const DefaultEmbed = require("../embeds/DefaultEmbed");
const Command = require("../structures/Command");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SuccessEmbed } = require("../embeds");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "sendticketpanelmessage",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("sendticketpanelmessage")
        .setDescription("Make a reaction panel in current panel.")
        .setDefaultMemberPermissions(32)
        .addStringOption((x) =>
          x
            .setName("message")
            .setDescription("Type your panel message")
            .setRequired(false)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });

    let description = interaction.options.getString("message", false);

    if (!description)
      description = "📨 Click button below to open your ticket.";

    let options = [];
    let i = 0;
    for (let category of this.client.config.tickets.help_categories) {
      if (i > 7) break;
      options.push({
        label: category,
        description: `Help for ${category}`,
        value: category,
      });
      i++;
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId("open_ticket")
      .setPlaceholder("Select help category")
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const panel = new DefaultEmbed({
      title: "Support Ticket",
      description,
    });

    await interaction.channel.send({
      embeds: [panel],
      components: [row],
    });

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: "Successfully created reaction panel.",
        }),
      ],
    });
  }
};
