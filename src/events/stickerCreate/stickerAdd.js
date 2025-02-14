const { request } = require('undici');
const { getConfig } = require('../../functions/config/getConfig');
module.exports = async (client, newSticker) => {

    try {


        if (! newSticker.guild) {
            console.error("No guild associated with this sticker.");
            return;
        }
        const config = await  getConfig(newSticker.guild.id,'emote-library')
        if (!config || config.isActive ===false) return;
        const allowedChannelId = config.channelId;

        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || newEmoji.channel.id !== allowedChannelId ) return;

        const isAnimated = newSticker.format === 2 || newSticker.format === 4;

        const stickerURL = isAnimated
            ? `https://cdn.discordapp.com/stickers/${newSticker.id}.gif`
            : `https://cdn.discordapp.com/stickers/${newSticker.id}.png`;

       
        const { body } = await request(stickerURL);
        const imageBuffer = await body.arrayBuffer();


       
        if (!channel) {
            console.error("Channel not found!");
            return;
        }



        await channel.send({
            content: `New Sticker: ${newSticker.name} \n${stickerURL}`,
            files: [
                {
                    attachment: Buffer.from(imageBuffer),  
                    name: `${newSticker.name}.${isAnimated ? 'gif' : 'png'}` 
                }
            ]
        });
    } catch (err) {
        console.error("Error processing sticker:", err);
    }
};
