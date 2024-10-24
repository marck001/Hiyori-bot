const {
    ApplicationCommandOptionType,
    EmbedBuilder, 
} = require('discord.js');

const Song = require('../../models/Song');
const  pagination = require('../../components/buttons/pajination')
module.exports = {
    name: 'view-playlist',
    description: 'Displays a list of all songs in a playlist',
    options: [
        {
            name: 'playlist',
            description: 'Select a playlist',
            required: true,
            type: ApplicationCommandOptionType.String,
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

    callback: async (client, interaction) => {

        const page = interaction.options.getNumber('page') || 1;
        const playlistName = interaction.options.getString('playlist')
        try {
            const songs = await Song.findAll({
                where: { guildId: interaction.guild.id, playlist:playlistName },
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
                     /*   {
                            name: 'File name:',
                            value: blob.name,
                            inline: true
                        },*/
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
};
