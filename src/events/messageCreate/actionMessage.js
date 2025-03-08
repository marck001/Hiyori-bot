const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')
const { getResponse } = require('../../functions/API/getResponse')
const { getMessageHistory, addMessageToHistory } = require('../../modules/history/messageHistory')
const filterEmbed = require('../../components/embeds/filterEmbed');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

function containsPing(content, pings) {
    const wordsPatterns = pings.map(word => new RegExp(word.split('').join('[\\s-]*'), 'i'));
    return wordsPatterns.some(pattern => pattern.test(content.toLowerCase()));
}

async function sendMessage(client, message, messageContent, isPing, tokenIndex) {
    // await new Promise(resolve => setTimeout(resolve, 8000)); 
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

    const replyMessage = await getResponse(client, history, messageContent, tokenIndex);

    if (replyMessage) {
        await channel.send(replyMessage);
        if (replyMessage.includes('FILTERED!')) {
         //   if (isPing) {
                message.delete();
                await filterEmbed(message.content, message.author, channel)
       //     } else {
         //       await channel.send(`-# I tried getting ${message.author.displayName} FILTERED!, but something went wrong. I guess you are saved for now`)
       //     }

        }
        console.log("Debug message: ", replyMessage,"token index",client.tokenIndex)
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

        if (!channel || message.channel.id !== allowedChannelId || client.user.id === message.author.id || message.stickers.size) return;

        console.log("username",client.user.username)

        const pings = ['<@1277282990782677034>', '@SpamEnjoyed.1984#4354', '@SpamEnjoyed'];

        if (containsPing(message.content, pings)) {
            await message.react('<:ping:1343646967854534676>')
            return await sendMessage(client, message, `user:${message.author.displayName} pinged you, message: ${message.content}`, true, client.tokenIndex)
        } else if (message.reference) {
            
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);


                if (repliedMessage.author.id === client.user.id) {

                    await sendMessage(client, message, `user:${message.author.displayName} message: ${message.content}`, false, client.tokenIndex);
                    return;
                }
           
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
            await sendMessage(client, message, `user:${message.author.displayName} message: ${message.content}`, false, client.tokenIndex)


        }
    } catch (err) {
        console.log("There was an error: ", err, " token index ", client.tokenIndex)
    }
};