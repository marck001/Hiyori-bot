const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');

const Playlist = require('../../models/Playlist');

module.exports = {

    name: 'add-song',
    description: 'Creates a playlist',
    options: [
        {
            name: 'name',
            description: 'Name for the playlist',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'song',
            description: 'New Song to add',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    devOnly: true,

    callback: async (client, interaction) => {
        const name = interaction.options.getString('name');
        const song = interaction.options.getString('song');


        try {

            const userId = interaction.user.id;
            const guildId = interaction.guild.id;

            await interaction.deferReply();
            const playlist = await Playlist.findOne({ name:name, guildId: guildId });
            if (!playlist) {
                return interaction.editReply('Playlist not found or you do not have permission to modify it.');
            }

            playlist.songs.push(song);
            await playlist.save();

            await interaction.followUp({
                content: `Song has been added to **${name}**.`,
                ephemeral: true
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
