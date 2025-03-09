const { request } = require('undici');
const { getConfig } = require('../../functions/config/getConfig');
module.exports = async (client,oldEmoji, newEmoji) => {

   

    try {

       
        const config = await  getConfig(newEmoji.guild.id,'emote-library')
        if (!config || config.isActive ===false) return;
        const allowedChannelId = config.channelId;

        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || newEmoji.channel.id !== allowedChannelId ) return;

        const emojiURL = newEmoji.animated
            ? `https://cdn.discordapp.com/emojis/${newEmoji.id}.gif`
            : `https://cdn.discordapp.com/emojis/${newEmoji.id}.png`;

       
        const { body } = await request(emojiURL);
        const imageBuffer = await body.arrayBuffer();


       
        if (!channel) {
            console.error("Channel not found!");
            return;
        }


        const emojiString = newEmoji.animated
        ? `<a:${newEmoji.name}:${newEmoji.id}>`
        : `<:${newEmoji.name}:${newEmoji.id}>`;

        await channel.send({
            content: ` ${oldEmoji.name} ${emojiString} has been updated to ${newEmoji.name} by `,
            files: [
                {
                    attachment: Buffer.from(imageBuffer),  
                    name: `${newEmoji.name}.${newEmoji.animated ? 'gif' : 'png'}` 
                }
            ]
        });
    } catch (err) {
        console.error("Error processing emoji:", err);
    }
};
