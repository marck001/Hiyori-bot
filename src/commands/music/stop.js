
const { isVoiceChannel } =require("../../functions/voice-channels/isVoiceChannel")
module.exports = {
    name: 'stop',
    description: 'Stops the current music being played',
    deleted: false,
    devOnly: true,

    callback: async (client, interaction) => {

        try {

            if (!isVoiceChannel(interaction)) return;
            const voiceChannel= interaction.member.voice.channel;

            const queue = client.distube.getQueue(interaction);

            if (!queue) {
            await    interaction.reply("Queue is empty");
                return;
            }

            if (queue.playing) {
            await    queue.stop(interaction);

             await   interaction.reply("I stopped playing music");

            } else {
               await  interaction.reply("Nothing is getting played")
            }

        

        } catch (err) {
            console.log(err)
        }

    },
};
