const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Emoji = sequelize.define('Emoji', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    messageId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    guildId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['emotes-list-eliv', 'emotes-list-neurons', 'emotes-list-etc']], 
        },
    },
    frequency:{
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['weekly', 'monthly', 'yearly']], 
        },
    }
}, {
    tableName: 'Emojis',
    timestamps: true,
});

(async () => {
    try {
        await Emoji.sync({ alter: true }); 
        console.log('Emojis table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Emojis table:', error);
    }
})();

module.exports = Emoji;
