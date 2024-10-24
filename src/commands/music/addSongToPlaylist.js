const {
    ApplicationCommandOptionType,
    PermissionFlagsBits, ChannelType,
} = require('discord.js');

const Playlist = require('../../models/Playlist');
const Song  = require('../../models/Song');
const { isValidYtUrl } = require('../../modules/blob/validYtUrl')
module.exports = {

    name: 'add-song',
    description: 'add song to a playlist',
    options: [
        {
            name: 'name',
            description: 'Select a playlist',
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
       
        {
            name: 'song-url',
            description: 'New Song to add',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    devOnly: true,

    callback: async (client, interaction) => {
        const name = interaction.options.getString('name');
        const url = interaction.options.getString('song-url');


        try {

            if(!isValidYtUrl(url)){
                return  interaction.reply({
                    content: `You must provide a youtube url`,
                    ephemeral: true,
                });
            }

            const userId = interaction.user.id;
            const guildId = interaction.guild.id;

            await interaction.deferReply();
            const playlist = await Playlist.findOne({where:{ name:name, guildId: guildId }});
            if (!playlist) {
                return interaction.editReply('Playlist not found.');
            }

            const song =  new Song({userId: userId,  playlist: name,  guildId: guildId , url:url});
            
            await song.save();

            await interaction.followUp({
                content: `Song has been added to **${name}**.`,
                ephemeral: true
            });

        }catch (err) {

            console.log(err)
            await interaction.followUp({
                content: `Someone tell Mac, there's a problem with my system.`,
                ephemeral: true,
            });

        }


    },


    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const guildId = interaction.guild.id;

        try {

            console.log("Autocomplete invoked"); 
           
            const playlists = await Playlist.findAll({ where: { guildId: guildId } });
            
         
            const filteredPlaylists = playlists
                .filter(playlist => playlist.name && playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

          
            await interaction.respond(
                filteredPlaylists.map(playlist => ({
                    name: playlist.name,
                    value: playlist.name,
                }))
            );
            console.log(guildId)
        } catch (err) {
            console.error('Error in autocomplete:', err);
            await interaction.respond([]); 
        }
    },
};


