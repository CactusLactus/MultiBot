const Event = require("../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "inviteCreate",
      enabled: true,
    });
  }
  async run(invite) {
    const invites = await invite.guild.invites.fetch();

    const codeUses = new Map();
    invites.each((inv) => codeUses.set(inv.code, inv.uses));

    this.client.cachedInvites.set(invite.guild.id, codeUses);
  }
};
