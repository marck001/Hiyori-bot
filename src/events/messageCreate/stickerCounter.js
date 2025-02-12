const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig');
const Counter = require('../../models/Counter');
const streakRecordCanva = require('../../components/canvas/streakRecord');
const { getRandomUrl } = require('../../functions/blob/getRandomUrl')

const streakData = new Map(); 
/**
 *
 * @param {Client} client
 * @param {Message} message
 */
async function updateHighestStreak(guildId) {
    const counter = await Counter.findOne({
        where: { guildId },
        order: [['streak', 'DESC']],
    });
    return counter ? counter.streak : 0;
}

module.exports = async (client, message) => {
    try {
        if (!message.stickers.size || message.author.bot) return;

        const config = await getConfig(message.guild.id, 'sticker-counter');
        if (!config || !config.isActive) return;

        const channel = client.channels.cache.get(config.channelId);
        if (!channel || message.channel.id !== config.channelId) return;

        if (!streakData.has(message.guild.id)) {
            streakData.set(message.guild.id, {
                lastStickerId: null,
                lastStickerName: '',
                lastSticker: null,
                streakCount: 0,
                highestStreak: await updateHighestStreak(message.guild.id),
            });
        }

        const serverStreak = streakData.get(message.guild.id);
        const sticker = message.stickers.first();
        const stickerId = sticker.id;
        const stickerName = sticker.name;
        const guildId = message.guild.id;

        if (stickerId === serverStreak.lastStickerId) {
            serverStreak.streakCount++;
            switch (true) {
                case (serverStreak.streakCount % 1000 === 0):
                    channel.send(`Incredible! **${stickerName}** has reached a streak of **${serverStreak.streakCount}**!`);
                    channel.send('https://cdn.discordapp.com/emojis/1181355299618177035.gif');
                    break;
                case (serverStreak.streakCount % 10 === 0):
                    channel.send(`Wow, **${stickerName}** has a streak of **${serverStreak.streakCount}**!`);
                    channel.send(await getRandomUrl(guildId) || 'No files stored :(');
                    break;
                case (serverStreak.streakCount % 5 === 0):
                    channel.send(`**${stickerName}** has a streak of **${serverStreak.streakCount}**!`);
                    channel.send(await getRandomUrl(guildId) || 'No files stored :(');
                    break;
            }
            console.log("server count ",serverStreak.streakCount)
        } else {
            if (serverStreak.streakCount >= 5) {
                console.log(`Streak was broken`);
                const userMention = `<@${message.author.id}>`;
                channel.send(`${userMention} broke the **${serverStreak.lastStickerName}** streak of ${serverStreak.streakCount}!`);

                if (serverStreak.streakCount > serverStreak.highestStreak) {
                    await Counter.create({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        stickerName: serverStreak.lastStickerName,
                        streak: serverStreak.streakCount,
                        date: new Date(),
                    });

                    serverStreak.highestStreak = serverStreak.streakCount;
                    const recordConfig = await getConfig(message.guild.id, 'streak-record') || channel;
                    const recordChannel = (!config || !config.isActive)? client.channels.cache.get(recordConfig.channelId) : channel;
                    await streakRecordCanva(serverStreak.streakCount, serverStreak.lastSticker, serverStreak.highestStreak, message.author, recordChannel);
                }
            }
            serverStreak.streakCount = 1;
            serverStreak.lastStickerId = stickerId;
            serverStreak.lastStickerName = stickerName;
            serverStreak.lastSticker = sticker;
        }
    } catch (err) {
        console.log("There was an error: ", err);
    }
};
