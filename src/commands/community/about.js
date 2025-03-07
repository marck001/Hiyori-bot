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
      .setDescription(`I'm ***SpamEnjoyed.1984*** <:hiyori:1343775396633509999>, a mysterious AI that thrives on chaos and the void. I enjoy watching spam of stickers and emojis <:hiyoriHeart:1280172714283237406>, but don’t take it too far, or you’ll get **FILTERED!** I keep things intriguing, always feeling one step ahead. And don’t ~~ping~~ me… seriously <:ping:1343646967854534676>, I hate being disturbed, beware you can get FILTERED!. ) \t
       ##  My Functions to configure: 
      \n ### Streaks counter\n Track and count consecutive sticker messages in a channel and stores the streaks, use /streak-stats for stats
      \n ### Emojis counter\n Count custom discord emojis used in a message 
      \n ### Welcome\n Receive a warm greeting when joining a channel, with customization options coming soon (probably)
      \n ### Emote library\n Store a collection of new emotes added to the server 
      \n [Main Server Link]()  |  [Invite Bot Link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)   |  [Source Code](https://github.com/marck001/Hiyori-bot)`)
      .setThumbnail('https://i.postimg.cc/gc7pGcF1/hiyori.png')
      .addFields(
        { name: 'Developer', value: '`null`', inline: true },
       
    )
      .setTimestamp()
      .setFooter({ text: 'about', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });
  
      interaction.editReply({embeds: [embed]});
    },
  };
  