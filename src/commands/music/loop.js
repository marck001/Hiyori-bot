const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');
const { isVoiceChannel } = require('../../modules/voice-channels/isVoiceChannel')
const PlayList = require('../../models/Playlist');
module.exports = {

    name: 'loop',
    description: 'Repeats songs',
    options: [
        {
            name: 'number',
            description: 'Times to repeat',
            required: false,
            type: ApplicationCommandOptionType.Number
        },
    ],
    devOnly: true,

    callback: async (client, interaction) => {

        

        const num = interaction.options.get("num").value;

        try {

            if (!isVoiceChannel(interaction)) return; 

            const queue = bot.distube.getQueue(interaction);

            if (!queue) {
                await interaction.followUp({
                    content: `There's no queue`,
                    ephemeral: true
                });
                return;
            }

            if (queue.playing) {
                mode = queue.setRepeatMode(parseInt(message) || 0);
                mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";
                await interaction.followUp({
                    content: `Repeating ${mode} times.`,
                    ephemeral: true,
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
