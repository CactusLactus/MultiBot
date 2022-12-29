const Event = require("../structures/Event");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "messageReactionRemove",
      enabled: true,
    });
  }
  async run(reaction, user) {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    for (var rr of this.client.config.reaction_roles) {
      if (reaction.message.channel.id !== rr.channel_id) continue;
      const member = this.client.guilds.cache
        .get(this.client.config.server_id)
        .members.cache.get(user.id);
      try {
        await member?.roles.remove(rr.role_id);
      } catch (error) {
        console.log(
          `Reaction Roles: Bot's role is not higher than reaction role.`
        );
      }
    }
  }
};
