const { DefaultEmbed } = require("../embeds");
const { Event } = require("../structures");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
      name: "messageUpdate",
    });
  }
  async run(element, newelement) {
    if (element.author.bot) return;
    if (!this.client.config.server_logs.enabled) return;
    const logChannel = this.client.channels.cache.get(
      this.client.config.server_logs.log_channel
    );
    if (!logChannel) return;

    const embed = new DefaultEmbed()
      .setTitle("🔩 Message edited")
      .setDescription(
        `${element.author}  ${element.channel} | ${element.content} \n\n${newelement.content}`
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  }
};
