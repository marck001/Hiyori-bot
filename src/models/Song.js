const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Song = sequelize.define('Song', {
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
    playlist: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    tableName: 'Songs',
    timestamps: true,
});

(async () => {
    try {
        await Song.sync({ alter: true }); 
        console.log('Songs table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Songs table:', error);
    }
})();

module.exports = Song;
