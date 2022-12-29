const { DefaultEmbed } = require("../embeds");
const Event = require("../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "guildMemberRemove",
      enabled: true,
    });
  }
  async run(member) {
    if (member.user.bot) return;

    const leaveChannel = member.guild.channels.cache.get(
      this.client.config.invite_tracking.leave.channel_id
    );

    const { inviter } = this.client.invites.get(member.id);

    if (!inviter)
      return leaveChannel.send({
        content: `${member.user} has left, invited by unknown inviter.`,
      });

    await this.client.invites.math(inviter, "+", 1, "leaves");
    const { joins, leaves, fakes } = this.client.invites.get(inviter);
    const inviterInvites = joins - leaves - fakes;

    if (leaveChannel)
      leaveChannel.send({
        embeds: [
          new DefaultEmbed({
            description: this.client.config.invite_tracking.leave.message
              .replace(/{MEMBER}/g, member.user.tag)
              .replace(
                /{INVITER}/g,
                member.guild.members.cache.get(inviter).displayName
              )
              .replace(/{INVITES}/g, inviterInvites),
          }),
        ],
      });
  }
};
