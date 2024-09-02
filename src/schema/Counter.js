const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Counter = sequelize.define('Counter', {
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
    stickerName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Counter;
