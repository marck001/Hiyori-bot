const { Client, Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')
const { getResponse } = require('../../functions/API/getResponse')
const { getMessageHistory, addMessageToHistory } = require('../../modules/history/messageHistory')
const actionEmbed = require('../../components/embeds/actionEmbed');


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
         
        await actionEmbed(replyMessage,message,isPing)
    
        console.log("Debug message: ", replyMessage,"token index",client.tokenIndex)
    }
}

function findRandomEmoji(content, emojis) {
    const customEmojiRegex = /<a?:\w+:(\d+)>/g;
    const matches = content.match(customEmojiRegex);


    if (matches) {
        const emojiIds = matches.map(match => match.match(/\d+/)[0]);
        const matchedEmojis = emojiIds.map(id => emojis.get(id)).filter(emoji => emoji); 
        if (matchedEmojis.length > 0) {
            return matchedEmojis[Math.floor(Math.random() * matchedEmojis.length)]; 
        }
    }

    const words = content.toLowerCase().split(/\s+/); 
    const emojiArray = Array.from(emojis.values());


    const matchingEmojis = emojiArray.filter(emoji => {
        const emojiName = emoji.name.toLowerCase();
        return words.some(word => emojiName.includes(word) || word.includes(emojiName));
    });


    if (matchingEmojis.length > 0) {
        return matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)];
    }

    return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

module.exports = async (client, message) => {

    try {
        const config = await getConfig(message.guild.id, 'free-will')
        if (!config || config.isActive === false) return;
        const allowedChannelId = config.channelId;
        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || message.channel.id !== allowedChannelId || client.user.id === message.author.id  ||message.author.bot) return;


        const pings = [`<@${client.user.id}>`,'<@1277282990782677034>'];

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

        if ( Math.random()> messageChance) return;


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