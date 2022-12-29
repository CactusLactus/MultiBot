const DefaultEmbed = require("../embeds/DefaultEmbed");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "messageCreate",
      enabled: true,
    });
  }
  async run(message) {
    if (message.author.bot || !message.guild) return;

    const {
      cooldown,
      banned_channels,
      min_xp,
      max_xp,
      xp_rate,
      level_up_formula,
      level_up_channel,
      level_up_message,
    } = this.client.config.leveling;

    if (banned_channels.includes(message.channelId)) return;

    const getData = async () => {
      return await this.client.leveling.get(message.author.id);
    };

    let data = await getData(message.author);

    if (Date.now() < data.lastMsg + cooldown * 1000) return;

    let earnedXp = Math.floor(
      (Math.random() * (max_xp - min_xp + 1) + min_xp) * xp_rate
    );

    await this.client.leveling.math(message.author.id, "+", earnedXp, "xp");

    data = await getData();

    if (data.xp >= level_up_formula(data.level)) {
      await this.client.leveling.set(message.author.id, 0, "xp");
      await this.client.leveling.math(message.author.id, "+", 1, "level");
      data = await getData();

      const levelupChannel = level_up_channel
        ? level_up_channel
        : message.channel;
      await levelupChannel.send({
        content: `🎉 ${message.author} 🎉`,
        embeds: [
          new DefaultEmbed({
            author: {
              name: `Congratulations, ${message.member.displayName}!`,
              icon_url: message.author.displayAvatarURL({
                dynamic: true,
              }),
            },

            description: level_up_message
              .replace(/{USER}/g, message.author)
              .replace(/{LEVEL}/g, data.level)
              .replace(/{NEXT_LEVEL}/g, data.level + 1)
              .replace(
                /{NEXT_LEVEL_NEEDED_XP}/g,
                level_up_formula(data.level + 1)
              ),
          }),
        ],
      });
    }
  }
};
