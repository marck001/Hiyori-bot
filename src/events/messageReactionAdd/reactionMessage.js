const { Client, Message } = require('discord.js');
require('dotenv').config();
const { getConfig } = require('../../functions/config/getConfig')


/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, reaction, user) => {

    try {
        const config = await getConfig(reaction.message.guild.id, 'free-will')
        if (!config || config.isActive === false) return;
        const allowedChannelId = config.channelId;
        const channel = client.channels.cache.get(allowedChannelId);

        if (!channel || reaction.message.channel.id !== allowedChannelId || user.bot || !reaction || client.user.id === reaction.message.author.id) return;
        const messageChance = 0.5;
        const randomNum = Math.random();

        if(reaction.message.partial) await reaction.message.fetch()
        if(reaction.partial) await reaction.fetch()


        if (messageChance>randomNum){
            const emoji = reaction.emoji ;
            const message = reaction.message;

            console.log(emoji)
           await message.react(emoji)
       }
        
    } catch (err) {
      
        console.log("There was an error in reaction Message: ", err)
    }




};