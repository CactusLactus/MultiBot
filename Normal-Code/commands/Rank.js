const { SlashCommandBuilder } = require("@discordjs/builders");
const { Command } = require("../structures/");
const { Rank } = require("canvacord");
const { AttachmentBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "rank",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Check your or other user level rank")
        .addUserOption((x) =>
          x
            .setName("member")
            .setDescription("Who's rank do you want to see?")
            .setRequired(false)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply();

    const member =
      interaction.guild.members.cache.get(
        interaction.options.getUser("member", false)?.id
      ) || interaction.member;

    const { xp, level } = await this.client.leveling.get(member.id);

    const RankCard = new Rank()
      .setAvatar(member.user.displayAvatarURL({ format: "png" }))
      .setCurrentXP(xp, this.client.config.leveling.color)
      .setRequiredXP(
        this.client.config.leveling.level_up_formula(level),
        this.client.config.leveling.color
      )
      .setRankColor(null, this.client.config.leveling.color)
      .setLevel(level)
      .setRank(getLeaderboardRank(this.client, member), "RANK", true)
      .setLevelColor(null, this.client.config.leveling.color)
      .setProgressBar(this.client.config.leveling.color)
      .setProgressBarTrack("#E8E8E8")
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);
    if (this.client.config.leveling.background_url)
      RankCard.setBackground(
        "IMAGE",
        this.client.config.leveling.background_url
      );
    if (member.presence) RankCard.setStatus(member.presence.status);
    const data = await RankCard.build();

    const attachment = new AttachmentBuilder(data, {
      name: "rank-card.png",
      description: "Rank card",
    });

    await interaction.editReply({
      files: [attachment],
    });

    function getLeaderboardRank({ leveling }, { id }) {
      const indexes = leveling.indexes;
      const data = [];
      for (const index of indexes) {
        const { xp } = leveling.get(index);
        data.push({ id: index, xp });
      }
      const sorted = data.sort((a, b) => b.xp - a.xp);
      const result = sorted.indexOf(sorted.find((user) => user.id === id)) + 1;
      if (result) return result;
      else return -2;
    }
  }
};
