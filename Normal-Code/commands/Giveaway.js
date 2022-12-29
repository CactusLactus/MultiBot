const Command = require("../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, DefaultEmbed, ErrorEmbed } = require("../embeds");
const moment = require("moment");
const setup = require("moment-duration-format");
const { EmbedBuilder } = require("discord.js");
const Cron = require("../structures/Cron");
setup(moment);

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "giveaway",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Manage giveaways on your server.")
        .setDefaultMemberPermissions(8)
        .addSubcommand((sub) =>
          sub
            .setName("create")
            .setDescription("Create a new giveaway")
            .addUserOption((x) =>
              x
                .setName("host")
                .setDescription("Host that gives reward")
                .setRequired(true)
            )
            .addStringOption((x) =>
              x
                .setName("prize")
                .setDescription("Prize of this giveaway")
                .setRequired(true)
            )
            .addIntegerOption((x) =>
              x
                .setName("winners")
                .setDescription("How many winners? (Max 20)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(20)
            )
            .addIntegerOption((x) =>
              x
                .setName("duration_in_minutes")
                .setDescription("Giveaway duration in minutes (max 4 weeks)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(4320)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("end")
            .setDescription("Force end an existing giveaway")
            .addStringOption((x) =>
              x
                .setName("message_id")
                .setDescription("Message ID of the giveaway")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("reroll")
            .setDescription("Reroll winner of an existing giveaway")
            .addStringOption((x) =>
              x
                .setName("message_id")
                .setDescription("Message ID of the giveaway")
                .setRequired(true)
            )
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create": {
        const host = interaction.options.getUser("host", true);
        const prize = interaction.options.getString("prize", true);
        const winners = interaction.options.getInteger("winners", true);
        const time =
          interaction.options.getInteger("duration_in_minutes", true) *
          60 *
          1000;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Giveaway for ${prize} just started!`,
          })
          .setDescription(
            `
    Host: ${host}
    Winners: **${winners}**
    Ends at: <t:${Math.floor((Date.now() + time) / 1000)}>
    
    React below with 🎉 to enter!`
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/1003806775688048731/1036421209849598052/blobgift.gif"
          )
          .setColor(Math.floor(Math.random() * 16777214) + 1);
        const msg = await interaction.channel.send({
          content: "🎉 **NEW GIVEAWAY** 🎉",
          embeds: [embed],
        });
        await msg.react("🎉");

        await this.client.giveaways.set(msg.id, {
          channel_id: msg.channel.id,
          prize,
          host,
          winners,
          endsAt: Date.now() + time,
        });

        await interaction.editReply({
          embeds: [
            new SuccessEmbed({
              description: `You've made an giveaway for **${prize}**.`,
            }),
          ],
        });
        break;
      }
      case "end": {
        const message_id = interaction.options.getString("message_id", true);
        let data;
        try {
          data = await this.client.giveaways.get(message_id);
        } catch (error) {
          return interaction.editReply({
            embeds: [
              new ErrorEmbed({
                description:
                  "Giveaway with this Message ID cannot be found in database.",
              }),
            ],
          });
        }
        if (data.end)
          return interaction.editReply({
            embeds: [
              new ErrorEmbed({
                description: "Giveaway was already ended.",
              }),
            ],
          });

        const channel = await this.client.channels.fetch(data.channel_id);
        const msg = await channel.messages.fetch(message_id);
        const winners = [];

        let reaction = msg.reactions.cache.get("🎉");
        let users = await reaction.users.fetch();
        users = users.filter((x) => !x.bot);
        if (!users.size) {
          await this.client.giveaways.set(message_id, true, "ended");
          return interaction.editReply({
            content: `❌ No one was reacted so I can't pick winner.`,
          });
        }
        for (let i = 0; i < data.winners; i++) {
          const winner = users.random();
          if (!winner?.id) continue;
          users.delete(winner?.id);
          winners.push(winner);
        }

        try {
          msg.channel.send({
            content: `🎉 **Congratulations!** Winners are ${winners
              .map((x) => `<@${x.id}>`)
              .join(", ")}`,
          });
          msg.edit({
            content: "**⏰ GIVEAWAY ENDED!** ⏰",
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `Giveaway for ${data.prize} has ended!`,
                })
                .setDescription(
                  `
      Host: <@${data.host.id}>
      Winners: ${winners.map((x) => `\n - <@${x.id}>`)}
      
      🎉 Congratulations to winner(s)!`
                )
                .setThumbnail(
                  "https://cdn.discordapp.com/attachments/1003806775688048731/1036421209849598052/blobgift.gif"
                )
                .setColor(Math.floor(Math.random() * 16777214) + 1),
            ],
          });
        } catch (error) {
          console.error(error);
        }

        await this.client.giveaways.set(message_id, true, "ended");

        await interaction.editReply({
          embeds: [
            new SuccessEmbed({
              description: `Forced giveaway \`${message_id}\` to end and pick winners.`,
            }),
          ],
        });
        break;
      }
      case "reroll": {
        const message_id = interaction.options.getString("message_id", true);
        let giveaway;
        try {
          giveaway = await this.client.giveaways.get(message_id);
        } catch (error) {
          return interaction.editReply({
            embeds: [
              new ErrorEmbed({
                description:
                  "Giveaway with this Message ID cannot be found in database.",
              }),
            ],
          });
        }
        if (!giveaway.end)
          return interaction.editReply({
            embeds: [
              new ErrorEmbed({
                description: "Giveaway must end in order to reroll winners.",
              }),
            ],
          });
        const channel = await this.client.channels.fetch(giveaway.channel_id);
        const msg = await channel.messages.fetch(message_id);

        const winners = [];

        let reaction = msg.reactions.cache.get("🎉");
        let users = await reaction.users.fetch();
        users = users.filter((x) => !x.bot);
        const winner = users.random();
        winners.push(winner);

        msg.channel.send({
          content: `🎉 **New Winner is** ${winners.map(
            (x) => `\n - <@${x.id}>`
          )}`,
        });

        await interaction.editReply({
          embeds: [
            new SuccessEmbed({
              description: `Rerolled giveaway \`${message_id}\` in order to pick new winners.`,
            }),
          ],
        });
        break;
      }
    }
    function getRandomAmount(a, b) {
      return Math.floor(Math.random() * b);
    }
  }
};
