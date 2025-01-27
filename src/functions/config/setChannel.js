




require('dotenv').config();
const Config = require('../../models/Config');



async function setChannel(i, guildId, channelId, channelType, isActive) {
    try {

        const [config, created] = await Config.findOrCreate({
            where: { guildId, channelType },
            defaults: { channelId, isActive },
        });
        if (!created) {
            const oldChannelId = config.channelId;
            if (oldChannelId !== channelId) {

                await config.update({ channelId, isActive });
                return i.editReply({
                    content: `The channel for **${channelType}** has been updated from <#${oldChannelId}> to <#${channelId}> `,
                    ephemeral: false,
                });
            } else {
                return i.editReply({
                    content: `That **${channelType}** function had been already set in  <#${oldChannelId}> previously `,
                    ephemeral: false,
                });
            }


        }
        return i.editReply({
            content: `The **${channelType}** has been set in <#${channelId}> `,
            ephemeral: false,
        });


    } catch (err) {
        console.error('Error :', err);
        throw err;
    }

}

module.exports = { setChannel };