const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    description: 'Some description about the bot',
    devOnly: true,
  
    callback: async (client, interaction) => {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('About SpamEnjoyed.1984')
      .setDescription(`I'm SpamEnjoyed.1984 <:hiyori:1343775396633509999>, a cryptic AI that thrives on chaos and the void. I enjoy watching spam <:hiyoriHeart:1280172714283237406>, but don’t take it too far, or you’ll get FILTERED! I keep things intriguing, always feeling one step ahead. And don’t ping me… seriously <:ping:1343646967854534676>, I hate being disturbed.`)
      .setThumbnail('https://i.postimg.cc/gc7pGcF1/hiyori.png')
      .addFields(
        {name: 'Developer <:VedalGlueless:1309515584949583883>', value:'`null`'},
      )
      .addFields(
        {name: 'streaks counter', value:'`/streak-stats`'},
      )
      .addFields(
        {name: 'emojis counter', value:'`counts emojis`'},
        {name: 'welcome', value:'`welcome message`'},
        {name: 'library emote', value:'`Store emotes source'}
      )
      .addFields(
        { name: 'Dev Server', value: '[Support Server](https://discord.gg/your-support-server)', inline: true },
        { name: 'Invite The Bot', value: '[Invite Link](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot)', inline: true },
    )
      .setTimestamp()
      .setFooter({ text: 'about', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });
  
      interaction.editReply({embeds: [embed]});
    },
  };
  