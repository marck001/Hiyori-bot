const {
    ApplicationCommandOptionType,
    EmbedBuilder,   PermissionFlagsBits
  } = require('discord.js');
  
  const Blob = require('../../models/Blob'); 

  const  pagination = require('../../components/buttons/pajination')
  module.exports = {
    name: 'check-saved-files',
    description: 'Displays a list of all stored files',
    options: [
      {
        name: 'page',
        description: 'The selected page',
        required: false,
        type: ApplicationCommandOptionType.Number,
      },
    ],
    deleted: false,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
  
    callback: async (client, interaction) => {
     await interaction.deferReply();
      const page = interaction.options.getNumber('page') || 1;
  
      try {
        const blobs = await Blob.findAll({
          where: { guildId: interaction.guild.id },
          order: [['id', 'DESC']],
        });
  
        if (blobs.length === 0) {
          return interaction.editReply('No files were found.');
        }
     
        let embeds = [];

        blobs.forEach((blob, index) => {
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777214) + 1)
          .setTitle(`-------- List of saved files --------`)
          .setAuthor({ name: `Page ${index +1} `})
          .addFields(
            { name: 'File name:', 
                value: blob.name, 
                inline: true },
            {
                name: 'Created at: ', 
                value: blob.createdAt.toISOString().split('T')[0], 
                inline: true 
            },
            {
              name: 'Added by: ', 
              value: `<@${blob.userId}>`, 
              inline: false
          }

          )
          .setImage(blob.url)
          .setTimestamp()
          .setFooter({ text: 'Streaks', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });

        embeds.push(embed)
      
      })
      

      const currentPage = page > embeds.length ? embeds.length : page;

        await pagination(interaction,embeds,  currentPage - 1)
  
  
      } catch (error) {
        console.error('Error fetching streaks:', error);
        interaction.editReply('An error occurred while fetching streaks.');
      }
    },
  };
  