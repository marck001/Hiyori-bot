
const Blob = require('../../models/Blob');
const sequelize = require('../../db/sequelize');

async function getRandomUlr() {
    try {
        const blob = await Blob.findOne({ order: sequelize.random() })

        const blobUrl = blob.url;
        if (!blob) {
            throw new Error('No blob found.');
        }

        console.log(blobUrl)
        return blobUrl;

    } catch (err) {
        console.error('Error retrieving random URL:', err);
        throw err;
    }

}

module.exports = { getRandomUlr };