const {
  ApplicationCommandOptionType,
  PermissionFlagsBits, ChannelType,
} = require('discord.js');
const { isVoiceChannel } = require('../../modules/voice-channels/isVoiceChannel')
module.exports = {

  name: 'play',
  description: 'Plays music',
  options: [
    {
      name: 'music-url',
      description: 'The message to send',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  devOnly: true,

  callback: async (client, interaction) => {
    const url = interaction.options.getString('music-url');


    try {

      const voiceChannel = interaction.member.voice.channel;

      if (!isVoiceChannel(interaction)) return;

      console.log('first')
      await interaction.deferReply();

      console.log('second')
    
      await client.distube.play(voiceChannel, url, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction,
      })

      
      console.log('Playing audio')

      await interaction.followUp({
        content: 'Playing audio...',
        ephemeral:true
      });


    } catch (err) {

      console.log(err)
      await interaction.followUp({
        content: `Someone tell Mac, there's a problem with my system.`,
        ephemeral: true,
      });

    }
  },
};
