const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, ErrorEmbed } = require("../embeds");
const Command = require("../structures/Command");

var isTicketChannel = false;
var ticketCreator;

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "close",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Close a user's ticket.")
        .setDefaultMemberPermissions(32),
    });
  }
  async execute(interaction) {
    await interaction.deferReply();

    const indexes = this.client.tickets.indexes;

    for (var index of indexes) {
      const ticket = this.client.tickets.get(index);
      if (ticket?.channel !== interaction.channel.id) continue;
      isTicketChannel = true;
      ticketCreator = index;
    }

    if (!isTicketChannel)
      return interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: `This channel is not a ticket!`,
            ephemeral: true,
          }),
        ],
      });

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Ticket ${interaction.channel} will be closed in **5** seconds.`,
        }),
      ],
    });

    setTimeout(async () => {
      try {
        await interaction.channel.delete();
        await this.client.tickets.delete(ticketCreator);
      } catch (error) {
        if (interaction)
          await interaction.editReply({
            embeds: [
              new ErrorEmbed({
                description: `Unable to delete the channel, please check bot's permissions.`,
              }),
            ],
            ephemeral: true,
          });
      }
    }, 5000);
  }
};
