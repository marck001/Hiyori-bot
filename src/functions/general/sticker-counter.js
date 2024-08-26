let lastStickerId = null;
let streakCount = 0;
let lastStickerName = '';
require('dotenv').config();

function countStickerStreak(message, client) {

    try {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);


        if (!message.stickers.size || !channel || message.channel.id !== process.env.CHANNEL_ID) return;

        const sticker = message.stickers.first();
        const stickerId = sticker.id;
        const stickerName = sticker.name;
        if (stickerId === lastStickerId) {
            streakCount++;
            if (streakCount % 5 === 0) {
                console.log(`${stickerName} has a streak of: ${streakCount}`);
                channel.send(`**${stickerName}** has a streak of ** ${streakCount}**!`)
            }
        } else {
            if (streakCount >= 5) {
                console.log(`Streak was broken`);
                const userMention = `<@${message.author.id}>`;
                channel.send(`${userMention} broke the **${lastStickerName}** streak of ${streakCount}!`);
            }
            streakCount = 1;
            lastStickerId = stickerId;
            lastStickerName = stickerName;
        }
        console.log(streakCount)
    } catch (err) {
        console.log("There was an error: ", err)
    }
}

module.exports = { countStickerStreak };