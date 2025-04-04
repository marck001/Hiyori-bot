const {
  ApplicationCommandOptionType,

} = require('discord.js');
const { isVoiceChannel } = require('../../functions/voice-channels/isVoiceChannel')
const { hasRole} = require('../../functions/general/hasRole')
const Song = require('../../models/Song');
const Playlist = require('../../models/Playlist');


module.exports = {

  name: 'play-playlist',
  description: 'Plays music from a playlist',
  options: [
    {
      name: 'playlist',
      description: 'Select a playlist',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true, 
    },
    {
      name:'shuffle',
      description:'Randomize the playlist order',
      required:false,
      type:ApplicationCommandOptionType.Boolean,


    }
  ],
  devOnly: true,
  autocomplete: true,
  inGuild:true, 

  callback: async (client, interaction) => {
    const name = interaction.options.getString('playlist');
    const isShuffled = interaction.options.getBoolean('shuffle')

    try {

      const voiceChannel = interaction.member.voice.channel;
      const guildId = interaction.guild.id;

      if (!isVoiceChannel(interaction) ||!hasRole(interaction)) return;


      await interaction.deferReply();
 
      const playlist = await Playlist.findOne({ where: { guildId,  name } })
      if (!playlist) {
        return interaction.editReply('Playlist not found.');
      }

      const songs = await Song.findAll({ where: { guildId: guildId, playlist: name } })
      if (!songs.length) {
        return interaction.editReply('No songs found in the playlist.');
      }

      console.log('Processing songs:', songs.map(song => song.url));

      const queue = client.distube.getQueue(voiceChannel);
   
      if ( queue) {
        queue.songs = [];
        console.log('Previous queue cleared.');
      }

      if(isShuffled){
        songs.sort(() => Math.random() - 0.5);
      }

      const firstSong = songs[0];
      await client.distube.play(voiceChannel, firstSong.url, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction: interaction,
      });

    
      await interaction.followUp({
        content: `Playing **${name}** playlist...`,
        ephemeral: true,
      });

      for (let i = 1; i < songs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        console.log(songs[i].url)
        await client.distube.play(voiceChannel, songs[i].url, {
          textChannel: interaction.channel,
          member: interaction.member,
          interaction: interaction,
        });
      }

   
      console.log('All songs from the playlist are now playing.');

    } catch (err) {

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
       
      

        const playlists = await Playlist.findAll({ where: {  guildId } });
        console.log('that shit is not working')
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
