let lastStickerId = null;
let streakCount = 0;
let lastStickerName = '';
require('dotenv').config();

function countStickerStreak(message, client) {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    console.log(channel.id)
    if (!message.stickers.size || !channel) return;

    const sticker = message.stickers.first();
    const stickerId = sticker.id;
    const stickerName = sticker.name;
    if (stickerId === lastStickerId) {
        streakCount++;
        if (streakCount % 5 === 0) {
            console.log(`${stickerName} has a streak of: ${streakCount}`);
            channel.send(`**${stickerName}** has a streak of ** ${streakCount}**`)
        }
    } else {
        if (streakCount >= 5) {
            console.log(`Streak was broken`); 
            channel.send(`**${lastStickerName}** streak  of ${streakCount } was broken`);    
        }
        streakCount = 1; 
        lastStickerId = stickerId;
        lastStickerName = stickerName;



    }

    console.log(streakCount)


}

module.exports = { countStickerStreak };