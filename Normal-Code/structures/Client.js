const { Client, Collection } = require("discord.js");
require("dotenv").config();
const { Loader } = require("../utils/");
const Enamp = require("enmap");

const leveling = new Enamp({
  name: "leveling",
  autoEnsure: {
    messages: 0,
    xp: 0,
    level: 0,
    lastMsg: 0,
  },
});

module.exports = class extends Client {
  constructor(...args) {
    super(...args);

    this.commands = new Collection();
    this.loader = new Loader(this);
    this.config = require("../config");
    this.leveling = leveling;

    this.giveaways = new Enamp({ name: "giveaways" });
    this.tickets = new Enamp({ name: "tickets" });
    this.youtube = new Enamp({ name: "videos" });
    this.twitch = new Enamp({ name: "tw-streams" });
    this.activeStreams = new Enamp({ name: "yt-streams" });

    this.cachedInvites = new Map();
    this.invites = new Enamp({
      name: "invites",
      autoEnsure: {
        inviter: null,
        joins: 0,
        leaves: 0,
        fakes: 0,
      },
    });
  }
  async run() {
    await this.loader.loadEvents();
    await this.loader.loadCommands();
    await this.loader.loadCrons();
    await this.login(process.env.TOKEN);
  }
};
