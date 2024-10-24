require('dotenv').config();
const Playlist = require('../../models/Playlist');


async function getPlaylists() {
    try {
        const playlistArray = []
        const guildId = process.env.GUILD_ID;
        const playlists = await Playlist.findAll({ where: { guildId: guildId}})
        if (!playlists) {
            playlistArray.push({
                name: none,
                value: none,
              });
            
            throw new Error('No playlist  found.');
        }else{
            playlists.forEach(playlist => {
                playlistArray.push({
                  name: playlist.name,
                  value: playlist.name,
                });
              });
        }
  
        return playlistArray;

    } catch (err) {
        console.error('Error :', err);
        throw err;
    }

}

module.exports = {  getPlaylists };