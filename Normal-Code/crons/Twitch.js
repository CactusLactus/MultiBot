const Cron = require("../structures/Cron");
require("dotenv").config(); //@twurple/api
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports = class extends Cron {
  constructor(client) {
    super(client, {
      enabled: true,
      format: "* * * * *", // every minute
    });
  }
  async execute(client = this.client) {
    const isLive = async (channel) => {
      const result = await fetch(`https://www.twitch.tv/${channel}`);
      const data = await result.text();
      return data.includes("isLiveBroadcast");
    };
    for (const channel of this.client.config.live_streaming.twitch.channels) {
      let live = await isLive(channel);
      let streaming = client.twitch.get(channel, "streaming");
      if (live && !streaming) {
        let content = this.client.config.live_streaming.twitch.message
          .replace(/{channel}/g, channel)
          .replace(/{url}/g, `https://twitch.tv/${channel}`);
        this.client.channels.cache
          .get(this.client.config.live_streaming.twitch.log_channel)
          .send({ content });
        client.twitch.set(channel, { streaming: true });
      } else {
        client.twitch.set(channel, { streaming: false });
        continue;
      }
    }
  }
};
