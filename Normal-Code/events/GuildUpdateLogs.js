const { DefaultEmbed } = require("../embeds");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
      name: "guildUpdate",
    });
  }
  async run(element, newelement) {
    if (!this.client.config.server_logs.enabled) return;
    const logChannel = this.client.channels.cache.get(
      this.client.config.server_logs.log_channel
    );
    if (!logChannel) return;

    const embed = new DefaultEmbed()
      .setTitle("🔩 Server updated")
      .setDescription(`${element.name} (${element.id})`)
      .setTimestamp()
      .setImage(element.iconURL({ dynamic: true }));

    logChannel.send({ embeds: [embed] });
  }
};
