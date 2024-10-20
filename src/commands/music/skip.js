const {
    ApplicationCommandOptionType,
    ChannelType,
} = require('discord.js');
const { isVoiceChannel } = require('../../modules/voice-channels/isVoiceChannel')
const PlayList = require('../../models/Playlist');
module.exports = {

    name: 'skip',
    description: 'toggles autoplay mode',
    devOnly: true,
    callback: async (client, interaction) => {

        try {

            const voiceChannel = interaction.member.voice.channel;

            if (!isVoiceChannel(interaction)) return;

            console.log('first')
            await interaction.deferReply();



            const queue = client.distube.getQueue(voiceChannel);

            if (!queue || !queue.songs.length) {
                interaction.editReply("Queue is empty");
                return;
            }

            if (queue.playing) {

                await interaction.client.distube.skip(voiceChannel);

                console.log('skip')

                await interaction.followUp({
                    content: `**Skipped Song**`,
                    ephemeral: true
                });
            } else {
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
