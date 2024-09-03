const {
    ApplicationCommandOptionType,
    EmbedBuilder,   PermissionFlagsBits
  } = require('discord.js');
  
  const Blob = require('../../models/Blob'); 

  module.exports = {
    name: 'save-files',
    description: 'Saves files url',
    options: [
      {
        name: 'url',
        description: 'the url to store file',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'name',
        description: 'give it a name',
        required: false,
        type: ApplicationCommandOptionType.String,
      },
    ],
    deleted: false,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
  
    callback: async (client, interaction) => {
   
      const urlString = interaction.options.getString('url') ;
      const fileName = interaction.options.getString('name') || 'Unnamed File';
  
      await interaction.deferReply();
  
      const fileType = urlString.endsWith('.gif') ?'gif':'image';

      try {
  
        const isValidUrl = urlString.match(/\.(jpeg|jpg|png|webp|gif|apng)$/i);
        if (!isValidUrl) {
          return interaction.editReply({
            content:'Invalid file URL. Please provide a valid image or GIF URL ending in .gif | .jpeg | .png',
            ephemeral:true});
        }

        
        const existingFile = await Blob.findOne({ where: { url: urlString } });
      if (existingFile) {
        return interaction.editReply({
          content:'This file URL is already saved in the database.', 
          ephemeral:true});
      }

    
        const newFile = await Blob.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            url: urlString,
            name: fileName,
            type: fileType, 
          });

          console.log(newFile.toJSON());
          interaction.editReply({
            content: 'The file has been added to the database!',
            ephemeral: true,
          });

  
  
      } catch (error) {
        console.error('Error saving file:', error);
        interaction.editReply({content:'An error occurred while saving files.',   ephemeral: true});
      }
    },
  };
