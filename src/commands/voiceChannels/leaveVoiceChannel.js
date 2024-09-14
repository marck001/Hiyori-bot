const { getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: 'leave-vc',
  description: 'Leaves the voice channel where you are in',
  deleted: false,
  devOnly: true,

  callback: async (client, interaction) => {

    const myChannel = interaction.member.voice.channel;

    if (myChannel) {
      const connection = getVoiceConnection(myChannel.guild.id);

      if (connection) {
        connection.destroy();

        interaction.reply({
          content: `Successfully left the voice channel **${myChannel.name}**`,
          ephemeral: true,
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          console.log('The connection has entered the disconnected state');
        });

      }
    }
    else {
      return interaction.reply({
        content: 'You must be in a Voice Channel!',
        ephemeral: true,
      });
    }


  },
};
