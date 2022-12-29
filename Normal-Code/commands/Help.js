const { SlashCommandBuilder } = require("@discordjs/builders");
const DefaultEmbed = require("../embeds/DefaultEmbed");
const { Command } = require("../structures");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help menu"),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const embed = new DefaultEmbed()
      .setTitle(`Help menu for bot ${this.client.user.username}`)
      .addFields([
        {
          name: "/apply",
          value: "Apply for available applications",
        },
        {
          name: "/meme",
          value: "Get a random meme from Reddit",
        },
        {
          name: "/ping",
          value: "Check the bot's ping",
        },
        {
          name: "/rank",
          value: "Check your level and rank",
        },
        {
          name: "/invites",
          value: "Check your invites",
        },
        {
          name: "/suggestion",
          value: "Send to us your suggestion",
        },
        {
          name: "🔒 Admin Only Commands",
          value: `
            \`/close\` - Close the user's ticket
            \`/embed\` - Create a custom embed
            \`/giveaway\` = Create or Manage giveaways
            \`/vote-poll\` = Create a vote poll
            \`/sendticketpanelmessage\` - Create your ticket panel
            \`/sendverificationmessage\` - Create your verification message
            `,
        },
      ]);
    await interaction.editReply({ embeds: [embed] });
  }
};
