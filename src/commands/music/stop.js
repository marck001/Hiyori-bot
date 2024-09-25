const { VoiceConnectionStatus } = require('@discordjs/voice');
const { isVoiceChannel } =require("../../modules/voice-channels/isVoiceChannel")
module.exports = {
    name: 'stop',
    description: 'Stops the current music being played',
    deleted: false,
    devOnly: true,

    callback: async (client, interaction) => {

        try {

            if (!isVoiceChannel(interaction)) return;

            const queue = client.distube.getQueue(interaction);

            if (!queue) {
                interaction.reply("Queue is empty");
                return;
            }

            if (queue.playing) {
                queue.stop(interaction);
                interaction.reply("I stopped playing music");

            } else {
                interaction.reply("Nothing is getting played")
            }

        

        } catch (err) {
            console.log(err)
        }

    },
};
