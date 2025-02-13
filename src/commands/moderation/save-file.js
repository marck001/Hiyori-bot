const {
    ApplicationCommandOptionType,
    EmbedBuilder,   PermissionFlagsBits
  } = require('discord.js');
  
  const Blob = require('../../models/Blob'); 
  const { hasRole} = require('../../functions/general/hasRole')

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
      {
        name: 'context',
        description: 'a purpose',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices:[
          {
            name: 'break-streak',
            value: 'break'
        },
        {
          name: 'record-streak',
          value: 'streak'
      },
        ]
      },
    ],
    deleted: false,
    devOnly: false,
   
  
    callback: async (client, interaction) => {
   
      if(!hasRole(interaction)) return;

      await interaction.deferReply({ ephemeral: false });

      const urlString = interaction.options.getString('url') ;
      const fileName = interaction.options.getString('name') || 'Unnamed File';
      const context = interaction.options.getString('context') || 'hiyori';
  
      //await interaction.deferReply();
  
      const fileType = urlString.endsWith('.gif') ?'gif':'image';

      try {
  
        const isValidUrl = urlString.match(/\.(jpeg|jpg|png|webp|gif|apng)$/i);
        if (!isValidUrl) {
          return interaction.editReply({
            content:'Invalid file URL. Please provide a valid image or GIF URL ending in .gif | .jpeg | .png like: \n ```https://example.com/mikugif.gif```',
            ephemeral:true});
        }

        
        const existingFile = await Blob.findOne({ where: { url: urlString } });
      if (existingFile) {
        return interaction.editReply({
          content:'This file URL has been already saved in the database.', 
          ephemeral:true});
      }

    
        const newFile = await Blob.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            url: urlString,
            name: fileName,
            type: fileType, 
            context: context,
          });

          console.log(newFile.toJSON());
          interaction.editReply({
            content: `**The file URL has been added to the database!** \n ${urlString}`,
            ephemeral: false,
          });

  
  
      } catch (error) {
        console.error('Error saving file:', error);
        interaction.editReply({content:'An error occurred while saving files.',   ephemeral: true});
      }
    },
  };
