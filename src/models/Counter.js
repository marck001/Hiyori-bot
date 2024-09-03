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
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
  
    timestamps: false,
});

(async () => {
    try {
        await Counter.sync({ alter: true }); 
        console.log('Counter table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Blob table:', error);
    }
})();

module.exports = Counter;
