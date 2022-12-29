const { EmbedBuilder } = require("discord.js");

class ErrorEmbed extends EmbedBuilder {
  constructor(data) {
    super(data);
    this.data.author = { name: "Error" };
    this.data.color = 0xff0000;
    this.data.description = `\`❌\` ${data.description}`;
    this.data.timestamp = new Date();
  }
}

module.exports = ErrorEmbed;
