const {
  ApplicationCommandOptionType,

} = require('discord.js');
const { isVoiceChannel } = require('../../modules/voice-channels/isVoiceChannel')
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
  ],
  devOnly: true,

  callback: async (client, interaction) => {
    const name = interaction.options.getString('playlist');

    try {

      const voiceChannel = interaction.member.voice.channel;
      const guildId = interaction.guild.id;

      if (!isVoiceChannel(interaction)) return;

      await interaction.deferReply();
 
      const playlist = await Playlist.findOne({ where: { guildId: guildId, name: name } })
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
       await queue.stop(); 
        console.log('Previous queue cleared.');
      }

      const firstSong = songs[0];
      await client.distube.play(voiceChannel, firstSong.url, {
        textChannel: interaction.channel,
        member: interaction.member,
        interaction: interaction,
      });

    
      await interaction.followUp({
        content: `Playing ${name} playlist...`,
        ephemeral: true,
      });

     
      for (let i = 1; i < songs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        console.log(songs[i].url)
        await client.distube.play(voiceChannel, songs[i].url, {
          textChannel: interaction.channel,
          member: interaction.member,
          interaction: interaction,
        });
      }

      console.log('All songs from the playlist are now playing.');


      /*
      const playSongs = (songs, delay) => {
        let index = 0;

        const playNextSong = () => {
          if (index < songs.length) {
            const song = songs[index];
            console.log(song.url)
            client.distube.play(voiceChannel, song.url, {
              textChannel: interaction.channel,
              member: interaction.member,
              interaction: interaction,
            });

            index++;
          
            setTimeout(playNextSong, delay);
          }
        };  
        playNextSong();
      };

      const delay = 5000;  
      playSongs(songs, delay);

      
    
      console.log('Playing playlist')


      await interaction.followUp({
        content: `Playing ${name} playlist...`,
        ephemeral: true
      });

      */

    
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
       
        const playlists = await Playlist.findAll({ where: { guildId: guildId } });
        
     
        const filteredPlaylists = playlists
            .filter(playlist => playlist.name && playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

      
        await interaction.respond(
            filteredPlaylists.map(playlist => ({
                name: playlist.name,
                value: playlist.name,
            }))
        );
    } catch (err) {
        console.error('Error in autocomplete:', err);
        await interaction.respond([]); 
    }
},
};
