const { request } = require('undici');

module.exports = async (client, newEmoji) => {

    console.log("working emojis");

    try {

        console.log(newEmoji);


        if (!newEmoji.guild) {
            console.error("No guild associated with this emoji.");
            return;
        }

        const emojiURL = newEmoji.animated
            ? `https://cdn.discordapp.com/emojis/${newEmoji.id}.gif`
            : `https://cdn.discordapp.com/emojis/${newEmoji.id}.png`;

       
        const { body } = await request(emojiURL);
        const imageBuffer = await body.arrayBuffer();


        const channel = newEmoji.guild.channels.cache.get('1307350353863250051');
        const channel2 = newEmoji.guild.channels.cache.get('1277232456201670708');
        if (!channel) {
            console.error("Channel not found!");
            return;
        }


        const emojiString = newEmoji.animated
        ? `<a:${newEmoji.name}:${newEmoji.id}>`
        : `<:${newEmoji.name}:${newEmoji.id}>`;


        await channel.send(`New emoji uploaded: ${emojiString}`);

        await channel2.send({
            content: `${newEmoji.name}: ${emojiString}`,
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
