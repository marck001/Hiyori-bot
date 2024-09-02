const sequelize = require('./db/sequelize'); 
require('dotenv').config();
const config = require('../config.json');
  (async () => {
    try {

      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync({ alter: true }); 
      console.log('Database synchronized.');

     
      const { Client, IntentsBitField, Message } = require('discord.js');
      //const mysql = require('mysql2/promise');
      const eventHandler = require('./handlers/eventHandler');
      //const messageHandler = require('./events/messageCreate/handleMessages');
      const { countStickerStreak } = require('./functions/general/sticker-counter')
      const { countEmoji } = require('./functions/general/emoji-counter')

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
        countStickerStreak(message, client);
        countEmoji(message, client);
        /* messageHandler(client, message); */
      });

      client.on('ready', (c) => {
        client.user.setActivity('Spam');

      });

      client.login(process.env.TOKEN);

    } catch (error) {
      console.log(`Error: ${error}`);
    }

  })();