const Counter = require('../../models/Counter');
let lastStickerId = null;
let streakCount = 0;
let lastStickerName = '';
require('dotenv').config();
const { getRandomUlr} = require('../../modules/blob/getRandomUrl');

async function countStickerStreak(message, client) {

    try {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);

        //const streakChannel = client.channels.cache.get(process.env.STREAK_ID);

        if (!message.stickers.size || !channel || message.channel.id !== process.env.CHANNEL_ID) return;

        const sticker = message.stickers.first();
        const stickerId = sticker.id;
        const stickerName = sticker.name;
        if (stickerId === lastStickerId) {
            streakCount++;
            switch (true) {
                case (streakCount % 1000 === 0):
                    channel.send(`Incredible! **${stickerName}** has reached a streak of **${streakCount}**! <:hiyoriHeart:1280172714283237406>`);
                    channel.send('https://cdn.discordapp.com/emojis/1181355299618177035.gif')
                    break;
                case (streakCount % 100 === 0):
                    channel.send(`Wow, **${stickerName}** has a streak of **${streakCount}**! <:hiyoriHeart:1280172714283237406>`);
                    channel.send( await getRandomUlr() || 'No files stored :(')
                    break;
                case (streakCount % 5 === 0):
                    channel.send(`**${stickerName}** has a streak of **${streakCount}**!`);
                    break;
            }
        } else {
            if (streakCount >= 5) {
                console.log(`Streak was broken`);
                const userMention = `<@${message.author.id}>`;
                channel.send(`${userMention} broke the **${lastStickerName}** streak of ${streakCount}!`);


                const counter = await Counter.findOne({
                    where: { guildId: message.guild.id },
                    order: [['streak', 'DESC']],
                  });

                  if (!counter || streakCount > counter.streak) {
                    const newCounter = await Counter.create({
                      userId: message.author.id,
                      guildId: message.guild.id,
                      stickerName: lastStickerName,
                      streak: streakCount,
                      date: new Date(), 
                    });
          
                    console.log(newCounter.toJSON());
                    channel.send(`*The new current streak record is* **${streakCount}**! \n <:hiyoriHeart:1280172714283237406>`);
                  }
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