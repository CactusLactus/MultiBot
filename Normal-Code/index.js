const { IntentsBitField, Partials } = require("discord.js");
const Client = require("./structures/Client");

const bot = new Client({
  intents: 3276799,
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
});

bot.run();
