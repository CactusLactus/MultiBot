const Cron = require("../structures/Cron");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtubeApiUrl =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video";

module.exports = class extends Cron {
  constructor(client) {
    super(client, {
      enabled: true,
      format: "* * * * *", // every minute
    });
  }
  async execute(client = this.client) {
    const channel = client.channels.cache.get(
      client.config.live_streaming.youtube.log_channel
    );
    for (const channelId of client.config.live_streaming.youtube.channels) {
      try {
        const url = `${youtubeApiUrl}&channelId=${channelId}&key=${youtubeApiKey}`;
        const response = await fetch(url);
        const myJson = await response.json();

        if (myJson && myJson.pageInfo && myJson.pageInfo.totalResults > 0) {
          myJson.items.forEach((element) => {
            if (!client.activeStreams.has(element.id.videoId)) {
              client.activeStreams.set(element.id.videoId, true);

              let message =
                client.config.live_streaming.youtube.new_live_message
                  .replace(/{channel}/g, element.snippet.channelTitle)
                  .replace(/{title}/g, element.snippet.title)
                  .replace(
                    /{url}/g,
                    `https://www.youtube.com/watch?v=${element.id.videoId}`
                  );
              channel.send({ content: message });
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
