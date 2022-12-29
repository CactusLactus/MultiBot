const { EmbedBuilder } = require("discord.js");

class SuccessEmbed extends EmbedBuilder {
  constructor(data) {
    super(data);
    this.data.author = { name: "Success" };
    this.data.color = 0x32cd32;
    this.data.description = `\`✅\` ${data.description}`;
    this.data.timestamp = new Date();
  }
}

module.exports = SuccessEmbed;
