const { DefaultEmbed } = require("../embeds");
const Event = require("../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "guildMemberAdd",
      enabled: true,
    });
  }
  async run(member) {
    if (member.user.bot) return;

    // Invite Tracker

    const cachedInvites = this.client.cachedInvites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();
    const usedInvite = newInvites.find(
      (inv) => cachedInvites.get(inv.code) < inv.uses
    );

    if (!usedInvite) return;

    const joinChannel = member.guild.channels.cache.get(
      this.client.config.invite_tracking.join.channel_id
    );

    try {
      await this.client.invites.math(usedInvite.inviter.id, "+", 1, "joins");
    } catch (error) {
      await this.client.invites.ensure(usedInvite.inviter.id, {
        inviter: null,
        joins: 0,
        leaves: 0,
        fakes: 0,
      });
    } finally {
      await this.client.invites.math(usedInvite.inviter.id, "+", 1, "joins");
    }
    const { joins, leaves, fakes } = this.client.invites.get(
      usedInvite.inviter.id
    );
    const inviterInvites = joins - leaves - fakes;

    await this.client.invites.set(member.id, usedInvite.inviter.id, "inviter");

    if (joinChannel)
      joinChannel.send({
        embeds: [
          new DefaultEmbed({
            description: this.client.config.invite_tracking.join.message
              .replace(/{MEMBER}/g, member.user)
              .replace(/{INVITER}/g, usedInvite.inviter.username)
              .replace(/{INVITES}/g, inviterInvites),
          }),
        ],
      });

    newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
    this.client.cachedInvites.set(member.guild.id, cachedInvites);
  }
};
