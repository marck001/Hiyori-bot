const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')
const { getResponse } = require('../../functions/API/getResponse')
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/chatbot.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const { getMessageHistory,addMessageToHistory} = require('../../modules/history/messageHistory')


/**
 *
 * @param {Client} client
 * @param {Message} message
 */

function containsPing(content, pings) {
    const wordsPatterns = pings.map(word => new RegExp(word.split('').join('[\\s-]*'), 'i'));
    return wordsPatterns.some(pattern => pattern.test(content.toLowerCase()));
}

async function sendMessage(message, messageContent, isPing, tokenIndex) {
    message.channel.sendTyping();
    const metadata = {
        userId: message.author.id,
        username: message.author.displayName,
        channelId: message.channel.id,
        messageId: message.id,
        isPing: isPing,
    };
    const channel = message.channel;

    addMessageToHistory('user', message.content, metadata);

    const history = getMessageHistory(message.channel.id);
    const replyMessage = await getResponse(history,messageContent, tokenIndex);

    if (replyMessage) {
        await channel.send(replyMessage);
        console.log("Debug message: ", replyMessage)
    }
}

function findRandomEmoji(content, emojis) {
    const emojiRegex = /^<a?:\w+:\d+>$/;
    const isSingleEmoji = emojiRegex.test(content);

    let matchedEmojis;

    if (isSingleEmoji) {
        const emojiName = content.match(/:\w+:/)[0].slice(1, -1).toLowerCase();
        matchedEmojis = emojis.filter(emoji => emoji.name.toLowerCase().includes(emojiName));
    } else {
        const words = content.toLowerCase().split(/\s+/);
        matchedEmojis = emojis.filter(emoji => {
            const emojiName = emoji.name.toLowerCase();
            return words.some(word => emojiName.includes(word) || word.includes(emojiName));
        });
    }

    const emojiArray = matchedEmojis.size > 0 ? Array.from(matchedEmojis.values()) : Array.from(emojis.values());
    if (emojiArray.length === 0) return null;

    const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
    return randomEmoji.animated ? `<a:${randomEmoji.name}:${randomEmoji.id}>` : `<:${randomEmoji.name}:${randomEmoji.id}>`;
}

module.exports = async (client, message) => {

    try {
        const config = await getConfig(message.guild.id, 'free-will')
        if (!config || config.isActive === false) return;
        const allowedChannelId = config.channelId;
        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || message.channel.id !== allowedChannelId || message.author.bot || message.stickers.size) return;
        const pings = ['<@1277282990782677034>', '@SpamEnjoyed.1984#4354', '@SpamEnjoyed'];

        if (containsPing(message.content, pings)) {
          await  message.react('<:ping:1343646967854534676>')
          return await sendMessage(message, `user:${message.author.displayName} pinged you, message: ${message.content}`, true, client.tokenIndex)
        }
        const messageChance = 1;
        const randomNum = Math.random();

        if (randomNum > messageChance) return;
        

        const emojiFormat = findRandomEmoji(message.content, message.guild.emojis.cache);
        if (!emojiFormat) return;

        const reactionChance = 0;
        const randomValue = Math.random();

        if (randomValue < reactionChance) {
            await message.react(emojiFormat);
        } else {
            await sendMessage(message, `user:${message.author.displayName} message: ${message.content}`,false, client.tokenIndex)
            console.log(" inner token index ", client.tokenIndex)

        }
    } catch (err) {
        client.tokenIndex = client.tokenIndex >= jsonData.tokens.size ? 0 : client.tokenIndex + 1;
        await sendMessage(message, `user:${message.author.displayName} message: ${message.content} `, false,client.tokenIndex)
        console.log("There was an error: ", err, " token index ", client.tokenIndex)
    }
};