const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')
/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {

    try {
        const config = await  getConfig(message.guild.id,'emoji-counter')
        if (!config || config.isActive ===false) return;
        const allowedChannelId = config.channelId;
        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || message.channel.id !== allowedChannelId || message.author.bot) return;

        const emojiRegex = /<a?:\w+:\d+>/g;

        const matches = message.content.match(emojiRegex);

        if (!matches || matches.length <= 5) return;


        const emojiCounts = {};

        matches.forEach(emoji => {
            emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        });

        const userMention = `<@${message.author.id}>`;
        let = resultMessage = ''
        let = resultEmoji = ''
        const maxMessageLength = 1900;

        for (const [emoji, count] of Object.entries(emojiCounts)) {
            const emojiId = emoji.match(/:\d+/)[0].slice(1);

            if (message.guild.emojis.cache.get(emojiId)) {

                resultMessage += `${userMention} has spammed  ${emoji}  **${count}** times\n`;
            } else {

                const emojiName = emoji.match(/:\w+:/)[0].slice(1, -1);
                resultMessage += `${userMention} has spammed *${emojiName}* **${count}** times\n`;
            }

            if (resultMessage.length >= maxMessageLength) {
                channel.send(resultMessage.trim());
                resultMessage = ''; 
            }
        }
        if (resultMessage.length > 0) {
            channel.send(resultMessage.trim());
        }

    } catch (err) {

        console.log("There was an error: ", err)
    }




};