const { request } = require('undici');

module.exports = async (client, newSticker) => {

    try {


        if (! newSticker.guild) {
            console.error("No guild associated with this sticker.");
            return;
        }

        const isAnimated = newSticker.format === 2 || newSticker.format === 4;

        const stickerURL = isAnimated
            ? `https://cdn.discordapp.com/stickers/${newSticker.id}.gif`
            : `https://cdn.discordapp.com/stickers/${newSticker.id}.png`;

       
        const { body } = await request(stickerURL);
        const imageBuffer = await body.arrayBuffer();


        const channel = newSticker.guild.channels.cache.get('1277232456201670708');
       
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
