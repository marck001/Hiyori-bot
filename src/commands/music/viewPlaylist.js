const {
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js');

const Song = require('../../models/Song');
const Playlist = require('../../models/Playlist')
const pagination = require('../../components/buttons/pajination')
module.exports = {
    name: 'view-playlist',
    description: 'Displays a list of all songs in a playlist',
    options: [
        {
            name: 'playlist',
            description: 'Select a playlist',
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: 'page',
            description: 'The selected page',
            required: false,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    deleted: false,
    devOnly: true,
    autocomplete: true,
    inGuild:true,


    callback: async (client, interaction) => {

        const page = interaction.options.getNumber('page') || 1;
        const playlistName = interaction.options.getString('playlist')
        try {
            const songs = await Song.findAll({
                where: { guildId: interaction.guild.id, playlist: playlistName },
                order: [['id', 'DESC']],
            });

            if (songs.length === 0) {
                return interaction.reply('No songs were found, the playlist is empty.');
            }

            let embeds = [];

            songs.forEach((song, index) => {

                const videoId = song.url.split('v=')[1]?.split('&')[0];
                const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

                const embed = new EmbedBuilder()
                    .setColor(Math.floor(Math.random() * 16777214) + 1)
                    .setTitle(`-------- List of Songs in ${playlistName} playlist --------`)
                    .setAuthor({ name: `Page ${index + 1} ` })
                    .addFields(
                        {
                            name: 'Created at: ',
                            value: song.createdAt.toISOString().split('T')[0],
                            inline: true
                        })
                    .addFields(
                        {
                            name: 'Added by: ',
                            value: `<@${song.userId}>`,
                            inline: false
                        },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Songs', iconURL: 'https://static.wikia.nocookie.net/projectsekai/images/f/f6/Hatsune_Miku_-_25-ji%2C_Nightcord_de._April_Fools_Chibi.png/revision/latest?cb=20230922025244' });

                if (thumbnail) {
                    embed.setImage(thumbnail);
                }


                embeds.push(embed)
            })


            const currentPage = page > embeds.length ? embeds.length : page;

            await pagination(interaction, embeds, currentPage - 1)


        } catch (error) {
            console.error('Error fetching streaks:', error);
            interaction.reply('An error occurred while fetching songs.');
        }
    },

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const guildId = interaction.guild.id;

        try {
            const playlists = await Playlist.findAll({ where: { guildId } });
            console.log('Focused value:', focusedValue);
            console.log('Retrieved playlists:', playlists);

            const filteredPlaylists = playlists
                .filter(playlist => playlist.name && playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase()));


            if (!filteredPlaylists.length) {
                await interaction.respond([{ name: 'No playlists found', value: 'none' }]);
                return;
            }

            await interaction.respond(
                filteredPlaylists.map(playlist => ({
                    name: playlist.name,
                    value: playlist.name,
                }))
            );
        } catch (err) {
            console.error('Error in autocomplete:', err);
            await interaction.respond([{ name: 'Error loading playlists', value: 'error' }]);
        }
    },
};
