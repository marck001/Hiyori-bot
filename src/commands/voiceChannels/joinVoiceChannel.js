const { VoiceConnectionStatus } = require('@discordjs/voice');
const { isVoiceChannel } =require("../../functions/voice-channels/isVoiceChannel")
module.exports = {
  name: 'join-vc',
  description: 'Joins the voice channel where you are in',
  deleted: false,
  devOnly: true,

  callback: async (client, interaction) => {

    try {
      const myChannel = interaction.member.voice.channel;


      if (isVoiceChannel(interaction)) {


        client.distube.voices.join(myChannel);

        interaction.reply({
          content: `Successfully joined the voice channel **${myChannel.name}** - ready to play audio!`,
          ephemeral: true,
        });

      } else {
        interaction.reply("first you need be in a voice channel");
      }
    } catch (err) {
      console.log("There was an error")
    }


  }
};
