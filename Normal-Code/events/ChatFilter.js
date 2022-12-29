const { PermissionFlagsBits } = require("discord.js");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
      name: "messageCreate",
    });
  }
  async run(message) {
    if (!message.guild || message.author.bot) return;

    const {
      excludedChannels,
      excludedRoles,
      bypassAdmin,
      deleteServerInvites,
      antiCapsLock,
      allowedCapsPercent,
      bannedWords,
      disableLinks,
    } = this.client.config.chat_filter;

    if (excludedChannels.includes(message.channel.id)) return;
    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) &&
      bypassAdmin
    )
      return;
    if (
      message.member.roles.cache.some((role) => excludedRoles.includes(role.id))
    )
      return;

    const inviteRegex =
      /(discord.(gg|io|me|li)|(discordapp|discord).com\/invite)\/.+/gi;
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const caps = message.content.replace(/[^A-Z]/g, "");

    const usage = (caps.length / message.content.length) * 100;

    if (
      deleteServerInvites &&
      inviteRegex.test(message.content.toLowerCase())
    ) {
      await message.delete();
      return message.channel.send({
        content: `❌ Please, do not post server invites here!  ${message.author}`,
      });
    } else if (
      antiCapsLock &&
      !message.content.length <= 7 &&
      usage > allowedCapsPercent
    ) {
      await message.delete();
      return message.channel.send({
        content: `❌ Please, do not use too many CAPS!  ${message.author}`,
      });
    } else if (
      bannedWords.length &&
      bannedWords.includes(message.content.toLowerCase())
    ) {
      await message.delete();
      return message.channel.send({
        content: `❌ Please, do not use bad words! ${message.author}`,
      });
    } else if (disableLinks && linkRegex.test(message.content.toLowerCase())) {
      await message.delete();
      return message.channel.send({
        content: `❌ Please, do not post that link here! ${message.author}`,
      });
    }
  }
};
