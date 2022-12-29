const { ChannelType } = require("discord.js");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "interactionCreate",
      enabled: true,
    });
  }
  async run(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.channel.type === ChannelType.DM) return;
    await interaction.deferReply({ ephemeral: true });

    switch (interaction.customId) {
      case "verify": {
        try {
          await interaction.member.roles.add(
            this.client.config.verification.roles
          );

          await interaction.editReply({
            content: this.client.config.verification.success_msg,
            ephemeral: true,
          });
        } catch (error) {
          console.log(`[!] An error ocurred: ${error.stack}`);
        }
        break;
      }
    }
  }
};
