const Cron = require("../structures/Cron");

const request = new (require("rss-parser"))();

module.exports = class extends Cron {
  constructor(client) {
    super(client, {
      enabled: true,
      format: "* * * * *", // every minute
    });
  }
  async execute(client = this.client) {
    const logChannel = client.channels.cache.get(
      client.config.live_streaming.youtube.log_channel
    );
    client.youtube.ensure("postedVideos", []);
    for (const channelId of client.config.live_streaming.youtube.channels) {
      if (client.youtube.get("postedVideos") === null)
        client.youtube.set("postedVideos", []);
      const data = await request.parseURL(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      );
      if (client.youtube.get("postedVideos")?.includes(data.items[0].link))
        continue;
      else {
        const parsed = data.items[0];
        if (
          Date.now() - new Date(parsed.isoDate).getTime() >
          24 * 60 * 60 * 1000
        )
          continue;
        client.youtube.push("postedVideos", data.items[0].link);
        let channel = client.channels.cache.get(
          client.config.live_streaming.youtube.log_channel
        );
        if (!channel) continue;
        let message = client.config.live_streaming.youtube.new_video_message
          .replace(/{channel}/g, parsed.author)
          .replace(/{title}/g, parsed.title)
          .replace(/{url}/g, parsed.link);
        logChannel.send({ content: message });
      }
    }
  }
};
