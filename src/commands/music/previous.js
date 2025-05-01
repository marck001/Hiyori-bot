const { hasRole} = require('../../functions/general/hasRole')
const { isVoiceChannel } = require('../../functions/voice-channels/isVoiceChannel')
module.exports = {

    name: 'previous',
    description: 'goes back to previous song',
    devOnly: true,
    inGuild:true,
    callback: async (client, interaction) => {

        try {

            const voiceChannel = interaction.member.voice.channel;

            if (!isVoiceChannel(interaction) ||!hasRole(interaction)) return;

            console.log('first')
            await interaction.deferReply();

            const queue = client.distube.getQueue(voiceChannel);

            if (!queue || !queue.songs.length) {
            await    interaction.editReply("Queue is empty");
                return;
            }

            if (queue.playing) {

                await queue.previous();

                console.log('previous')

                await interaction.followUp({
                    content: `**Previous song**`,
                    ephemeral: true
                });
            } else {
              await  interaction.editReply("Nothing is getting played");
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
