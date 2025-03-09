const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,ChannelType,
  } = require('discord.js');
  
  module.exports = {
    
    name: 'send-message',
    description: 'Send messages to available channels',
    options: [
      {
        name: 'text',
        description: 'The message to send',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'channel',
        description :'Mention Channel',
        required: false,
        type: ApplicationCommandOptionType.Channel,

      }
      
    ],
    deleted: true,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    devOnly: true,
  
    callback: async (client, interaction) => {

      if (!interaction.inGuild()) {
        await interaction.reply({
          content: 'This command can only be used in a server!',
          ephemeral: true,
        });
        return;
      }

      const channelObj = interaction.options.getChannel('channel');
      const message = interaction.options.getString('text');
      const channel = channelObj || interaction.channel;


      
      if (channel.type === ChannelType.GuildCategory) {
        interaction.reply({
          content: `You cannot send a message to a category!`,
          ephemeral: true,
        });
        return;
      }

      if(!channel){
        interaction.reply({
          content: `That channel doesn't exist!`,
          ephemeral: true,
        });
      }else{
        channel.send({ content: message });
        interaction.reply({
        content: `Message sent to ${channel.name}!`,
        ephemeral: true,
      });
      }
    
      
      
    },
  };
  