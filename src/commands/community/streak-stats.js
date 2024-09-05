const {
    ApplicationCommandOptionType,
    EmbedBuilder, 
  } = require('discord.js');
  
  const Counter = require('../../models/Counter'); 
  const { chunkArray } = require('../../modules/streak/splitArray');
  const  pagination = require('../../components/buttons/pajination')
  module.exports = {
    name: 'streak-stats-test',
    description: 'Displays a list of all streaks',
    options: [
      {
        name: 'page',
        description: 'The selected page',
        required: false,
        type: ApplicationCommandOptionType.Number,
      },
    ],
    deleted: false,
    devOnly: true,
  
    callback: async (client, interaction) => {
   
      const page = interaction.options.getNumber('page') || 1;
  
      try {

        const counters = await Counter.findAll({
          where: { guildId: interaction.guild.id },
          order: [['streak', 'DESC']],
        });
  
        if (counters.length === 0) {
          return interaction.reply('No streak records found.');
        }
  
        const chunkedCounters = chunkArray(counters, 10);

        if (page > chunkedCounters.length) {
          return interaction.reply({content:`Page (${page}) not found.`,
            ephemeral:true});
        }
        
        let embeds = [];

        chunkedCounters.forEach((chunk, index) => {
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setTitle(`-------- List of <:hiyoriHeart:1280172714283237406> streaks --------`)
          .setAuthor({ name: `Page ${index +1} `})
          .setTimestamp()
          .setFooter({ text: 'Streaks', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });
  
        chunk.forEach((counter, i) => { 
          const globalIndex = index* 10 + i + 1;
          embed.addFields({
            name: `${globalIndex}. Streak record: ${counter.date}`,
            value: `${counter.stickerName} streak of **${counter.streak}** broken by <@${counter.userId}>\n`,
            inline: false
          });
        });
        embeds.push(embed)
      
      })
      

      const currentPage = page > embeds.length ? embeds.length : page;

        await pagination(interaction,embeds,  currentPage - 1)
  
  
      } catch (error) {
        console.error('Error fetching streaks:', error);
        interaction.reply('An error occurred while fetching streaks.');
      }
    },
  };
  