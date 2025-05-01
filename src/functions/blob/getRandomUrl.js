
const Blob = require('../../models/Blob');
const sequelize = require('../../db/sequelize');

async function getRandomUrl(guildId) {
    try {
        const blob = await Blob.findOne({ order: sequelize.random(), where: { guildId: guildId } })
        if (blob) return blob.url;
        return null


    } catch (err) {
        console.error('Error retrieving random URL:');
        throw err;
    }

}

module.exports = { getRandomUrl };