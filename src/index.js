require('dotenv').config();
const initializeDatabase = require('./db/dbInit');
const { DisTube }= require('distube');
const { YtDlpPlugin } = require("@distube/yt-dlp");
  (async () => {
    try {

      await initializeDatabase();
     
      const { Client, IntentsBitField, Message } = require('discord.js');
      const eventHandler = require('./handlers/eventHandler');
      const { countStickerStreak } = require('./functions/general/sticker-counter')
      const { countEmoji } = require('./functions/general/emoji-counter')

      const client = new Client({
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.MessageContent,
          IntentsBitField.Flags.GuildVoiceStates,
          IntentsBitField.Flags.GuildMessageReactions,
          IntentsBitField.Flags.GuildIntegrations

        ],
      });

      /**
       *
       * @param {Client} client
       * @param {Message} message
       */

      client.distube = new DisTube(client, {

        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        nsfw: true, 
        plugins:[
          new YtDlpPlugin(
           // {update: false,}
          ),
        ],
        savePreviousSongs: true,
      });
     
      eventHandler(client);

      client.on('messageCreate', (message) => {
        countStickerStreak(message, client);
        countEmoji(message, client);
        /* messageHandler(client, message); */
      });

      client.on('ready', (c) => {
        client.user.setActivity('Testing in production');

      });

     await client.login(process.env.TOKEN);

    } catch (error) {
      console.log(`Error: ${error}`);
    }

  })();