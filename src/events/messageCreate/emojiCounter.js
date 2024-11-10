const { Client, Message } = require('discord.js');
require('dotenv').config();

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = (client, message) => {

    try {
        const allowedChannelId = process.env.CHANNEL_ID;
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
        for (const [emoji, count] of Object.entries(emojiCounts)) {
            const emojiId = emoji.match(/:\d+/)[0].slice(1);

            if (message.guild.emojis.cache.get(emojiId)) {

                resultMessage += `${userMention} has spammed  ${emoji}  **${count}** times\n`;
            } else {

                const emojiName = emoji.match(/:\w+:/)[0].slice(1, -1);
                resultMessage += `${userMention} has spammed *${emojiName}* **${count}** times\n`;
            }
        }
        channel.send(resultMessage);

    } catch (err) {

        console.log("There was an error: ", err)
    }




};