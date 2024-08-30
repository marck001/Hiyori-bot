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
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
  
    callback: async (client, interaction) => {
      const channelObj = interaction.options.getChannel('channel');
      const message = interaction.options.getString('text');
      const channel = channelObj || interaction.channel;
      
      if (channel.type !== ChannelType.GuildText) {
        interaction.reply({
          content: `You cannot send a message to a category or non-text channel!`,
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
  