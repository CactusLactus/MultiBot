const { DefaultEmbed } = require("../embeds");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
      name: "roleUpdate",
    });
  }
  async run(element, newelement) {
    if (!this.client.config.server_logs.enabled) return;
    const logChannel = this.client.channels.cache.get(
      this.client.config.server_logs.log_channel
    );
    if (!logChannel) return;

    const embed = new DefaultEmbed()
      .setTitle("🔩 Role updated")
      .setDescription(
        `${element.name} -> ${element.toString()} (${element.id})`
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  }
};