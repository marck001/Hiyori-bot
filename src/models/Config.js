const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Config = sequelize.define('Config', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    guildId: {
        type: DataTypes.STRING(19),
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING(19),
        allowNull: false,
    },
    channelType: {
        type: DataTypes.ENUM('emoji-counter', 'sticker-counter', 'streak-record', 'welcome','emote-library','free-will'),
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

(async () => {
    try {
        await Config.sync({ alter: true }); 
        console.log('Config table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Config table:', error);
    }
})();

module.exports = Config;
