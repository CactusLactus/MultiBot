const { EmbedBuilder } = require("@discordjs/builders");
const Cron = require("../structures/Cron");

module.exports = class extends Cron {
  constructor(client) {
    super(client, {
      enabled: true,
      format: "* * * * *",
    });
  }
  async execute() {
    const giveaways = this.client.giveaways.fetchEverything();

    for (let [msg_id, data] of giveaways) {
      if (data.ended) continue;
      if (Date.now() >= data.endsAt) {
        const channel = await this.client.channels.fetch(data.channel_id);
        const msg = await channel.messages.fetch(msg_id);
        const winners = [];

        let reaction = msg.reactions.cache.get("🎉");
        let users = await reaction.users.fetch();
        users = users.filter((x) => !x.bot);
        if (!users.size) {
          await this.client.giveaways.set(msg_id, true, "ended");
          return channel.send({
            content: `❌ No one was reacted so I can't pick winner.`,
          });
        }
        for (let i = 0; i < data.winners; i++) {
          const winner = users.random();
          if (!winner?.id) continue;
          users.delete(winner?.id);
          winners.push(winner);
        }

        try {
          msg.channel.send({
            content: `🎉 **Congratulations!** Winners are ${winners
              .map((x) => `<@${x.id}>`)
              .join(", ")}`,
          });
          msg.edit({
            content: "**⏰ GIVEAWAY ENDED!** ⏰",
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `Giveaway for ${data.prize} has ended!`,
                })
                .setDescription(
                  `
      Host: <@${data.host.id}>
      Winners: ${winners.map((x) => `\n - <@${x.id}>`)}
      
      🎉 Congratulations to winner(s)!`
                )
                .setThumbnail(
                  "https://cdn.discordapp.com/attachments/1003806775688048731/1036421209849598052/blobgift.gif"
                )
                .setColor(Math.floor(Math.random() * 16777214) + 1),
            ],
          });
        } catch (error) {
          console.error(error);
        }

        await this.client.giveaways.set(msg_id, true, "ended");
      }
    }
  }
};
