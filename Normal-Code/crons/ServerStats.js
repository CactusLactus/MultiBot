const { Cron } = require("../structures");

module.exports = class extends Cron {
  constructor(client) {
    super(client, {
      format: "*/5 * * * *",
      enabled: true,
    });
  }
  async execute() {
    const { members, bots, boosts } = this.client.config.server_stats;

    let channel, name;

    channel = this.client.channels.cache.get(members.channel_id);
    name = members.display.replace(/{X}/g, channel.guild.memberCount);
    if (channel) await channel.edit({ name });

    channel = this.client.channels.cache.get(bots.channel_id);
    name = bots.display.replace(
      /{X}/g,
      channel.guild.members.cache.filter((x) => !x.user.bot).size
    );
    if (channel) await channel.edit({ name });

    channel = this.client.channels.cache.get(boosts.channel_id);
    name = boosts.display.replace(
      /{X}/g,
      channel.guild.premiumSubscriptionCount
    );
    if (channel) await channel.edit({ name });
  }
};
