const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Playlist = sequelize.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    guildId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    songs: {
        type: DataTypes.JSON,
        defaultValue: [],
    },

}, {
    tableName: 'Playlists',
    timestamps: true,
});

(async () => {
    try {
        await Playlist.sync({ force: true }); 
        console.log('PlayList table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Playlist table:', error);
    }
})();

module.exports = Playlist;
