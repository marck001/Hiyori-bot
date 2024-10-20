const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
  } = require('discord.js');
  const { isVoiceChannel } = require('../../modules/voice-channels/isVoiceChannel')
  const PlayList = require('../../models/Playlist'); 
  module.exports = {
  
    name: 'autoplay',
    description: 'toggles autoplay mode',
    options: [
      {
        name: 'playlist',
        description: 'Selected playlist only',
        required: false,
        type: ApplicationCommandOptionType.String,
      },
    ],
    devOnly: true,
  
    callback: async (client, interaction) => {
      const  playlist = interaction.options.getString('playlist');
  
  
      try {
  
        const voiceChannel = interaction.member.voice.channel;
  
        if (!isVoiceChannel(interaction)) return;
  
        console.log('first')
        await interaction.deferReply();
  


        const queue = client.distube.getQueue(interaction);

        if (!queue) {
          interaction.editReply("Queue is empty");
          return;
        }

        if(queue.playing){
          const autoplay = interaction.client.distube.toggleAutoplay(voiceChannel);
  
        
        
          console.log('Autplaylist')
    
          await interaction.followUp({
            content: `Auto play list**${autoplay ? 'enabled' : 'disabled'}**`,
            ephemeral:true
          });
        }else{
          interaction.editReply("Nothing is getting played");
        }
      

       
  
  
      } catch (err) {
  
        console.log(err)
        await interaction.followUp({
          content: `Someone tell Mac, there's a problem with my system.`,
          ephemeral: true,
        });
  
      }
  
  
  
  
    },
  };
  