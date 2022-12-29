const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "ready",
      enabled: true,
    });
  }
  async run() {
    await this.client.loader.setAPICommands();
    await this.client.user.setPresence(this.client.config.presence);

    const reactionRoles = this.client.config.reaction_roles;

    for (var x of reactionRoles) {
      const channel = this.client.channels.cache.get(x.channel_id);
      if (!channel) continue;
      const message = await channel.messages.fetch(x.message_id);
      if (!message) continue;
      if (x.reaction_emoji) await message.react(x.reaction_emoji);
    }

    const guild = this.client.guilds.cache.get(this.client.config.server_id);

    const invites = await guild.invites.fetch();
    const codeUses = new Map();
    invites.each((inv) => codeUses.set(inv.code, inv.uses));

    this.client.cachedInvites.set(guild.id, codeUses);

    console.log(`[!] ${this.client.user.username} has been logged in!`);
  }
};
