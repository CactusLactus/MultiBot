const { DefaultEmbed } = require("../embeds");
const { Event } = require("../structures/");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
      name: "guildMemberRemove",
    });
  }
  async run(element) {
    if (!this.client.config.server_logs.enabled) return;
    const logChannel = this.client.channels.cache.get(
      this.client.config.server_logs.log_channel
    );
    if (!logChannel) return;

    const embed = new DefaultEmbed()
      .setTitle("❌ User left")
      .setDescription(`${element.user.tag} (${element.user.id}) left`)
      .setTimestamp()
      .setImage(element.user.displayAvatarURL({ dynamic: true }));

    logChannel.send({ embeds: [embed] });
  }
};
