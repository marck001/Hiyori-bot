const { getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const { isVoiceChannel } =require("../../modules/voice-channels/isVoiceChannel")
module.exports = {
  name: 'leave-vc',
  description: 'Leaves the voice channel where you are in',
  deleted: false,
  devOnly: true,

  callback: async (client, interaction) => {

    try{
    const myChannel = interaction.member.voice.channel;

    if (!isVoiceChannel(interaction)) return;


    client.distube.voices.leave(interaction);

        interaction.reply({
          content: `Successfully left the voice channel **${myChannel.name}**`,
          ephemeral: true,
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          console.log('The connection has entered the disconnected state');
        });

    

  }catch(err){
    console.log(err)
  }

  },
};
