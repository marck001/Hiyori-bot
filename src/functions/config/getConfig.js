
require('dotenv').config();
const Config = require('../../models/Config');


async function getConfig(guildId, type) {
    try {
        const config = await Config.findOne({ where: { guildId: guildId,channelType:type}})
        return config;

    } catch (err) {
        console.error('Error :', err);
        throw err;
    }

}

module.exports = {  getConfig };