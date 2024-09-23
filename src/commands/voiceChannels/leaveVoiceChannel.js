const { getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: 'leave-vc',
  description: 'Leaves the voice channel where you are in',
  deleted: false,
  devOnly: true,

  callback: async (client, interaction) => {

    try{
    const myChannel = interaction.member.voice.channel;

    const queue = client.distube.getQueue(interaction);

    if (!queue) {
      interaction.reply("Queue is empty");
      return;
    }

    //if (myChannel) {
     // const connection = getVoiceConnection(myChannel.guild.id);

    //  if (connection) {
       // connection.destroy();

       if (queue.playing) {
        queue.stop(interaction);

      } else {
        console.log("Nothing is getting played")
      }


        interaction.reply({
          content: `Successfully left the voice channel **${myChannel.name}**`,
          ephemeral: true,
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          console.log('The connection has entered the disconnected state');
        });

     // }
   /* }
    else {
      return interaction.reply({
        content: 'You must be in a Voice Channel!',
        ephemeral: true,
      });
    }
      */

  }catch(err){
    console.log(err)
  }

  },
};
