const fs = require("fs");
const Cron = require("node-cron");

class Loader {
  constructor(client) {
    this.client = client;
  }
  async loadFolder(dir) {
    return await fs.readdirSync(dir);
  }
  filter(files) {
    return files.filter((x) => x.endsWith(".js"));
  }
  async loadEvents() {
    const events = await this.loadFolder("./events");
    const files = this.filter(events);
    for (const x of files) {
      const event = new (require(`../events/${x}`))(this.client);
      if (!event.enabled) continue;
      this.client.on(event.name, (...args) => event.run(...args));
    }
  }
  async loadCommands() {
    const commands = await this.loadFolder("./commands");
    const files = this.filter(commands);
    for (const x of files) {
      const command = new (require(`../commands/${x}`))(this.client);
      if (!command.enabled) continue;
      this.client.commands.set(command.name, command);
    }
  }
  async loadCrons() {
    const crons = await this.loadFolder("./crons");
    const files = this.filter(crons);
    for (const x of files) {
      const cron = new (require(`../crons/${x}`))(this.client);
      if (!cron.enabled) return;
      const job = await Cron.schedule(
        cron.format,
        () => cron.execute(),
        null,
        true,
        this.client.config.timezone
      );
      job.start();
    }
  }
  async setAPICommands() {
    this.client.guilds.cache.each((guild) => {
      guild.commands.set(
        Array.from(this.client.commands.values()).map((r) => r.data.toJSON())
      );
    });
  }
}

module.exports = Loader;
