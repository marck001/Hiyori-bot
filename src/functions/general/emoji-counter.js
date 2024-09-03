require('dotenv').config();


function countEmoji(message, client) {


    try {
        const allowedChannelId = process.env.CHANNEL_ID;
        const channel = client.channels.cache.get(allowedChannelId);


        if (!channel || message.channel.id !== allowedChannelId || message.author.bot) return;

        const emojiRegex = /<a?:\w+:\d+>/g;

        const matches = message.content.match(emojiRegex);

        if (!matches || matches.length <= 5) return;

      
        const emojiCounts = {};

        matches.forEach(emoji => {
            if (emojiCounts[emoji]) {
                emojiCounts[emoji]++;
            } else {
                emojiCounts[emoji] = 1;
            }
        });


        const userMention = `<@${message.author.id}>`;
        let = resultMessage = ''
        let = resultEmoji = ''
        for (const [emoji, count] of Object.entries(emojiCounts)) {
            const emojiName = emoji.match(/:\w+:/)[0].slice(1, -1);
            resultMessage += `${userMention} has spammed ${emojiName} **${count}** times\n`;
        }
        channel.send(resultMessage);

    } catch (err) {

        console.log("There was an error: ", err)
    }

}

module.exports = { countEmoji };