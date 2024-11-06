const { Client, Message } = require('discord.js');
require('dotenv').config();
/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {



    if (!message.inGuild() || message.author.id !== process.env.BOT) return;


    if (message.client.deleteMessages) {
        try {
            let botMessage = message.content;

            let channel = message.channel;
            message.delete();

            if (botMessage) {
                channel.send(botMessage);
                console.log(`Deleted message from bot`);
            }

        } catch (error) {
            console.error(`Could not delete message: ${error}`);
        }
    }


};
