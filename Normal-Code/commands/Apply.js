const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../structures/Command");
const { DefaultEmbed, ErrorEmbed, SuccessEmbed } = require("../embeds");
const {
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const already = new Set();

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "apply",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("apply")
        .setDescription("Start an application")
        .addStringOption((x) =>
          x
            .setName("application")
            .setDescription("For which application you want to apply?")
            .setRequired(true)
            .addChoices(
              ...client.config.applications
                //.filter((app) => app.enabled && app.questions.length)
                .map((app) => ({
                  name: app.name,
                  value: app.name,
                }))
            )
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });

    const application = interaction.options.getString("application", true);
    const { questions, disabledRoles, log_channel } =
      this.client.config.applications.find((x) => x.name === application);

    if (
      interaction.member.roles.cache.some((x) => disabledRoles.includes(x.id))
    )
      await interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: `Your role is not allowed to apply for this.`,
          }),
        ],
      });
    if (already.has(interaction.user.id))
      return await interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: `You already started application process.`,
          }),
        ],
      });

    already.add(interaction.user.id);

    let i = 0;
    ask(i);

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Starting application in your DMs..`,
        }),
      ],
    });

    const answers = [];

    async function ask(i) {
      if (questions[i]) {
        try {
          const msg = await interaction.user.send({
            embeds: [
              new DefaultEmbed({
                title: `Question #${i + 1}`,
                description: `${questions[i]}`,
                footer: {
                  text: `Type "cancel" to cancel apply`,
                },
              }),
            ],
          });

          const filter = (message) => message.author.id === interaction.user.id;

          const answer = await msg.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 300000,
              errors: ["time"],
            })
            .catch((x) => already.delete(interaction.user.id));

          if (answer.first().content.toLowerCase() === "cancel")
            return await msg.channel.send({
              embeds: [
                new ErrorEmbed({
                  description: `You cancelled application process.`,
                }),
              ],
            });

          answers.push(answer.first().content);

          i++;
          ask(i);
        } catch (error) {
          console.log(error);
          return await unlockDMs(interaction);
        }
      } else {
        try {
          const msg = await interaction.user.send({
            embeds: [
              new DefaultEmbed({
                description: `
💡 Would you like to send this application for review?
⏰ Please, click yes or no button within **5 minutes**.`,
              }),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("yes")
                  .setLabel("Yes")
                  .setEmoji("✅")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(false),
                new ButtonBuilder()
                  .setCustomId("no")
                  .setLabel("No")
                  .setEmoji("❌")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(false)
              ),
            ],
          });

          const filter = (i) => {
            return i.user.id === interaction.user.id;
          };

          const answer = await msg.channel.awaitMessageComponent({
            filter,
            componentType: ComponentType.Button,
            time: 300000,
          });

          already.delete(interaction.user.id);

          if (answer.customId === "yes") {
            try {
              await answer.reply({
                embeds: [
                  new SuccessEmbed({
                    description: `Successfully sent your application for review.`,
                  }),
                ],
              });
              const embed = new DefaultEmbed({
                author: {
                  name: `Application from ${interaction.user.username}`,
                  iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                  }),
                },
                timestamp: Date.now(),
              });
              let fields = [];
              for (let i = 0; i < answers.length; i++) {
                fields.push({ name: questions[i], value: answers[i] });
              }
              embed.addFields(fields);
              interaction.client.channels.cache
                .get(log_channel)
                .send({ embeds: [embed] });
              return;
            } catch (error) {
              console.error(error);
            }
          } else {
            already.delete(interaction.user.id);
            return await answer.reply({
              embeds: [
                new ErrorEmbed({
                  description: `Application will not be sent.`,
                }),
              ],
            });
          }
        } catch (error) {
          already.delete(interaction.user.id);
        }
      }
    }
    async function unlockDMs(interaction) {
      return await interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: `Please, turn on your DMs in order to apply.`,
          }),
        ],
      });
    }
  }
};
