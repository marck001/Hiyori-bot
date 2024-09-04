const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Blob = sequelize.define('Blob', {
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
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        isValidImageOrGifUrl(value) {
            const validExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.apng'];
            const isValid = validExtensions.some(ext => value.endsWith(ext));
            if (!isValid) {
                throw new Error('URL must point to a valid image or GIF.');
            }
        }
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['image', 'gif']],
        }
    },
    context: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'hiyori',
    },
}, {
    tableName: 'Blobs',
    timestamps: true,
});

(async () => {
    try {
        await Blob.sync({ alter: true }); 
        console.log('Blob table syncronyzed successfully');
    } catch (error) {
        console.error('Error creating Blob table:', error);
    }
})();

module.exports = Blob;
