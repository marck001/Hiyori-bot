const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')
const { getResponse } = require('../../functions/API/getResponse')
const { createWebHooK } = require('../../functions/general/createWebHook');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../data/chatbot.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));


/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {

    try {
        const config = await getConfig(message.guild.id, 'free-will')
        if (!config || config.isActive === false) return;
        const allowedChannelId = config.channelId;
        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || message.channel.id !== allowedChannelId || message.author.bot || message.stickers.size) return;
        const messageChance = 1;
        const randomNum = Math.random();
        console.log("response chance " + randomNum)

        if (randomNum > messageChance) return;

        const guild = message.guild;
        const emojis = guild.emojis.cache;

        const words = message.content.split(/\s+/);
        console.log("words ", words)

        let emojiFormat;

        const emojiRegex = /^<a?:\w+:\d+>$/;

        if (emojiRegex.test(message.content)) {

            const emojiName = message.content.match(/:\w+:/)[0].slice(1, -1);

            const similarEmojis = emojis.filter(emoji => {
                const serverEmojiName = emoji.name.toLowerCase();
                const inputEmojiName = emojiName.toLowerCase();

                return (
                    serverEmojiName.includes(inputEmojiName) ||
                    inputEmojiName.includes(serverEmojiName)
                );
            });

            if (similarEmojis.size > 0) {
                const emojiArray = Array.from(similarEmojis.values());
                const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
                emojiFormat = randomEmoji.animated ? `<a:${randomEmoji.name}:${randomEmoji.id}>` : `<:${randomEmoji.name}:${randomEmoji.id}>`;
            } else {
                const emojiArray = Array.from(emojis.values());
                if (emojiArray.length === 0) return ;
                const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
                emojiFormat = randomEmoji.animated ? `<a:${randomEmoji.name}:${randomEmoji.id}>` : `<:${randomEmoji.name}:${randomEmoji.id}>`;
            }
        } else {
            const words = message.content.toLowerCase().split(/\s+/);
            const matchedEmojis = emojis.filter(emoji => {
                const emojiName = emoji.name.toLowerCase();
                return words.some(word => emojiName.includes(word) || word.includes(emojiName));
            });

            if (matchedEmojis.size > 0) {

                const emojiArray = Array.from(matchedEmojis.values());
                const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
                emojiFormat = randomEmoji.animated ? `<a:${randomEmoji.name}:${randomEmoji.id}>` : `<:${randomEmoji.name}:${randomEmoji.id}>`;
            } else {

                const emojiArray = Array.from(emojis.values());
                if (emojiArray.length === 0) return ;
            
                const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
                emojiFormat = randomEmoji.animated ? `<a:${randomEmoji.name}:${randomEmoji.id}>` : `<:${randomEmoji.name}:${randomEmoji.id}>`;
            }
        }
        const reactionChance = 0;
        const randomValue = Math.random();
        console.log("response type " + randomValue)

        if (randomValue < reactionChance) {

            await message.react(emojiFormat);
        } else {
            message.channel.sendTyping();
            const webhookClient = createWebHooK('https://discord.com/api/webhooks/1341094940352053368/Iv0piACGIJFLU3Puv5vbhOZRh7iidc_78BTSunq4aM2A4HaW38QL4jQpibawLOmtm-x5')
            const replyMessage = await getResponse(`user:${message.author.displayName} message: ${message.content}`,client.tokenIndex);
            
            if(replyMessage){
                await webhookClient.send(replyMessage);
                console.log("Debug message: ",replyMessage)
            }

            console.log(" inner token index ",client.tokenIndex)

        }
    } catch (err) {
        client.tokenIndex = client.tokenIndex>jsonData.tokens.size ? 0 : client.tokenIndex +1;
        const replyMessage = await getResponse(`user:${message.author.displayName} message: ${message.content} `,client.tokenIndex);
            
        if(replyMessage){
            await webhookClient.send(replyMessage);
            console.log("Debug message: ",replyMessage)
        }
        console.log("There was an error: ", err," token index ",client.tokenIndex)
    }




};