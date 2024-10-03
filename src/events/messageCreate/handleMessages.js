const { Client, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');


/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = (client, message) => {

    const gifsFilePath = path.join(__dirname, '../../../data/gifs.json');
    const gifsData = JSON.parse(fs.readFileSync(gifsFilePath, 'utf8'));
 
    if (!message.inGuild() || message.author.bot) return;
    let = messageText = " ";
    switch (message.content.toLowerCase()) {

        case "hi":
        case "hello":
            messageText = gifsData.wave;
            break; 
            
        case "gn":
        case "goodnight":
            messageText = gifsData.sleep;
            break;
            

        case "@everyone":
            messageText = "https://tenor.com/view/everyone-ping-everyone-discord-discord-moment-gif-19916334";
            break;

        default:
            messageText = " ";



    }
    if (messageText !== " ") {
        let randIndex = Math.floor(Math.random() *  messageText.length);
        message.reply(messageText[randIndex]);

    }






};