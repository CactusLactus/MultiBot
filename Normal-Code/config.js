module.exports = {
  color: 0x1e90ff, // hex decimal code of your default embed color
  server_id: "1046142154113818785",
  presence: {
    status: "dnd", //dnd - do not distrub | idle - idle | online - online
    activities: [
      {
        name: "Some cool status",
        type: 0, // 0 - playing | 1 - streaming | 2 - listening | 3 - watching
        //url: , // put here twitch.tv link if you choose streaming (1)
      },
    ],
  },
  suggestions: {
    channel_id: "1057818971434393641",
  },
  server_logs: {
    enabled: true,
    log_channel: "1057825355404161077",
  },
  verification: {
    roles: ["1057819992030199839"],
    success_msg: "✅ You have been successfully verified!",
    button: {
      emoji: "✅",
      label: "Verify me",
      style: 3, // 1 - Blurple | 2 - Gray | 3 - Green | 4 - Red
    },
    embed: {
      title: "🔒 Verification",
      description: "Click below to get verified!",
      color: 0x2f3136,
      image: {
        url: "https://pbs.twimg.com/media/EwrvB-DWYAENkO-.jpg",
      },
    },
  },
  tickets: {
    category_id: "1057818599126999090",
    help_categories: ["Fav Song", "Fav TV Show", "Fav Movie"], // max 8
    channel_format: "🎫ticket-",
    staff_roles_ids: [1057819362540662824],
    open_message:
      "\n🙋‍♀️ Hello {USER}, welcome to your ticket. \n⏰ Our support team will reach to you as soon as possible.",
  },
  invite_tracking: {
    join: {
      channel_id: "1057819062597587115",
      message:
        "{MEMBER} **joined**; Invited by `{INVITER}` who has now __{INVITES}__ invites.",
    },
    leave: {
      channel_id: "1057819062597587115",
      message:
        "{MEMBER} **left**; Inviter was `{INVITER}` who has now __{INVITES}__ invites.",
    },
  },
  live_streaming: {
    youtube: {
      //	to find IDs go to https://commentpicker.com/youtube-channel-id.php
      channels: ["UCAW-NpUFkMyCNrvRSSGIvDQ"],
      log_channel: "1057825355404161077",
      new_video_message: `@Youtube Follower **{channel}** just posted a NEW Video! \n Go Check it out \n{url}`,
      new_live_message: `🔴 Hey @Youtube Folower, **{channel}** is LIVE NOW on YouTube! \n Come Join and Chat \n{url}`,
    },
    twitch: {
      channels: ["ninja"], //Channel names ONLY, *example* twitch.tv/drangula, you put drangula
      log_channel: "1057825355404161077", // Twitch Feed
      message: `🔴 Hey @Twitch Followers, **{channel}** is live on Twitch! \n{url}`,
    },
  },
  server_stats: {
    members: {
      channel_id: "1057912303363829823",
      display: "Members: {X}",
    },
    bots: {
      channel_id: "1057912062413635594",
      display: "Bots: {X}",
    },
    boosts: {
      channel_id: "1057912219859427358",
      display: "Boosts: {X}/15",
    },
  },
  chat_filter: {
    excludedChannels: [""],
    excludedRoles: [1057819362540662824],
    bypassAdmin: true,
    deleteServerInvites: true,
    antiCapsLock: true,
    disableLinks: true,
    allowedCapsPercent: 50, //%
    bannedWords: ["fuck", "bitch"],
  },
  leveling: {
    cooldown: 1,
    banned_channels: [],
    min_xp: 1,
    max_xp: 2,
    xp_rate: 1.0,
    color: "#1e90ff",
    level_up_formula: (level) => (level + 1) * 100,
    level_up_message: `
  ✨ **LEVEL UP!** You are now **__#{LEVEL}__** level! 🎉
  🚀 For level \`{NEXT_LEVEL}\`, you will need **{NEXT_LEVEL_NEEDED_XP}** XP.`,
    background_url: "", // you can put here image link for background and you see options
  },
  reaction_roles: [
    {
      channel_id: "1057819025335390258",
      message_id: "1057912557131812934",
      role_id: "1057819887461994557",
      reaction_emoji: "😎",
    },
  ],
  applications: [
    {
      name: "Staff Application",
      log_channel: "1057825355404161077",
      enabled: true,
      questions: ["What is your name?", "How old are you?"],
      disabledRoles: [],
    },
  ],
};
