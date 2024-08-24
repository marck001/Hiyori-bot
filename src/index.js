require('dotenv').config();
const { Client, IntentsBitField, Message} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const messageHandler = require('./events/messageCreate/handleMessages');
const {countStickerStreak }= require('./functions/general/sticker-counter')
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessageReactions
  ],
});

/**
 *
 * @param {Client} client
 * @param {Message} message
 */



eventHandler(client);

client.on('messageCreate', (message) => {
  countStickerStreak(message, client)
  messageHandler(client, message);
});



client.on('ready', (c) => {
  client.user.setActivity('hosting');

});

client.login(process.env.TOKEN);
